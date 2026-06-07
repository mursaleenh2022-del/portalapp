const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");

// Unified Table implementation utilizing fs.promises
class Table {
  constructor(filename, defaultData = []) {
    this.filepath = path.join(DATA_DIR, filename);
    this.defaultData = defaultData;
    this.data = [];
  }

  async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        const fileContent = await fs.readFile(this.filepath, "utf8");
        this.data = JSON.parse(fileContent);
      } catch (err) {
        // File does not exist, initialize with default data
        this.data = JSON.parse(JSON.stringify(this.defaultData));
        await this.save();
      }
    } catch (error) {
      console.error(`Database error initializing table ${this.filepath}:`, error);
    }
  }

  async save() {
    try {
      await fs.writeFile(this.filepath, JSON.stringify(this.data, null, 2), "utf8");
    } catch (error) {
      console.error(`Database error writing to ${this.filepath}:`, error);
    }
  }

  async find(filterFn = () => true) {
    return this.data.filter(filterFn);
  }

  async findOne(filterFn) {
    return this.data.find(filterFn) || null;
  }

  async insert(record) {
    this.data.push(record);
    await this.save();
    return record;
  }

  async update(filterFn, updateData) {
    let updatedCount = 0;
    this.data = this.data.map((record) => {
      if (filterFn(record)) {
        updatedCount++;
        return { ...record, ...updateData };
      }
      return record;
    });
    if (updatedCount > 0) {
      await this.save();
    }
    return updatedCount;
  }

  async remove(filterFn) {
    const originalLength = this.data.length;
    this.data = this.data.filter((record) => !filterFn(record));
    if (this.data.length !== originalLength) {
      await this.save();
      return true;
    }
    return false;
  }
}

// Baseline mock users
const defaultUsers = [
  {
    email: "client@portalapp.com",
    pw: "Client@123",
    name: "Sarah Johnson",
    role: "client",
    av: "SJ",
    verified: true,
    joined: "Aug 12, 2024",
    balance: 142.50,
    spent: 1840,
    tasks: 23,
    rating: 4.9,
    phone: "+1 (646) 555-0191",
    addresses: [
      { id: 1, label: "Home", addr: "247 W 82nd St, New York, NY 10024" },
      { id: 2, label: "Office", addr: "1 World Trade Center, New York, NY 10007" },
      { id: 3, label: "Gym", addr: "Equinox, 139 E 44th St, New York, NY 10017" }
    ],
    status: "active"
  },
  {
    email: "helper@portalapp.com",
    pw: "Helper@123",
    name: "Marcus Williams",
    role: "helper",
    av: "MW",
    verified: true,
    joined: "Jun 3, 2024",
    balance: 2340.75,
    totalEarned: 12840,
    jobs: 187,
    rating: 4.85,
    level: "Gold",
    streak: 14,
    phone: "+1 (718) 555-0234",
    completionRate: 97.3,
    responseTime: "3.8 min",
    skills: ["Grocery", "Delivery", "Assembly", "Pet Care"],
    status: "active"
  },
  {
    email: "admin@portalapp.com",
    pw: "Admin@123",
    name: "Diana Chen",
    role: "admin",
    av: "DC",
    verified: true,
    joined: "Jan 1, 2024",
    dept: "Operations",
    clearance: 3,
    twoFA: true,
    status: "active"
  },
  {
    email: "backend@portalapp.com",
    pw: "Admin@123",
    name: "System Core",
    role: "admin",
    av: "SC",
    verified: true,
    joined: "Jan 1, 2024",
    dept: "System",
    clearance: 5,
    twoFA: true,
    status: "active"
  },
  {
    email: "priya@mail.com",
    pw: "Helper@123",
    name: "Priya Malhotra",
    role: "helper",
    av: "PM",
    verified: true,
    joined: "Jul 2024",
    balance: 500,
    totalEarned: 6230,
    jobs: 94,
    rating: 4.9,
    level: "Gold",
    streak: 21,
    phone: "+1 (718) 555-0987",
    completionRate: 98.1,
    responseTime: "4.2 min",
    skills: ["Assembly", "Cleaning"],
    status: "active"
  },
  {
    email: "leon@mail.com",
    pw: "Helper@123",
    name: "Leon Krause",
    role: "helper",
    av: "LK",
    verified: false,
    joined: "Oct 2024",
    balance: 120,
    totalEarned: 890,
    jobs: 32,
    rating: 4.2,
    level: "Silver",
    streak: 0,
    phone: "+1 (718) 555-0543",
    completionRate: 85.0,
    responseTime: "9.5 min",
    skills: ["Pharmacy", "Errands"],
    status: "suspended"
  },
  {
    email: "emma@mail.com",
    pw: "Client@123",
    name: "Emma Larsson",
    role: "client",
    av: "EL",
    verified: true,
    joined: "Nov 2024",
    balance: 50,
    spent: 90,
    tasks: 2,
    rating: 4.5,
    phone: "+1 (646) 555-0812",
    addresses: [],
    status: "inactive"
  },
  {
    email: "aisha@mail.com",
    pw: "Helper@123",
    name: "Aisha Patel",
    role: "helper",
    av: "AP",
    verified: true,
    joined: "Dec 2024",
    balance: 620,
    totalEarned: 3100,
    jobs: 41,
    rating: 4.95,
    level: "Gold",
    streak: 8,
    phone: "+1 (718) 555-0765",
    completionRate: 99.0,
    responseTime: "2.1 min",
    skills: ["Pet Care", "Walking"],
    status: "active"
  },
  {
    email: "carlos@mail.com",
    pw: "Client@123",
    name: "Carlos Mendez",
    role: "client",
    av: "CM",
    verified: false,
    joined: "Jan 2025",
    balance: 15,
    spent: 480,
    tasks: 6,
    rating: 4.0,
    phone: "+1 (646) 555-0453",
    addresses: [],
    status: "active"
  }
];

