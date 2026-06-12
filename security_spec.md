# Security Specification Audit - Apna City

## 1. Data Invariants
- **Authentication**: Only authenticated users with a registered account may submit reviews, announcements, or edit/delete business storefronts.
- **Identity Integrity**: All writes (`create`, `update`, `delete`) must verify that `request.auth.uid` matches the `ownerId` or `userId` in the document.
- **PII Isolation**: Users may read profiles of other members, but standard profiles must not hold critical billing data or confidential keys.
- **Timestamp Integrity**: All timestamps (e.g. `createdAt`) are server-bound and matched against `request.time`.
- **Establishment Bounds**: Business ratings are kept valid (e.g. `rating >= 1 && rating <= 5`). Only the administrators can set a business to `verifiedPartner` or `featured` directly.

## 2. The "Dirty Dozen" Malicious Payloads
Here are the 12 specific exploit JSON structures designed to break system invariants:

1. **Privilege Escalation (User role spoofing)**:
   - *Exploit*: Attempt to save `isAdmin: true` or `role: "admin"` directly inside the client payload upon registration.
   - *Result*: Rejected by the database rules.

2. **Storefront Theft (Modifying another merchant's shop)**:
   - *Exploit*: Submitting an update to `businesses/b_bobby` modifying its category or location phone as `ownerId: "usr_attacker"`.
   - *Result*: Rejected as the `existing().ownerId` does not match the requester.

3. **Ratings Hijack (Submitting a 5-star rating for standard shops)**:
   - *Exploit*: Standardizing 5-star ratings for standard shops, whereas 5-star ratings are restricted to `b_bobby` or admin-mediated validations.
   - *Result*: Blocked unless matched by the validation rules.

4. **Timestamp Manipulation (Backdating reviews)**:
   - *Exploit*: Submitting a review with `createdAt: "2020-01-01T00:00:00Z"` to artificially rank older listings first.
   - *Result*: Server enforces `incoming().createdAt == request.time`.

5. **Resource Poisoning (1MB long string as a business title)**:
   - *Exploit*: Creating a shop where the title is an enormous string to bloat client downloads and run up Firestore pricing tags.
   - *Result*: Egress restricted via `.size() <= 100` constraints on string fields.

6. **Shadow Field Insertion (Inserting untracked metadata)**:
   - *Exploit*: Submitting fields like `isApprovedByLgda: true` in business models to look authentic.
   - *Result*: Strictly prohibited using `keys().hasAll()` with `keys().size()`.

7. **Anonymous Vandalism (Writing reviews without logged-in account)**:
   - *Exploit*: Creating a review from a client reference with `request.auth: null`.
   - *Result*: Blocked since `isSignedIn() == true` is mandated for all mutation writes.

8. **Orphaned Review (Rating a non-existent business item)**:
   - *Exploit*: Creating a review on `businessId: "b_fake_item_9999"` to flood the system databases.
   - *Result*: Verified using `exists()` linkage on the parent ID.

9. **Announcement Clutter (Deleting state-level news notices)**:
   - *Exploit*: Standard user trying to delete Mandi rate updates posted by public associations.
   - *Result*: Denied since only authors or admin-level entities are permitted to modify announcements.

10. **State Skipping (Upgrading business ratings by bypassing review validation)**:
    - *Exploit*: Directly incrementing a business `reviewsCount` by sending a direct update block without an associated review document.
    - *Result*: Sibling locking checks or strict access prevent unlinked mutations.

11. **Injecting Malicious HTML Script Tags (XSS via review body)**:
    - *Exploit*: Review message containing `<script>alert(1)</script>` or similar injection elements.
    - *Result*: Screened by layout and type length bounds.

12. **Malformed Document ID (Slash injections in paths)**:
    - *Exploit*: Document paths with percent encoding or characters designed to hijack key lookups.
    - *Result*: Confirmed by `isValidId(id)` constraint containing alphanumeric characters and dashes.

## 3. Test Runner Checklist
All security rules are validated to reject the above exploits by default, falling back on defensive zero-trust behaviors where unlisted fields or foreign auth identifiers are present.
