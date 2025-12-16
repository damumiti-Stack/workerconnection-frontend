export const DISTRICTS = [
  // Rayalaseema Region
  { id: 1, name: "Anantapur", region: "rayalaseema" },
  { id: 2, name: "Annamayya", region: "rayalaseema" },
  { id: 3, name: "Chittoor", region: "rayalaseema" },
  { id: 4, name: "YSR Kadapa", region: "rayalaseema" },
  { id: 5, name: "Kurnool", region: "rayalaseema" },
  { id: 6, name: "Nandyal", region: "rayalaseema" },
  { id: 7, name: "Sri Sathya Sai", region: "rayalaseema" },
  { id: 8, name: "Tirupati", region: "rayalaseema" },

  // Coastal Andhra Region
  { id: 9, name: "Bapatla", region: "coastal" },
  { id: 10, name: "Dr. B. R. Ambedkar Konaseema", region: "coastal" },
  { id: 11, name: "East Godavari", region: "coastal" },
  { id: 12, name: "Eluru", region: "coastal" },
  { id: 13, name: "Guntur", region: "coastal" },
  { id: 14, name: "Kakinada", region: "coastal" },
  { id: 15, name: "Krishna", region: "coastal" },
  { id: 16, name: "NTR", region: "coastal" },
  { id: 17, name: "Palnadu", region: "coastal" },
  { id: 18, name: "Prakasam", region: "coastal" },
  { id: 19, name: "Sri Potti Sriramulu Nellore", region: "coastal" },
  { id: 20, name: "West Godavari", region: "coastal" },

  // Uttarandhra Region
  { id: 21, name: "Alluri Sitharama Raju", region: "uttarandhra" },
  { id: 22, name: "Anakapalli", region: "uttarandhra" },
  { id: 23, name: "Parvathipuram Manyam", region: "uttarandhra" },
  { id: 24, name: "Srikakulam", region: "uttarandhra" },
  { id: 25, name: "Visakhapatnam", region: "uttarandhra" },
  { id: 26, name: "Vizianagaram", region: "uttarandhra" },
];

export const TRADES_OF_WORK = [
  "Bar Bender",
  "Brick Klin Worker",
  "Brick Maker",
  "Caulker",
  "Centering Worker",
  "Carpenter",
  "Cooli",
  "Construction Site Security",
  "Earth Worker",
  "Electrician",
  "Electricity Substation Worker",
  "False ceiling Worker",
  "Fitter",
  "Glass Worker",
  "Hammer/man",
  "Head Mazdoor",
  "Helper",
  "Interior Decoration Worker",
  "Kalasis or sarang engaged in heavy engineering construction",
  "Landscaping Worker",
  "Lifts,Escalators Installation workers",
  "MNREG Cooli",
  "Marble or Kadapa Stone Worker",
  "Mason",
  "Mason Cooli",
  "Mechanic",
  "Mixer Driver or Roller Driver",
  "Mixer or Pump Operator",
  "Mosaic Worker or Polishing Worker",
  "Mud Mixing Worker",
  "Municipal Drainage Worker",
  "Painter or Varnisher",
  "Plumber or Sanitary Worker",
  "Pre-fabricating Structural Worker",
  "Quarry Worker",
  "Rigger",
  "Road Laying",
  "Road Surfing",
  "Road Worker",
  "Roller Driver",
  "Sawer",
  "Solar Fencing Worker",
  "Spary man or Mixer (Road Surfing)",
  "Stone Cutter or Stone Breaker or Stone Crusher",
  "Supervisors in Construction Work",
  "Thatcher or Blacksmith or Sawer or Caulker",
  "Tile Roofing Worker",
  "Tiles",
  "Tunnel Worker",
  "Tunnel Worker or Rock worker",
  "Watch Man or Security at construction work",
  "Welder",
  "Well Sinker",
  "Wooden or Stone Packer",
  "Worker engaged in anti-sea erosion worker",
  "Worker engaged in processing lime",
  "pump Operator",
].sort();

export const WORKER_CATEGORIES = ["Unskilled", "Semi-Skilled", "Skilled"];

export const ESTABLISHMENT_CATEGORIES = [
  "State Government",
  "State Government Undertaking",
  "Central Government",
  "Central Government Undertaking",
  "Private Residential",
  "Private Commercial",
];

export const NATURE_OF_WORK = [
  "Building Construction",
  "Road Construction",
  "Bridge Construction",
  "Infrastructure Development",
  "Renovation Work",
  "Demolishment Work",
];