// Baseline mock tasks (combines Client Tasks & Helper Jobs into unified structures)
const defaultTasks = [
  {
    id: 1,
    title: "Whole Foods Grocery Run",
    desc: "Organic whole milk x2, sourdough, kombucha 4-pack, greek yogurt. Keep all receipts.",
    category: "grocery",
    priority: "high",
    due: "Today, 4:00 PM",
    loc: "Broadway & 79th",
    client: "Sarah Johnson",
    clientEmail: "client@portalapp.com",
    clientAv: "SJ",
    helper: "Marcus Williams",
    helperEmail: "helper@portalapp.com",
    helperAv: "MW",
    pay: 28,
    status: "active",
    rating: null,
    reviewed: false,
    dist: "0.8 mi"
  },
  {
    id: 2,
    title: "Dry Cleaning Pickup",
    desc: "3 dress shirts and 1 navy blazer from 5th Ave location only. Handle with care.",
    category: "errand",
    priority: "medium",
    due: "Wed, Jul 23",
    loc: "5th Ave & 42nd",
    client: "Sarah Johnson",
    clientEmail: "client@portalapp.com",
    clientAv: "SJ",
    helper: null,
    helperEmail: null,
    pay: 18,
    status: "pending",
    rating: null,
    reviewed: false,
    dist: "1.2 mi"
  },
  {
    id: 3,
    title: "Airport Transfer — JFK T4",
    desc: "Flight UA2891 arriving 3:40pm. Name sign required. 1 large suitcase.",
    category: "transport",
    priority: "high",
    due: "Fri, Jul 25",
    loc: "JFK Terminal 4",
    client: "Sarah Johnson",
    clientEmail: "client@portalapp.com",
    clientAv: "SJ",
    helper: null,
    helperEmail: null,
    pay: 65,
    status: "pending",
    rating: null,
    reviewed: false,
    dist: "3.5 mi"
  },
  {
    id: 4,
    title: "IKEA Furniture Assembly",
    desc: "KALLAX shelf unit + HEMNES bed frame. All tools provided at the apartment.",
    category: "assembly",
    priority: "low",
    due: "Thu, Jul 18",
    loc: "247 W 82nd St, New York, NY 10024",
    client: "Sarah Johnson",
    clientEmail: "client@portalapp.com",
    clientAv: "SJ",
    helper: "Priya Malhotra",
    helperEmail: "priya@mail.com",
    helperAv: "PM",
    pay: 75,
    status: "completed",
    rating: 5,
    reviewed: true,
    dist: "1.4 mi"
  },
  {
    id: 5,
    title: "CVS Pharmacy Pickup",
    desc: "Prescription #RX-2891. ID required for collection. Urgent — same day needed.",
    category: "errand",
    priority: "high",
    due: "Wed, Jul 16",
    loc: "CVS, 42nd St",
    client: "Sarah Johnson",
    clientEmail: "client@portalapp.com",
    clientAv: "SJ",
    helper: "Leon Krause",
    helperEmail: "leon@mail.com",
    helperAv: "LK",
    pay: 15,
    status: "completed",
    rating: 4,
    reviewed: true,
    dist: "0.5 mi"
  },
  {
    id: 6,
    title: "Dog Walking — 60 min",
    desc: "Max is a golden retriever. Loop around Central Park. Leash always on.",
    category: "pet",
    priority: "low",
    due: "Sat, Jul 26",
    loc: "Central Park W",
    client: "Sarah Johnson",
    clientEmail: "client@portalapp.com",
    clientAv: "SJ",
    helper: null,
    helperEmail: null,
    pay: 35,
    status: "pending",
    rating: null,
    reviewed: false,
    dist: "0.3 mi"
  },
  {
    id: 7,
    title: "UPS Package Delivery",
    desc: "2 packages to be dropped at UPS Store. QR code provided.",
    category: "delivery",
    priority: "medium",
    due: "Today, 5:30 PM",
    loc: "UPS Store, Midtown",
    client: "Emma Larsson",
    clientEmail: "emma@mail.com",
    clientAv: "EL",
    helper: "Marcus Williams",
    helperEmail: "helper@portalapp.com",
    helperAv: "MW",
    pay: 22,
    status: "active",
    rating: null,
    reviewed: false,
    dist: "1.2 mi"
  },
  {
    id: 8,
    title: "Office Supplies Run",
    desc: "Printed list attached. Box will be heavy — bring trolley.",
    category: "grocery",
    priority: "medium",
    due: "Tomorrow, 2:00 PM",
    loc: "Staples, 34th St",
    client: "Carlos Mendez",
    clientEmail: "carlos@mail.com",
    clientAv: "CM",
    helper: null,
    helperEmail: null,
    pay: 40,
    status: "pending",
    rating: null,
    reviewed: false,
    dist: "2.1 mi"
  }
];

