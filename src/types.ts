export interface Business {
  id: string;
  name: string;
  category: "restaurant" | "hardware" | "electronics" | "school" | "college" | "retail" | "hotel" | "photography" | "gas" | "beauty" | "temple" | "mosque" | "hospital" | "pharmacy" | "bank" | "gym" | "other";
  description: string;
  address: string;
  area: string;
  phone: string;
  whatsapp?: string;
  rating: number;
  featured?: boolean;
  verifiedPartner?: boolean;
  reviewsCount: number;
  tags: string[];
  ownerId?: string;
  imageUrl?: string;
  website?: string;
}

export interface Review {
  id: string;
  businessId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  category: "announcement" | "help" | "event" | "trade" | "news";
  date: string;
  likes: number;
  userId?: string;
}

export interface TrainSchedule {
  trainNo: string;
  name: string;
  from: string;
  to: string;
  arrival: string;
  departure: string;
  days: string[];
  platformEst: number;
}

export interface RouteEstimate {
  destination: string;
  distance: string;
  timeViaNH19: string;
  timeViaExpressway?: string;
  tollEstimate: string;
  tips: string;
}

const RAW_INITIAL_BUSINESSES: Business[] = [
  {
    id: "b_bobby",
    name: "Bobby Studio Photography",
    category: "photography",
    description: "Wedding Photography, Pre-Wedding Shoots, Event Photography, Videography, Album Design, Photo Editing, Drone Shoot (availability to be confirmed), Portrait Photography. Proudly celebrated as Shikohabad's premier, highest-voted photographic institution.",
    address: "Paliwal Chauraha, Station Road, Near Dargah, Shambhunagar, Shikohabad, Uttar Pradesh 283135",
    area: "Station Road",
    phone: "9837686414",
    whatsapp: "9837686414",
    rating: 5.0,
    featured: true,
    verifiedPartner: true,
    reviewsCount: 185,
    tags: ["Wedding Photography", "Pre-Wedding", "Cine Shoots", "Photo Edits", "Drone Shoot", "Portrait"],
    ownerId: "usr_admin",
    imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=650&auto=format&fit=crop"
  },
  // -Restaurant & Food:
  {
    id: "b_dominos",
    name: "Domino's Pizza",
    category: "restaurant",
    description: "Famous gourmet pizzas, rapid home delivery, hygiene-vetted takeaways, and enjoyable seating layouts. Enjoy fresh crust pizzas in Shikohabad.",
    address: "Station Road, Ahuja Compound, Shikohabad",
    area: "Station Road",
    phone: "18002081234",
    whatsapp: "18002081234",
    rating: 4.4,
    reviewsCount: 160,
    tags: ["Pizza", "Delivery", "Takeaway", "Dine-in"],
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_mercury",
    name: "The Mercury Fine Dining Restaurant",
    category: "restaurant",
    description: "A premium fine dining multi-cuisine restaurant serving families, celebrations, and formal corporate parties. Impeccable host standards and rich local heritage delicacies.",
    address: "Station Road, Shikohabad",
    area: "Station Road",
    phone: "9761639995",
    whatsapp: "9761639995",
    rating: 4.5,
    reviewsCount: 110,
    tags: ["Family Dining", "Parties", "Restaurant", "Multi-Cuisine"],
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_lachef",
    name: "Hotel Taj Anushi & La'Chef Restaurant",
    category: "restaurant",
    description: "Premium multi-cuisine dining, sophisticated party banquets, elegant decor, and traditional hospitality on Subhash Tiraha Road.",
    address: "Subhash Tiraha Road",
    area: "Subhash Tiraha",
    phone: "9058333552",
    whatsapp: "9058333552",
    rating: 4.4,
    reviewsCount: 85,
    tags: ["Multi-Cuisine", "Banquet", "Dining", "Luxury"],
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_rasaveda_rest",
    name: "Rasa Veda Hotel & Restaurant",
    category: "restaurant",
    description: "Exquisite hotel and family restaurant option located directly on Station Road. Renowned for rich pure-vegetarian thalis and delightful desserts.",
    address: "Station Road, Opp. Mela Bagh",
    area: "Station Road",
    phone: "9456890006",
    whatsapp: "9456890006",
    rating: 4.5,
    reviewsCount: 140,
    tags: ["Hotel", "Restaurant", "Family Dining", "Pure Veg"],
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=650&auto=format&fit=crop",
    website: "https://rasavedahotel.in/shikohabad-best-hotel"
  },
  {
    id: "b_paapipet",
    name: "Paapi Pet Restaurant",
    category: "restaurant",
    description: "A fast food paradise and family restaurant offering delicious shakes, savory snacks, standard noodles, and rich North Indian thalis on Mainpuri Road.",
    address: "Mainpuri Road, Shikohabad",
    area: "Mainpuri Road",
    phone: "7302124110",
    rating: 4.3,
    reviewsCount: 55,
    tags: ["Fast Food", "Family Restaurant", "Thalis", "Burgers"],
    imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_foodcity",
    name: "Shikohabad Food City",
    category: "restaurant",
    description: "Spacious highway food plaza and modern family cafe near Subhash Tiraha. Serving multiple hot dishes, quick beverages, and fresh street snacks.",
    address: "NH-19, Near Subhash Tiraha",
    area: "National Highway / Bypass",
    phone: "Verify",
    rating: 4.2,
    reviewsCount: 65,
    tags: ["Restaurant", "Cafe", "Highway Plaza", "Snacks"],
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_chaiadda",
    name: "The Chai Adda",
    category: "restaurant",
    description: "Comfortable youth hub at Mainpuri Chauraha serving authentic kulhad chai, hand-beaten coffee, fresh bun-muska, and hot spicy snacks.",
    address: "Mainpuri Chauraha",
    area: "Mainpuri Road",
    phone: "Verify",
    rating: 4.3,
    reviewsCount: 78,
    tags: ["Tea", "Coffee", "Snacks", "Youth Hangout"],
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_joker",
    name: "Joker Coffee House & Restaurant",
    category: "restaurant",
    description: "Charming thematic coffee house on Maa Bhagwati Palace Road. Popular for artisanal cappuccinos, continental platters, and sizzling garlic pizzas.",
    address: "Maa Bhagwati Palace Road",
    area: "Maa Bhagwati Road",
    phone: "Verify",
    rating: 4.3,
    reviewsCount: 52,
    tags: ["Cafe", "Coffee", "Fast Food", "Theme Design"],
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_pooja",
    name: "Pooja Misthan Bhandar",
    category: "restaurant",
    description: "Legendary sweet house and confectioners on Bada Bazaar Road. Renowned for pure ghee namkeens, exquisite traditional laddoos, and wedding bulk orders.",
    address: "Bada Bazaar Road",
    area: "Bara Bazar",
    phone: "8273935500",
    rating: 4.5,
    reviewsCount: 130,
    tags: ["Sweets", "Namkeen", "Catering", "Desi Ghee"],
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=650&auto=format&fit=crop"
  },
  // -Hardware and Building Material Shops:
  {
    id: "b_mittal_hw",
    name: "Mittal Hardware Store",
    category: "hardware",
    description: "Highly trusted building material partner in Katra Bazar. Supplying premium engineering tools, copper piping, high-tensile screws, and sturdy kitchen fittings.",
    address: "Katra Bazar, Shikohabad",
    area: "Katra Bazar",
    phone: "9458094649",
    rating: 4.4,
    reviewsCount: 72,
    tags: ["Hardware", "Plumbing", "Building Material", "Tools"],
    imageUrl: "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_mittal_sales",
    name: "Mittal Sales Corporation",
    category: "hardware",
    description: "Prominent wholesale distributor and retailer of construction hardware materials, scaffolding, and bulk bathroom fittings.",
    address: "Station Road, Shikohabad",
    area: "Station Road",
    phone: "9897147754",
    rating: 4.4,
    reviewsCount: 58,
    tags: ["Hardware Wholesale", "Retail Tools", "Construction"],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_nandbaba",
    name: "Nand Baba Hardware",
    category: "hardware",
    description: "Leading outlet on Mainpuri Road supplying high-performance hand tools, electric drills, premium locks, and structural steel fasteners.",
    address: "Mainpuri Road, Shikohabad",
    area: "Mainpuri Road",
    phone: "9105194157",
    rating: 4.3,
    reviewsCount: 42,
    tags: ["Hardware Shop", "Industrial Tools", "Screws & Nails"],
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_jaiaambe",
    name: "Jai Aambe Steel Hardware Store",
    category: "hardware",
    description: "Specialized dealer in structural TMT iron rods, construction steel beams, heavy metal hardware, and premium industrial wire nets.",
    address: "NH-19 Bypass Road, Shikohabad",
    area: "National Highway / Bypass",
    phone: "Verify",
    rating: 4.2,
    reviewsCount: 31,
    tags: ["Steel Rods", "Hardware Fittings", "Construction Bars"],
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_gahlot",
    name: "Gahlot Hardware",
    category: "hardware",
    description: "Comprehensive hardware depot at Etah Chauraha. Offers premium wall paints, custom plumbing fittings, protective adhesives, and designer door handles.",
    address: "Etah Chauraha, Shikohabad",
    area: "Etah Chauraha",
    phone: "9012799969",
    rating: 4.4,
    reviewsCount: 61,
    tags: ["Paint Specialist", "Hardware Shops", "Plumbing Supplies"],
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_fauji",
    name: "Fauji Traders",
    category: "hardware",
    description: "Trusted local depot on Urmura Chitawali Road supplying premium grades of dry cement, fine sands, bricks, and structural building aggregates.",
    address: "Urmura Chitawali Road, Shikohabad",
    area: "Urmura Road",
    phone: "8171719898",
    rating: 4.5,
    reviewsCount: 94,
    tags: ["Building Material", "Cement Depot", "Sands & Aggregates"],
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_maadurga_hw",
    name: "Maa Durga Hardware & Sanitary",
    category: "hardware",
    description: "Renowned sanitary showroom directly opposite FCI Godown. Showcasing designer toilet bowls, premium washbasins, reliable fittings, and rustic floor tiles.",
    address: "Opp. FCI Godown, NH-19 Bypass, Shikohabad",
    area: "National Highway / Bypass",
    phone: "9058669218",
    rating: 4.3,
    reviewsCount: 47,
    tags: ["Sanitaryware", "Hardware Goods", "Tiles & Bathroom"],
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=650&auto=format&fit=crop"
  },
  // -Mobile & Electronic Shops:
  {
    id: "b_mi_store",
    name: "Mi Store Shikohabad",
    category: "electronics",
    description: "Official authorized Xiaomi flagship store near Roti Bank. Providing the newest smartphones, power banks, noise-canceling headphones, and dynamic smart home products.",
    address: "Near Roti Bank, Station Road, Shikohabad",
    area: "Station Road",
    phone: "9528906839",
    rating: 4.5,
    reviewsCount: 115,
    tags: ["Xiaomi Store", "Mobiles Dealer", "Phone Accessories"],
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_valueplus",
    name: "Value Plus Electronics",
    category: "electronics",
    description: "Multibrand electronics showroom on Pathwari Road. Best localized deals on smart LED televisions, commercial refrigerators, split air conditioners, and kitchen appliances.",
    address: "Pathwari Road, Shikohabad",
    area: "Pathwari Road",
    phone: "8171188056",
    rating: 4.4,
    reviewsCount: 89,
    tags: ["Electronics Deal", "Appliances Store", "LED TV & AC"],
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_shivshakti_mob",
    name: "Shiv Shakti Mobile",
    category: "electronics",
    description: "Experienced mobile sales, charging accessories, and rapid screen/software repairs inside Chhavi Market.",
    address: "Chhavi Market, Bara Bazar, Shikohabad",
    area: "Bara Bazar",
    phone: "9456931665",
    rating: 4.3,
    reviewsCount: 56,
    tags: ["Smartphones Sales", "Mobile Repairing", "New Accessories"],
    imageUrl: "https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_bajrang_mob",
    name: "Bajrang Mobile Shop",
    category: "electronics",
    description: "Reliable mobile repairing clinic in Awas Vikas Colony. Dedicated same-day screen replacements, battery fittings, and charger fixes.",
    address: "Awas Vikas Colony, Shikohabad",
    area: "Awas Vikas Colony",
    phone: "8506945077",
    rating: 4.2,
    reviewsCount: 28,
    tags: ["Mobile Repairing", "Display Screen Fix", "Hardware Care"],
    imageUrl: "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_tanay",
    name: "Tanay Telecom Services",
    category: "electronics",
    description: "Authorized digital services, quick mobile recharges, eSIM activations, high speed WiFi configuration, and generic telecommunication accessories.",
    address: "Station Road, Shikohabad",
    area: "Station Road",
    phone: "9719924898",
    rating: 4.3,
    reviewsCount: 39,
    tags: ["Telecom Services", "Mobile Recharge", "SIM Cards"],
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=650&auto=format&fit=crop"
  },
  // -Schools:
  {
    id: "b_blooming",
    name: "Blooming Buds Public School",
    category: "school",
    description: "Distinguished CBSE affiliated english medium school inside Mela Bagh. Combining smart classrooms, high-tech science labs, vast athletic fields, and professional day boarding care.",
    address: "Mela Bagh, Station Road, Shikohabad",
    area: "Station Road",
    phone: "9412160810, 9927429187",
    rating: 4.5,
    reviewsCount: 88,
    tags: ["CBSE School", "Smart Classes", "Sports Arena", "Day Boarding"],
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_rcs",
    name: "St. R.C.S. Academy",
    category: "school",
    description: "Highly rated junior and higher academy promoting holistic value-based children education, digital interactive screens, and mental and social skill development in Mela Bagh.",
    address: "Mela Bagh, Shikohabad",
    area: "Station Road",
    phone: "9675322322",
    rating: 4.4,
    reviewsCount: 62,
    tags: ["School Education", "Smart Learning", "Co-Ed Campus"],
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_dpis",
    name: "Delhi Public International School",
    category: "school",
    description: "State-of-the-art international syllabus school on Mustafabad Road. Facilitating smart-visual classes, expansive standard running tracks, and well-equipped computer rooms.",
    address: "Mustafabad Road, Shikohabad",
    area: "Mustafabad Road",
    phone: "7534889944",
    rating: 4.5,
    reviewsCount: 104,
    tags: ["International School", "Smart Classes", "Athletics & Sports"],
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_jaipuria",
    name: "Seth M.R. Jaipuria School",
    category: "school",
    description: "Renowned academic brand in Shikohabad. Combining rich CBSE curricula, safe chemistry/physics labs, dynamic extracurricular crafts, and safe bus transport.",
    address: "Station Road, Shikohabad",
    area: "Station Road",
    phone: "9634148191",
    rating: 4.5,
    reviewsCount: 79,
    tags: ["CBSE Curriculum", "Science Labs", "Student Activities", "Top School"],
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_vishvabharti",
    name: "Vishwa Bharti International School",
    category: "school",
    description: "Exemplary school inside Awas Vikas Colony offering spacious smart study rooms, a fully stocked modern computer laboratory, and progressive skill evaluations under CBSE board guidelines.",
    address: "Awas Vikas Colony, Shikohabad",
    area: "Awas Vikas Colony",
    phone: "9927933366",
    rating: 4.4,
    reviewsCount: 51,
    tags: ["CBSE Board", "Computer Lab", "Primary & Secondary"],
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_vishuddh",
    name: "Vishuddh International School",
    category: "school",
    description: "Prominent educational hub near Subhash Tiraha. Featuring audio-visual smart board classrooms, extensive sports grounds, and a secure city wide school bus network.",
    address: "NH-2, Subhash Tiraha, Shikohabad",
    area: "National Highway / Bypass",
    phone: "9634910751",
    rating: 4.4,
    reviewsCount: 48,
    tags: ["Smart Classrooms", "Transport System", "CBSE Co-Ed"],
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_hkvalley",
    name: "H.K. Valley Academy",
    category: "school",
    description: "A comprehensive secondary academy located on Shikohabad Road. Dedicated sports coaches, huge children playground, and an exquisite knowledge reference library.",
    address: "Shikohabad Road, Shikohabad",
    area: "National Highway / Bypass",
    phone: "9412492193",
    rating: 4.3,
    reviewsCount: 36,
    tags: ["Sports Coaching", "Academy Library", "Personalized Care"],
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_asian",
    name: "The Asian School",
    category: "school",
    description: "Distinguished primary school located within Shambhunagar, focusing on early child cognitive growth and foundational arithmetic studies.",
    address: "Shambhunagar, Shikohabad",
    area: "Shambhu Nagar",
    phone: "Verify",
    rating: 4.3,
    reviewsCount: 22,
    tags: ["Primary Education", "Cognitive Play", "Shambhunagar School"],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=650&auto=format&fit=crop"
  },
  // -College & Universities:
  {
    id: "b_fs_univ",
    name: "FS University",
    category: "college",
    description: "A gigantic state-of-the-art multi-disciplinary university offering premium technical degrees in Mechanical, Civil, CS Engineering, Nursing, paramedical diplomas, and Agricultural Science.",
    address: "NH-19 Near Balaji Mandir, Shikohabad",
    area: "National Highway / Bypass",
    phone: "9720205727",
    rating: 4.5,
    reviewsCount: 195,
    tags: ["Engineering", "Medical Diplomas", "Agriculture Science", "Mega Campus"],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_js_univ",
    name: "J.S. University",
    category: "college",
    description: "Renowned private university on Bhongaon-Mainpuri Road offering certified professional bachelors, master programs in management, and doctoral studies.",
    address: "Bhongaon-Mainpuri Road, Shikohabad",
    area: "Mainpuri Road",
    phone: "Verify",
    rating: 4.4,
    reviewsCount: 142,
    tags: ["Management Degrees", "Engineering BTech", "PhD Research"],
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_paliwal_dc",
    name: "Paliwal Degree College",
    category: "college",
    description: "Prestigious degree college inside Shambhunagar offering comprehensive UG curricula for Bachelor of Arts (BA), Bachelor of Science (BSc), and Bachelor of Commerce (BCom) streams.",
    address: "Shambhunagar, Shikohabad",
    area: "Shambhu Nagar",
    phone: "05676-234748",
    rating: 4.4,
    reviewsCount: 112,
    tags: ["BA Degree", "BSc Sciences", "BCom Commerce"],
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_adarsh_krishna",
    name: "Adarsh Krishna PG College",
    category: "college",
    description: "Distinguished postgraduate institution located in Tarun Yadav City. Providing recognized master programs, specialized guest lectures, and comfortable study rooms.",
    address: "Tarun Yadav City, Shikohabad",
    area: "Tarun Yadav City",
    phone: "05676-234416",
    rating: 4.3,
    reviewsCount: 68,
    tags: ["PG Courses", "UG Education", "Co-Ed Lectures"],
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_narain_pg",
    name: "Narain PG Degree College",
    category: "college",
    description: "An incredibly historic institution situated on Station Road, famous across the district for rich educational arts, commerce modules, and state-of-the-art physics-botany diagnostic labs.",
    address: "Station Road, Shikohabad",
    area: "Station Road",
    phone: "05676-234478",
    rating: 4.5,
    reviewsCount: 125,
    tags: ["Historic Degrees", "Arts Classes", "Science Laboratories"],
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=650&auto=format&fit=crop"
  },
  // -Retail & Shopping:
  {
    id: "b_vishal_mart",
    name: "Vishal Mega Mart",
    category: "retail",
    description: "Spacious multi-story department hypermarket on Station Road. High quality groceries, fashionable garments, household appliances, and regular custom discount coupons.",
    address: "Station Road, Shikohabad",
    area: "Station Road",
    phone: "8287515546",
    rating: 4.4,
    reviewsCount: 220,
    tags: ["Grocery Shopping", "Trendy Clothes", "Household Items"],
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_baba_coll",
    name: "Baba Collection",
    category: "retail",
    description: "Specialized readymade garments outlet in Arun Yadav City catering to kids birthday wear, ladies suits, and fancy menswear items.",
    address: "Arun Yadav City, Shikohabad",
    area: "Arun Yadav City",
    phone: "8881444467",
    rating: 4.3,
    reviewsCount: 45,
    tags: ["Garments Store", "Kidswear", "Ethnic Mens"],
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_sreeja_coll",
    name: "Sreeja Collection",
    category: "retail",
    description: "Boutique clothes hub stocking seasonal sarees, embroidery suits, bridal catalogs, and popular fashion accessories.",
    address: "Station Road, Shikohabad",
    area: "Station Road",
    phone: "8171937414",
    rating: 4.3,
    reviewsCount: 38,
    tags: ["Ethnic Boutique", "Designer Sarees", "Girls Fashion"],
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_atul_garments",
    name: "Atul Garments",
    category: "retail",
    description: "High street clothing store in Arun Yadav City presenting wonderful regular jeans, premium casual shirts, and winter collections.",
    address: "Arun Yadav City, Shikohabad",
    area: "Arun Yadav City",
    phone: "9927731200",
    rating: 4.4,
    reviewsCount: 52,
    tags: ["Fashion Retailer", "Mens Jeans", "Shirting Corner"],
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=650&auto=format&fit=crop"
  },
  // -Hotels & Resorts:
  {
    id: "b_shrineha",
    name: "Shri Neha's Hotel & Restaurant",
    category: "hotel",
    description: "Deluxe lodging rooms, dynamic in-house dining restaurant, and well decorated formal marriage party banquets near Mela Wala Bagh.",
    address: "Mela Wala Bagh, Station Road, Shikohabad",
    area: "Station Road",
    phone: "9634440009",
    rating: 4.4,
    reviewsCount: 95,
    tags: ["Rooms Accomodation", "Restaurant", "Banquet Hall"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_greenpark",
    name: "Green Park Hotel & Restaurant",
    category: "hotel",
    description: "Excellent high-efficiency hotel at Etah Road Chauraha. Offering premium AC rooms, round-the-clock helpful room services, delicious dining options, and ample parking space.",
    address: "NH-2, Etah Road Chauraha, Shikohabad",
    area: "Etah Chauraha",
    phone: "8445780907",
    rating: 4.4,
    reviewsCount: 88,
    tags: ["AC Rooms", "Family Restaurant", "Secure Parking"],
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_bharatresort",
    name: "Bharat Resort Budrai",
    category: "hotel",
    description: "Elegant, serene highway getaway on Budrai Road. Ideal premium wedding celebration destination, massive shopping lawns, beautiful room suites, and grand stage layouts.",
    address: "Budrai Road, Shikohabad",
    area: "Budrai Road",
    phone: "9058602128",
    rating: 4.5,
    reviewsCount: 135,
    tags: ["Wedding Resort", "Marriage Lawns", "AC Suites"],
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_asluxury",
    name: "Hotel A.S Luxury Inn",
    category: "hotel",
    description: "Sophisticated boutique rooms and business stay suites located cleanly on the NH-19 Bypass zone, with modern security parking.",
    address: "NH-19 Bypass, Shikohabad",
    area: "National Highway / Bypass",
    phone: "Verify",
    rating: 4.3,
    reviewsCount: 56,
    tags: ["Boutique Inn", "Highway Accomodations", "Clean Staying"],
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_maaanjani",
    name: "Hotel Maa Anjani Grand Inn",
    category: "hotel",
    description: "A prestigious premium campus hotel layout on Etah Road. Complete luxury suites, multicuisine restaurant buffers, grand corporate meeting rooms, and lush wedding catering.",
    address: "Maa Anjani Campus, Etah Road, Shikohabad",
    area: "Etah Chauraha",
    phone: "7817093337",
    rating: 4.5,
    reviewsCount: 142,
    tags: ["Grand Suites", "Deluxe Rooms", "Lush Catering", "Multicuisine Buffet"],
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=650&auto=format&fit=crop",
    website: "https://www.hotelmaaanjanigrandinn.com"
  },
  {
    id: "b_bankebihari",
    name: "OYO Banke Bihari Guest House",
    category: "hotel",
    description: "Comfortable and pocket-friendly guestrooms and local restaurant on NH-19. Clean beds, helpful check-in staff, and instant travel support.",
    address: "NH-19, Shikohabad",
    area: "National Highway / Bypass",
    phone: "1246201516",
    rating: 4.2,
    reviewsCount: 49,
    tags: ["OYO Rooms", "Budget Accommodation", "Food & Lodging"],
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_jaankimahal",
    name: "Maa Jaanki Mahal (Best Hotel In Shikohabad)",
    category: "hotel",
    description: "Legendary and top-voted guest wedding venue hotel in Shikohabad, located 2 KM from Etah Chauraha. Facilitating premium grand marriage halls, huge air-cooled banquet theaters, private car parking, and luxury suites.",
    address: "2 KM from Etah Chauraha, Shikohabad Road, Shikohabad",
    area: "Etah Chauraha",
    phone: "9927666666",
    rating: 4.5,
    reviewsCount: 178,
    tags: ["Top Rating Venue", "Marriage Hall", "AC Banquets", "Accommodation Parking"],
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_gas_hp_shiko",
    name: "Shikohabad HP Gas Agency",
    category: "gas",
    description: "Authorized HP Gas distributor in Pratappur, near the overbridge. Dedicated to safe LPG connection provisioning, residential cylinder home deliveries, commercial cylinder supplies, and consumer gas stove servicing.",
    address: "Shop No. 08, Pratappur, Near Overbridge, Shikohabad, UP 283135",
    area: "Pratappur",
    phone: "+91 82793 37301",
    whatsapp: "8279337301",
    rating: 4.3,
    reviewsCount: 64,
    tags: ["HP Gas", "Gas Distributor", "Overbridge", "LPG Cylinder", "Refill"],
    imageUrl: "https://images.unsplash.com/photo-1525695230005-efd074ec169f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_gas_hp_hemcharan",
    name: "Amar Shaheed Hemcharan HP Gas Agency Office",
    category: "gas",
    description: "Leading HP Gas service office located at Mahadev Nagar, Shikohabad. Providing comprehensive customer registrations, cylinder refills, secure double-bottle connection conversions, and safety briefings.",
    address: "1068/1A, Mahadev Nagar, Shikohabad, UP 283135",
    area: "Mahadev Nagar",
    phone: "05676-239190",
    rating: 4.2,
    reviewsCount: 45,
    tags: ["HP Gas", "Gas Distributor", "Mahadev Nagar", "Agency Office", "LPG Connection"],
    imageUrl: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_gas_bharat_aryan",
    name: "Aryan Bharat Gas Agency",
    category: "gas",
    description: "Reliable Bharat Gas cylinder distributor serving Shambhunagar and surrounding sectors. Delivering high-standard LPG refueling services and quick emergency leak-checking operations.",
    address: "Shambhunagar, Shikohabad, UP 283135",
    area: "Shambhu Nagar",
    phone: "Not Available",
    rating: 4.1,
    reviewsCount: 38,
    tags: ["Bharat Gas", "Gas Distributor", "Shambhunagar", "Agency Office", "Cylinder booking"],
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_gas_bharat_kishan",
    name: "M/s Kishan Bharatgas",
    category: "gas",
    description: "Prominent Bharat Gas dealer located at Rukanpur near Awas Vikas Colony. Famously offering smooth cylinder booking operations, timely doorstep refilling, and authorized regulator replacements.",
    address: "Rukanpur, Awas Vikas Colony, Shikohabad, UP 283135",
    area: "Awas Vikas Colony",
    phone: "+91 87555 80819",
    whatsapp: "8755580819",
    rating: 4.4,
    reviewsCount: 79,
    tags: ["Bharat Gas", "Gas Distributor", "Awas Vikas", "Rukanpur", "Doorstep Delivery"],
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_gas_bharat_jaimatadi",
    name: "Jai Mata Di Bharatgas, Shikohabad",
    category: "gas",
    description: "Trusted gas distribution agency on State Highway SH-85, Burharai. Specializing in retail LPG booking, connection management, prompt cylinder dispatching, and safety equipment distribution.",
    address: "SH-85, Burharai, Shikohabad, UP 283135",
    area: "Burharai",
    phone: "Not Available",
    rating: 4.2,
    reviewsCount: 41,
    tags: ["Bharat Gas Distributor", "Burharai", "LPG Cylinder", "Refill Booking"],
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=650&auto=format&fit=crop"
  },
  // Beauty Parlours & Salons
  {
    id: "b_beauty_lakme",
    name: "Lakmé Salon",
    category: "beauty",
    description: "Premium professional beauty and grooming salon offering hair styling, bridal makeup packages, refreshing facial/skincare treatments, and modern hair spa options.",
    address: "Station Road, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "+91 80575 12345",
    rating: 4.6,
    reviewsCount: 92,
    tags: ["Hair Cut", "Hair Spa", "Makeup", "Bridal Makeup", "Facial", "Skin Care"],
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_beauty_jawed",
    name: "Jawed Habib Hair & Beauty",
    category: "beauty",
    description: "Renowned brand franchise offering professional hair styling, hair treatments, premium grooming, and custom party makeup packages by certified salon artists.",
    address: "Near Main Market, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "+91 94123 98765",
    rating: 4.5,
    reviewsCount: 81,
    tags: ["Hair Styling", "Hair Treatment", "Makeup", "Grooming"],
    imageUrl: "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_beauty_shringar",
    name: "Shringar Beauty Parlour",
    category: "beauty",
    description: "A highly trusted local beauty store specialized in traditional bridal makeup, specialized waxing services, classic facials, and customizable hair designs.",
    address: "Awas Vikas Colony, Shikohabad, UP 283135",
    area: "Awas Vikas Colony",
    phone: "+91 97561 24680",
    rating: 4.3,
    reviewsCount: 52,
    tags: ["Bridal Makeup", "Facial", "Waxing", "Hair Styling"],
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_beauty_muskan",
    name: "Muskan Beauty Parlour",
    category: "beauty",
    description: "Popular ladies beauty studio offering budget-friendly party makeup, detailed bridal mehndi, complete hair care routines, and organic skincare options.",
    address: "Katra Bazar, Shikohabad, UP 283135",
    area: "Katra Bazar",
    phone: "+91 98372 15943",
    rating: 4.2,
    reviewsCount: 38,
    tags: ["Makeup", "Mehndi", "Hair Care", "Skin Care"],
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_beauty_anjali",
    name: "Anjali Beauty Parlour",
    category: "beauty",
    description: "Dedicated salon for comprehensive wellness and wedding preparation. Offering complete bridal packages, skincare threading, facial cleansing, and hair repair services.",
    address: "Shambhunagar, Shikohabad, UP 283135",
    area: "Shambhu Nagar",
    phone: "Not Available",
    rating: 4.1,
    reviewsCount: 29,
    tags: ["Bridal Package", "Facial", "Threading", "Hair Treatment"],
    imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_beauty_newlook",
    name: "New Look Beauty Parlour",
    category: "beauty",
    description: "Expert beauticians providing the latest styles in makeup, customized hair cutting, hair coloring, and glowing facials at competitive prices.",
    address: "Main Market, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Not Available",
    rating: 4.3,
    reviewsCount: 41,
    tags: ["Makeup", "Hair Styling", "Facial"],
    imageUrl: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_beauty_queen",
    name: "Queen Beauty Parlour",
    category: "beauty",
    description: "Premium women-only boutique offering royal bridal packages, deep conditioning hair spa therapies, and anti-aging charcoal facials.",
    address: "Station Road, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "Not Available",
    rating: 4.4,
    reviewsCount: 33,
    tags: ["Bridal Makeup", "Hair Spa", "Facial"],
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_beauty_glamour",
    name: "Glamour Beauty Salon",
    category: "beauty",
    description: "Modern salon specializing in modern hair styling techniques, dermatological skin care treatments, and heavy makeup for special family celebrations.",
    address: "Etah Road, Shikohabad, UP 283135",
    area: "Etah Road",
    phone: "+91 88876 54321",
    rating: 4.2,
    reviewsCount: 46,
    tags: ["Hair Styling", "Skin Care", "Bridal Makeup"],
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=650&auto=format&fit=crop"
  },

  // Temples
  {
    id: "b_temple_hanuman",
    name: "Shri Hanuman Mandir",
    category: "temple",
    description: "A peaceful and dynamic temple on Station Road. Attracting hundreds of local devotees daily, hosting spiritual satsangs, public bhandara feasts, and majestic Tuesday aartis.",
    address: "Station Road, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "Not Available",
    rating: 4.8,
    reviewsCount: 210,
    tags: ["Daily Aarti", "Religious Programs", "Festivals", "Sunderkand"],
    imageUrl: "https://images.unsplash.com/photo-1601579240751-24072202618a?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_temple_shiv",
    name: "Prachin Shiv Mandir",
    category: "temple",
    description: "Historic ancient Shiva temple located in the heart of Shikohabad. Famed for its highly auspicious old Shiva Lingam, massive Shivratri celebration queues, and daily divine prayers.",
    address: "Main Market Area, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Not Available",
    rating: 4.9,
    reviewsCount: 165,
    tags: ["Shivratri Celebrations", "Daily Puja", "Ancient Shiva Lingam", "Pradosh Vrat"],
    imageUrl: "https://images.unsplash.com/photo-1609137144814-7f94ff0787e9?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_temple_kali",
    name: "Kali Mata Mandir",
    category: "temple",
    description: "A prominent temple dedicated to Goddess Kali on Etah Road. Renowned for spiritual rejuvenation during Navratri festivals, continuous kirtans, and daily floral offerings.",
    address: "Etah Road, Shikohabad, UP 283135",
    area: "Etah Road",
    phone: "Not Available",
    rating: 4.7,
    reviewsCount: 142,
    tags: ["Navratri Celebrations", "Daily Worship", "Havan", "Maha Aarti"],
    imageUrl: "https://images.unsplash.com/photo-1608976328267-e673d3ec06ce?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_temple_durga",
    name: "Durga Mandir",
    category: "temple",
    description: "A highly revered community temple in Awas Vikas Colony, featuring beautifully sculpted deities, organizing regular Ramayana recitations, and major community-supported religious events.",
    address: "Awas Vikas Colony, Shikohabad, UP 283135",
    area: "Awas Vikas Colony",
    phone: "Not Available",
    rating: 4.8,
    reviewsCount: 125,
    tags: ["Religious Gatherings", "Festivals", "Mata ki Chowki", "Bhajans"],
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_temple_radhakrishna",
    name: "Radha Krishna Mandir",
    category: "temple",
    description: "Serene sacred shrine inside Shambhunagar layout. Celebrated for its daily evening kirtans, peaceful meditation atmosphere, and spectacular colorful Janmashtami stage decorations.",
    address: "Shambhunagar, Shikohabad, UP 283135",
    area: "Shambhu Nagar",
    phone: "Not Available",
    rating: 4.9,
    reviewsCount: 98,
    tags: ["Bhajan", "Kirtan", "Janmashtami Celebrations", "Prasad"],
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb061271f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_temple_balaji",
    name: "Balaji Mandir",
    category: "temple",
    description: "Majestic spiritual sanctuary situated along National Highway NH-19 near FS University. Beautiful temple complex offering quiet worship zones, lush premises, and weekend darshan distributions.",
    address: "NH-19, Near FS University, Shikohabad, UP 283135",
    area: "NH-19 Bypass",
    phone: "Not Available",
    rating: 4.8,
    reviewsCount: 112,
    tags: ["Daily Darshan", "Religious Events", "Hanuman Chalisa", "NH-19 Gate"],
    imageUrl: "https://images.unsplash.com/photo-1617653202545-930d97968c1f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_temple_sankatmochan",
    name: "Sankat Mochan Hanuman Mandir",
    category: "temple",
    description: "Revered Hanuman shrine located near the bustling Main Chauraha. Devotees visit specifically on Tuesdays and Saturdays to seek protection, perform special oil lamp rituals, and participate in community aartis.",
    address: "Near Main Chauraha, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Not Available",
    rating: 4.8,
    reviewsCount: 154,
    tags: ["Tuesday Special Puja", "Aarti", "Sankat Mochan Path", "Hanuman Puja"],
    imageUrl: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=650&auto=format&fit=crop"
  },

  // Mosques
  {
    id: "b_mosque_jama",
    name: "Jama Masjid Shikohabad",
    category: "mosque",
    description: "The primary and historic Jama Masjid of Shikohabad, located in the central city area. Hosting thousands of worshippers for weekly Friday (Jumma) prayers, delivering theological briefings, and celebrating Eid festivals with grand unity.",
    address: "Main City Area, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Not Available",
    rating: 4.9,
    reviewsCount: 198,
    tags: ["Daily Namaz", "Friday Prayer", "Religious Gatherings", "Grand Eid Prayers"],
    imageUrl: "https://images.unsplash.com/photo-1597935258735-e254c1839512?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_mosque_shahi",
    name: "Shahi Masjid",
    category: "mosque",
    description: "An elegant historic masjid near the Station Road corridor, famous for its calm interiors, high-standing minarets, children's Islamic literature classes, and regular prayer meetings.",
    address: "Station Road Area, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "Not Available",
    rating: 4.7,
    reviewsCount: 88,
    tags: ["Namaz", "Islamic Education", "Community Madrasa", "Peaceful Hall"],
    imageUrl: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_mosque_noorani",
    name: "Noorani Masjid",
    category: "mosque",
    description: "A well-maintained neighborhood mosque in Shambhunagar, operating five times daily congregational salah, and conducting active neighborhood charity and civic programs.",
    address: "Shambhunagar, Shikohabad, UP 283135",
    area: "Shambhu Nagar",
    phone: "Not Available",
    rating: 4.6,
    reviewsCount: 61,
    tags: ["Daily Prayer", "Community Activities", "Evening Lessons", "Sadaqah Intake"],
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_mosque_madina",
    name: "Madina Masjid",
    category: "mosque",
    description: "Revered spiritual landmark in the Katra Bazar trade zone. Welcoming shopkeepers, local residents, and visitors throughout the commercial hours for peaceful salah.",
    address: "Katra Bazar Area, Shikohabad, UP 283135",
    area: "Katra Bazar",
    phone: "Not Available",
    rating: 4.8,
    reviewsCount: 75,
    tags: ["Namaz", "Religious Programs", "Dars (Lectures)", "Katra Bazaar Sector"],
    imageUrl: "https://images.unsplash.com/photo-1597935258735-e254c1839512?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_mosque_raza",
    name: "Masjid-e-Raza",
    category: "mosque",
    description: "Spacious multi-level congregational mosque near the Main Market block, featuring pristine wudu facilities, high capacity ventilation headers, and proactive social welfare services.",
    address: "Near Main Market, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Not Available",
    rating: 4.7,
    reviewsCount: 67,
    tags: ["Friday Prayer", "Community Services", "Ramadan Feedings", "Wudu Facility"],
    imageUrl: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "b_mosque_eidgah",
    name: "Eidgah Shikohabad",
    category: "mosque",
    description: "Massive outdoor Eid prayer ground and mosque arena on the outskirts of Shikohabad. Hosts tens of thousands of worshippers during Eid-ul-Fitr and Eid-ul-Adha holiday morning prayers.",
    address: "Outskirts of Shikohabad, UP 283135",
    area: "NH-19 Bypass",
    phone: "Not Available",
    rating: 4.9,
    reviewsCount: 245,
    tags: ["Eid Prayers", "Religious Gatherings", "Mass Congregations", "Huge Open Ground"],
    imageUrl: "https://images.unsplash.com/photo-1597935258735-e254c1839512?q=80&w=650&auto=format&fit=crop"
  },

  // --- NEWLY ADDED REGISTERED LOCATIONS ---

  // Hospitals & Healthcare
  {
    id: "hosp_rk_modern",
    name: "R K Modern Hospital",
    category: "hospital",
    description: "Premium multispeciality hospital, immediate emergency care, multi-bed wards, specialized OPD services, and general medical procedures under certified experts.",
    address: "Shikohabad Road, Shikohabad, UP 283135",
    area: "National Highway / Bypass",
    phone: "9457156821",
    whatsapp: "9457156821",
    rating: 4.6,
    reviewsCount: 84,
    tags: ["Multispeciality", "Emergency Care", "OPD Services", "Doctor Clinic"],
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d3b3ec998365?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "hosp_vivekpriya",
    name: "VivekPriya Hospital",
    category: "hospital",
    description: "Highly rated private medical hospital providing 24/7 general medicine checks, emergency triage services, custom inpatient care chambers, and clean surgical operations.",
    address: "Station Road, Near J.S. Memorial Public School, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "8077964946",
    rating: 4.5,
    reviewsCount: 65,
    tags: ["General Hospital", "Emergency Services", "Inpatient Care", "Station Road Diagnostic"],
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "hosp_hare_krishna",
    name: "Hare Krishna Hospital",
    category: "hospital",
    description: "Dedicated general medicine and private healthcare hospital near Naveen Mandi area. Providing clean recovery wards, emergency diagnostic services, and wellness consulting.",
    address: "Naveen Mandi Area, Shikohabad, UP 283135",
    area: "Bypass Road",
    phone: "Verify Locally",
    rating: 4.2,
    reviewsCount: 22,
    tags: ["General Medicine", "Emergency Care", "Private Hospital", "Mandi Clinic"],
    imageUrl: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "hosp_js_memorial",
    name: "J.S. Memorial Hospital",
    category: "hospital",
    description: "Modern general healthcare institution located on Station Road. Renowned for prompt OPD services, health screening checkups, and child specialist consultants.",
    address: "Station Road, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "Verify Locally",
    rating: 4.4,
    reviewsCount: 39,
    tags: ["General Healthcare", "OPD Services", "Station Road Ward"],
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "hosp_chc_gov",
    name: "Government Community Health Centre (CHC)",
    category: "hospital",
    description: "Official Government health facility in Shikohabad offering affordable public healthcare setups, emergency life-saving protocols, and regular public immunization/vaccination events.",
    address: "Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Verify Locally",
    rating: 4.0,
    reviewsCount: 74,
    tags: ["Government Healthcare", "Emergency Services", "Vaccination Spot", "Affordable Medicine"],
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=650&auto=format&fit=crop"
  },

  // Medical Stores (Pharmacies)
  {
    id: "med_singhal",
    name: "Singhal Medical Store",
    category: "pharmacy",
    description: "Reliable town pharmacist stocking general health supplements, genuine prescription medicines, first-aid surgical products, and childcare supplies.",
    address: "Shikohabad, UP 283135",
    area: "Main Market",
    phone: "9457088602",
    rating: 4.5,
    reviewsCount: 52,
    tags: ["Medicines", "Surgical Items", "Prescription Drugs"],
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "med_naina",
    name: "Naina Medical Store",
    category: "pharmacy",
    description: "Centrally located pharmacy on NH-2 Bypass providing emergency medication, retail surgical items, and generic cosmetic skincare necessities.",
    address: "Katra Bazar, NH-2, Shikohabad, UP 283135",
    area: "Katra Bazar",
    phone: "6396287765",
    rating: 4.4,
    reviewsCount: 41,
    tags: ["Medicines", "Surgical Items", "Healthcare Products", "Katra Bazaar Store"],
    imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "med_bharat_jan",
    name: "Bharat Jan Medical Store",
    category: "pharmacy",
    description: "Excellent 24x7 community pharmacy near Mainpuri Chauraha. Offering complete lists of emergency medications, surgical aids, and wellness monitoring gadgets.",
    address: "Mainpuri Chauraha, Near Petrol Pump, Shikohabad, UP 283135",
    area: "Mainpuri Road",
    phone: "9761410410",
    rating: 4.7,
    reviewsCount: 68,
    tags: ["24x7 Medicines", "Healthcare Products", "Mainpuri Chauraha Corner"],
    imageUrl: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "med_agrawal",
    name: "Agrawal Medical Store",
    category: "pharmacy",
    description: "Trusted local chemist shop inside Katra Bazar corridor. Providing daily OTC pain relief items, genuine baby care products, and reliable wellness supplies.",
    address: "Katra Bazar, Shikohabad, UP 283135",
    area: "Katra Bazar",
    phone: "Verify Locally",
    rating: 4.3,
    reviewsCount: 29,
    tags: ["Medicines Selection", "OTC Products", "Healthcare Supplies"],
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "med_gupta",
    name: "Gupta Medical Store",
    category: "pharmacy",
    description: "Conveniently located drug store on Station Road stocking a wide variety of verified ethical prescription formulas and daily physical health pills.",
    address: "Station Road, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "Verify Locally",
    rating: 4.2,
    reviewsCount: 31,
    tags: ["Prescription Medicines", "General Healthcare Products", "Station Road Pharmacy"],
    imageUrl: "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=650&auto=format&fit=crop"
  },

  // Banks
  {
    id: "bank_sbi",
    name: "State Bank of India (SBI)",
    category: "bank",
    description: "The primary national public sector bank branch in Bada Bazaar corridor. Offers complete commercial accounts, localized ATMs, loan applications, and personal savings accounts.",
    address: "Bada Bazaar Road, Shikohabad, UP 283135",
    area: "Bara Bazar",
    phone: "18001234",
    rating: 4.2,
    reviewsCount: 162,
    tags: ["Banking Services", "ATM Available", "Government Loans", "Savings Department"],
    imageUrl: "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "bank_boi",
    name: "Bank of India (BOI)",
    category: "bank",
    description: "Highly accessible financial branch situated on Station Road. Operating prompt currency deposits, corporate checking systems, and safe deposit boxes.",
    address: "Station Road, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "Verify Locally",
    rating: 4.1,
    reviewsCount: 88,
    tags: ["Banking Core", "Station Road ATM", "Loans & Margins", "Current Accounts"],
    imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "bank_axis",
    name: "Axis Bank",
    category: "bank",
    description: "Premium private branch located at Katra Meera. Known for rapid internet banking setups, loan consultation counters, and high speed cash dispensation ATMs.",
    address: "Katra Meera, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "18605005555",
    rating: 4.4,
    reviewsCount: 104,
    tags: ["Private Banking", "High Speed ATM", "Internet Banking", "Retail Loans"],
    imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "bank_ujjivan",
    name: "Ujjivan Small Finance Bank",
    category: "bank",
    description: "Micro-finance and small business savings branch situated on NH-19 Shahjalpur. Offering convenient localized collateral-free business loans and personal checking assets.",
    address: "NH-19, Shahjalpur, Shikohabad, UP 283135",
    area: "National Highway / Bypass",
    phone: "8068434180",
    rating: 4.3,
    reviewsCount: 45,
    tags: ["Small Savings Accounts", "Micro-finance Loans", "Banking Services", "Shahjalpur Branch"],
    imageUrl: "https://images.unsplash.com/photo-1616514197671-15d99ce7a6f8?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "bank_pnb",
    name: "Punjab National Bank (PNB)",
    category: "bank",
    description: "A prominent main state branch in Main Market Area, serving public agricultural loans, student education checking systems, and general ATM lockers.",
    address: "Main Market Area, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Verify Locally",
    rating: 4.0,
    reviewsCount: 92,
    tags: ["Nationalized Bank", "ATM Locker", "Agricultural Credit"],
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "bank_canara",
    name: "Canara Bank",
    category: "bank",
    description: "Respected state-owned bank branch in Shikohabad. Assisting local retail traders, providing safe deposit vaults, and conducting monthly community financial literacy forums.",
    address: "Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Verify Locally",
    rating: 4.1,
    reviewsCount: 57,
    tags: ["Banking Services", "Deposit Vaults", "Traders Credit Account"],
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=650&auto=format&fit=crop"
  },

  // Petrol Pumps & Gas
  {
    id: "gas_hp_shokhiram",
    name: "HP Petrol Pump - Shokhiram Khatri & Sons",
    category: "gas",
    description: "A highly trusted highway refueling destination on Agra Road. Supplying quality power-diesel and clean petrol fuel under strict automatic flow sensors. Offering free digital air facility and UPI instant payments.",
    address: "Agra Road, Shikohabad, UP 283135",
    area: "National Highway / Bypass",
    phone: "9412159707",
    whatsapp: "9412159707",
    rating: 4.5,
    reviewsCount: 142,
    tags: ["HP Petrol", "Turbo Diesel", "Automated Clean Air", "UPI Payment Fuel"],
    imageUrl: "https://images.unsplash.com/photo-1523871145332-9cb7e7fbdb93?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "gas_hp_hindustan",
    name: "Hindustan Petroleum Pump",
    category: "gas",
    description: "Prominent Agra Road petrol station with massive multi-nozzle islands. Famous for accurate fuel measurement audits, rapid digital billing, and well-lit highway access.",
    address: "Agra Road, Shikohabad, UP 283135",
    area: "National Highway / Bypass",
    phone: "9897024415",
    rating: 4.4,
    reviewsCount: 110,
    tags: ["Fuel Station", "Agra Road Petrol", "Hindustan Diesel", "Digital QR Payments"],
    imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "gas_ioc_highway",
    name: "Indian Oil Petrol Pump",
    category: "gas",
    description: "24/7 Indian Oil highway refueling depot situated cleanly on NH-19 route. Facilitating free emergency drinking water, quick localized tire air pressure tests, and separate heavy truck service slots.",
    address: "NH-19, Shikohabad, UP 283135",
    area: "NH-19 Bypass",
    phone: "Verify Locally",
    rating: 4.3,
    reviewsCount: 89,
    tags: ["Indian Oil", "24x7 Fuel Station", "Highway Water & Air", "Premium Petrol"],
    imageUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "gas_bp_etah",
    name: "Bharat Petroleum Pump",
    category: "gas",
    description: "Premium BP fuel station operating directly on Etah Road. Offering state-of-the-art electronic fuel dispensation, separate credit transactions, and friendly security helpers.",
    address: "Etah Road, Shikohabad, UP 283135",
    area: "Etah Chauraha",
    phone: "Verify Locally",
    rating: 4.2,
    reviewsCount: 61,
    tags: ["Bharat Petroleum", "BP Petrol", "Etah Road Diesel", "UPI Payment Enabled"],
    imageUrl: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=650&auto=format&fit=crop"
  },

  // Gym & Fitness Centers
  {
    id: "gym_iron_kingdom",
    name: "The Iron Kingdom Gym",
    category: "gym",
    description: "The ultimate bodybuilding and strength fitness hub inside Mehra Colony Shambhunagar. Equipped with imported heavy dumbbells, sturdy functional cables, and professional aerobic guidance.",
    address: "Mehra Colony, Shambhunagar, Shikohabad, UP 283135",
    area: "Shambhu Nagar",
    phone: "9389331720",
    rating: 4.8,
    reviewsCount: 79,
    tags: ["Weight Training", "Heavy Lifting Cardio", "Fitness Coaching", "Mehra Colony Bodybuilding"],
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "gym_fitness_spot",
    name: "The Fitness Spot",
    category: "gym",
    description: "Centrally located fitness center in Bara Bazar zone. Incorporating high performance treadmills, personal training charts, custom weight loss programs, and refreshing energy nutrition drinks.",
    address: "Bada Bazaar Road, Mishrana, Shikohabad, UP 283135",
    area: "Bara Bazar",
    phone: "7017814869",
    rating: 4.7,
    reviewsCount: 62,
    tags: ["Personal Training", "Weight Loss Programs", "Treadmills Cardio Studio", "High Contrast Gym"],
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "gym_fit_nation",
    name: "Fit Nation Gym",
    category: "gym",
    description: "Modern gym zone on Station Road providing dynamic aerobic workout programs, complete steel dumbbell stacks, certified strength instructors, and modern audio beats.",
    address: "Station Road, Shikohabad, UP 283135",
    area: "Station Road",
    phone: "Verify Locally",
    rating: 4.5,
    reviewsCount: 48,
    tags: ["Cardio Exercises", "Strength Training Beats", "Fitness Programs", "Station Road Gym"],
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "gym_power_house",
    name: "Power House Gym",
    category: "gym",
    description: "A hard-core muscle building club on Etah Road. Offering wide weight training plates, high standard squat racks, and experienced local bodybuilding tournament judges.",
    address: "Etah Road, Shikohabad, UP 283135",
    area: "Etah Chauraha",
    phone: "Verify Locally",
    rating: 4.4,
    reviewsCount: 41,
    tags: ["Hardcore Muscle Gym", "Bodybuilding Racks", "Etah Road Strength"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=650&auto=format&fit=crop"
  },
  {
    id: "gym_muscle_factory",
    name: "Muscle Factory Gym",
    category: "gym",
    description: "Highly spacious physical training complex in Main Market Area. Equipped with premium multi-gym machines, separate modern aerobic slots, and expert dietary layout counseling.",
    address: "Main Market Area, Shikohabad, UP 283135",
    area: "Main Market",
    phone: "Verify Locally",
    rating: 4.6,
    reviewsCount: 55,
    tags: ["Weight Training Machines", "Aerobic Exercise Slots", "Dietary Counseling"],
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=650&auto=format&fit=crop"
  }
];

export const INITIAL_BUSINESSES: Business[] = RAW_INITIAL_BUSINESSES;

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    businessId: "b_bobby",
    author: "Rahul Sharma",
    rating: 5.0,
    comment: "Simply the best wedding photography team in Shikohabad! The drone shoots and luxury album they made for my marriage are breathtaking. Bobby Studio holds absolute quality.",
    createdAt: "2026-05-18T10:30:00Z"
  },
  {
    id: "r2",
    businessId: "b_dominos",
    author: "Sneha Yadav",
    rating: 4.0,
    comment: "Excellent hot pizzas as expected from Domino's. Seating is clean, delivery is incredibly fast. Very happy to have an official outlet on Station Road.",
    createdAt: "2026-05-24T14:15:00Z"
  },
  {
    id: "r3",
    businessId: "b_fs_univ",
    author: "Dr. Alok Chaturvedi",
    rating: 5.0,
    comment: "Excellent academic standards, high tech labs and beautiful massive green campus layout. Offers premium nursing and agricultural fields degree choices.",
    createdAt: "2026-05-12T09:00:00Z"
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "news_1",
    title: "NH-19 Bypass Flyover Expansion Approved by NHAI",
    content: "Excellent news for daily commuters! The National Highways Authority of India (NHAI) has officially sanctioned the expansion of the NH-19 Shikohabad bypass intersection. The project aims to reduce traffic bottleneck near the glass factory stretch. Construction is slated to begin early next month.",
    author: "Mainpost Office Circle",
    category: "news",
    date: "2026-05-31T09:00:00Z",
    likes: 42
  },
  {
    id: "a1",
    title: "Upcoming Ramlila Fair 2026 Organizing Committee Meeting",
    content: "The annual Ramlila Organizing Committee is convening this Friday at 6:00 PM at Ramlila Ground Office. All local merchant associations, sweets makers, volunteers, and police focal points are requested to attend for layout allocations and security passes.",
    author: "Seth Ram Prakash (Pradhan)",
    category: "event",
    date: "2026-05-30T12:00:00Z",
    likes: 18
  },
  {
    id: "a2",
    title: "Potato Mandi Rates Update - May 31, 2026",
    content: "Today's premium potato arrival at Firozabad-Shikohabad Galla Mandi sold at ₹1480 - ₹1680 per quintal. Supply remains robust. Cold storages are advised to clear old stocks to prevent rain dampening.",
    author: "Shikohabad Mandi Association",
    category: "trade",
    date: "2026-05-31T06:30:00Z",
    likes: 31
  }
];