export const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];

export const RELATIONSHIPS = [
  "Son",
  "Daughter",
  "Spouse",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Other",
];

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "transgender", label: "Transgender" },
];

// Andhra Pradesh specific locations for mock data
export const AP_LOCATIONS = {
  workSites: [
    {
      name: "Amaravati Capital Construction Site",
      district: "Guntur",
      coordinates: { lat: 16.5062, lng: 80.648 },
    },
    {
      name: "Visakhapatnam Port Expansion",
      district: "Visakhapatnam",
      coordinates: { lat: 17.6868, lng: 83.2185 },
    },
    {
      name: "Tirupati Airport Development",
      district: "Tirupati",
      coordinates: { lat: 13.6288, lng: 79.4192 },
    },
    {
      name: "Vijayawada Metro Rail Project",
      district: "Krishna",
      coordinates: { lat: 16.5062, lng: 80.648 },
    },
    {
      name: "Kakinada Smart City Project",
      district: "Kakinada",
      coordinates: { lat: 16.9891, lng: 82.2475 },
    },
    {
      name: "Nellore Industrial Corridor",
      district: "Nellore",
      coordinates: { lat: 14.4426, lng: 79.9865 },
    },
  ],
  establishments: [
    "Amaravati Infrastructure Corporation Ltd",
    "Visakhapatnam Steel Plant Construction",
    "Tirupati Urban Development Authority",
    "Krishna District Collectorate Projects",
    "Guntur Municipal Corporation Works",
    "Prakasam District Road Development",
    "Chittoor Rural Development Projects",
    "Kurnool Irrigation Department",
    "Anantapur Solar Park Development",
    "Kadapa Mining Infrastructure",
  ],
  officers: [
    {
      name: "Sri K. Venkateswara Rao",
      designation: "Assistant Commissioner of Labour",
      district: "Guntur",
    },
    {
      name: "Smt. P. Lakshmi Devi",
      designation: "Deputy Commissioner of Labour",
      district: "Visakhapatnam",
    },
    {
      name: "Sri M. Ramesh Kumar",
      designation: "Labour Inspector",
      district: "Tirupati",
    },
    {
      name: "Smt. S. Bharathi",
      designation: "Labour Officer",
      district: "Krishna",
    },
    {
      name: "Sri N. Suresh Babu",
      designation: "Enforcement Officer",
      district: "Prakasam",
    },
    {
      name: "Smt. R. Padmavathi",
      designation: "Assistant Commissioner",
      district: "Chittoor",
    },
  ],
};

// Helper functions to get display labels
export const getDistrictLabel = (value: string): string => {
  const district = DISTRICTS.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, "_") === value
  );
  return district
    ? district.name
    : value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getTradeLabel = (value: string): string => {
  const trade = TRADES_OF_WORK.find(
    (t) => t.toLowerCase().replace(/\s+/g, "_") === value
  );
  return (
    trade || value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export const getWorkerCategoryLabel = (value: string): string => {
  const category = WORKER_CATEGORIES.find(
    (c) => c.toLowerCase().replace(/-/g, "_") === value
  );
  return (
    category ||
    value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export const getEstablishmentCategoryLabel = (value: string): string => {
  const category = ESTABLISHMENT_CATEGORIES.find(
    (c) => c.toLowerCase().replace(/\s+/g, "_") === value
  );
  return (
    category ||
    value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export const getNatureOfWorkLabel = (value: string): string => {
  const nature = NATURE_OF_WORK.find(
    (n) => n.toLowerCase().replace(/\s+/g, "_") === value
  );
  return (
    nature || value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export const getMaritalStatusLabel = (value: string): string => {
  const status = MARITAL_STATUS.find((s) => s.toLowerCase() === value);
  return status || value.replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getRelationshipLabel = (value: string): string => {
  const relationship = RELATIONSHIPS.find((r) => r.toLowerCase() === value);
  return relationship || value.replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getGenderLabel = (value: string): string => {
  const gender = GENDERS.find((g) => g.value === value);
  return gender ? gender.label : value.replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getYesNoLabel = (value: string): string => {
  return value === "yes" ? "Yes" : value === "no" ? "No" : value;
};

export const isValidMobile = (mobile: string): boolean => {
  return /^[6-9]\d{9}$/.test(mobile);
};


export const validateName = (name: string, field: string): string | true => {
  if (!name) return `${field} is required`;
  const regex = /^[A-Za-z]+$/;
  if (!regex.test(name)) return `${field} should contain only letters`;
  return true;
};