// Baseline mock disputes
const defaultDisputes = [
  {
    id: "D-1042",
    task: "Airport Transfer — JFK",
    client: "Sarah Johnson",
    helper: "Leon Krause",
    amount: "$55",
    status: "open",
    opened: "2 days ago",
    desc: "Helper no-showed for airport pickup. Client missed flight."
  },
  {
    id: "D-1038",
    task: "Grocery Run",
    client: "Tom Reynolds",
    helper: "Priya Malhotra",
    amount: "$28",
    status: "resolved",
    opened: "5 days ago",
    desc: "Wrong items purchased. Resolved via 50% refund."
  },
  {
    id: "D-1031",
    task: "Package Delivery",
    client: "Emma Larsson",
    helper: "Marcus Williams",
    amount: "$22",
    status: "reviewing",
    opened: "1 week ago",
    desc: "Package delivered to wrong address. Helper disputes."
  },
  {
    id: "D-1025",
    task: "IKEA Assembly",
    client: "Carlos Mendez",
    helper: "Aisha Patel",
    amount: "$90",
    status: "open",
    opened: "3 days ago",
    desc: "Assembly incomplete. 2 of 3 units done. Client requesting partial."
  }
];

// Baseline mock log entries
const defaultLogs = [
  { ts: "14:22:01", lvl: "INFO", msg: "User auth success: client@portalapp.com (client)" },
  { ts: "14:21:58", lvl: "INFO", msg: "Task #1042 status update: pending → active" },
  { ts: "14:21:44", lvl: "WARN", msg: "Rate limit approached: IP 203.0.113.42 (45/50 req/min)" },
  { ts: "14:21:30", lvl: "INFO", msg: "Payment processed: $28.00 — task #1 — Stripe txn pi_3Ox9" },
  { ts: "14:21:22", lvl: "ERR", msg: "Push notification failure: device token expired (user #1042)" },
  { ts: "14:21:10", lvl: "INFO", msg: "New user signup: marcus.w@gmail.com (helper application)" },
  { ts: "14:20:57", lvl: "INFO", msg: "Dispute D-1042 escalated to admin review queue" },
  { ts: "14:20:41", lvl: "WARN", msg: "Geocoding API latency: 1240ms (threshold: 800ms)" }
];

// Instantiate Tables
const db = {
  users: new Table("users.json", defaultUsers),
  tasks: new Table("tasks.json", defaultTasks),
  disputes: new Table("disputes.json", defaultDisputes),
  logs: new Table("logs.json", defaultLogs)
};

// Initializer helper
async function initDatabase() {
  await db.users.init();
  await db.tasks.init();
  await db.disputes.init();
  await db.logs.init();
  console.log("Database initialized successfully!");
}

module.exports = {
  db,
  initDatabase
};