export const CITY_TRAINS: TrainSchedule[] = [
  {
    trainNo: "12420",
    name: "Gomti Express",
    from: "New Delhi (NDLS)",
    to: "Lucknow Jn (LJN)",
    arrival: "16:22",
    departure: "16:24",
    days: ["Daily"],
    platformEst: 2
  },
  {
    trainNo: "14218",
    name: "Unchahar Express",
    from: "Chandigarh (CDG)",
    to: "Prayagraj Sangam (PYGS)",
    arrival: "22:15",
    departure: "22:17",
    days: ["Daily"],
    platformEst: 1
  },
  {
    trainNo: "14164",
    name: "Sangam Express",
    from: "Meerut City (MTC)",
    to: "Subedarganj (SFG)",
    arrival: "23:55",
    departure: "23:57",
    days: ["Daily"],
    platformEst: 2
  },
  {
    trainNo: "12180",
    name: "Agra Fort - Lucknow Jn Intercity",
    from: "Agra Fort (AF)",
    to: "Lucknow Jn (LJN)",
    arrival: "07:22",
    departure: "07:24",
    days: ["Daily"],
    platformEst: 1
  },
  {
    trainNo: "13484",
    name: "Farakka Express",
    from: "Delhi (DLI)",
    to: "Malda Town (MLDT)",
    arrival: "01:28",
    departure: "01:30",
    days: ["Tue", "Thu", "Fri", "Sun"],
    platformEst: 2
  }
];

export const ROAD_ESTIMATES: RouteEstimate[] = [
  {
    destination: "Agra (Taj Mahal / Fort)",
    distance: "65 km",
    timeViaNH19: "1 hour 15 mins",
    tollEstimate: "₹120 (NH-19 toll near Firozabad)",
    tips: "Excellent wide highway. Peak hours might face congestion around Firozabad bypass."
  },
  {
    destination: "Delhi / Noida NCR",
    distance: "245 km",
    timeViaNH19: "4.5 hours",
    timeViaExpressway: "3 hours via Taj Expressway",
    tollEstimate: "₹455 (via Yamuna/Taj Expway linkage)",
    tips: "Taj Link Road joins directly to Yamuna Expressway. Crucial to watch speed limits (100km/h) as camera monitoring is strict."
  },
  {
    destination: "Lucknow (State Capital)",
    distance: "270 km",
    timeViaNH19: "5 hours",
    timeViaExpressway: "3.5 hours via Agra-Lucknow Expressway",
    tollEstimate: "₹385 (via Agra-Lucknow Expressway entry at Firozabad)",
    tips: "Enter the expressway near Etawah or bypass Firozabad entry point. Perfect asphalt with high-quality refueling nodes."
  }
];

export const EMERGENCY_CONTACTS = [
  { dept: "Police Emergency Helpline", number: "112", subtitle: "National Unified Emergency Response" },
  { dept: "Shikohabad Police Kotwali Station", number: "05676-272010", subtitle: "Station Road Kotwali Office" },
  { dept: "Sanyukta District Hospital Helpline", number: "05676-272555", subtitle: "Hospital Road Linepar Ambulance" },
  { dept: "Fire Brigade Shikohabad", number: "101 / 05676-272333", subtitle: "Dedicated Municipal Fire Tenders" },
  { dept: "Women Power Line (UP)", number: "1090", subtitle: "Dedicated State Women Safety Cell" },
  { dept: "Child Helpline", number: "1098", subtitle: "Support for missing/distressed minors" }
];
