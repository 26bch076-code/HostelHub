// Sample Demonstration Data for HostelHub
// Tailored for Indian Engineering & College Hostels

export const HOSTEL_INFO = {
  hostelName: "Aryabhatta Hall of Residence",
  blockName: "Block B (Boys Hostel)",
  roomNumber: "304",
  studentName: "Aarav Sharma",
  rollNumber: "22BCSE104",
  collegeName: "Indian Institute of Technology & Engineering",
  emergencyContacts: [
    { role: "Chief Warden", name: "Prof. R. K. Verma", phone: "+91 98765 43210" },
    { role: "Hostel Caretaker", name: "Mr. Suresh Patil", phone: "+91 98765 12345" },
    { role: "Campus Electrician", name: "Mukesh Bhaiya", phone: "+91 98765 67890" },
    { role: "Security Gate #1", name: "Main Guard Post", phone: "Ext. 2011" },
    { role: "Campus Medical Unit", name: "Emergency Ambulance", phone: "+91 98765 99911" }
  ]
};

export const INITIAL_NOTICES = [
  {
    id: "not-1",
    title: "Hostel Night Curfew Extended for Hackathon Participants",
    date: "10 Oct 2026",
    time: "09:30 AM",
    category: "Administrative",
    badge: "Urgent",
    author: "Chief Warden Office",
    description: "In view of the ongoing Inter-College Hackathon 2026, the hostel main gate curfew is extended from 10:00 PM to 01:00 AM for registered participants until Sunday. Please carry your valid hackathon pass and college ID card when entering."
  },
  {
    id: "not-2",
    title: "High-Speed Wi-Fi 6 Access Points Installed in Block B",
    date: "09 Oct 2026",
    time: "05:00 PM",
    category: "Facility",
    badge: "Update",
    author: "Network & IT Cell",
    description: "New dual-band enterprise access points have been deployed across floors 2, 3, and 4 in Block B. Students are advised to connect to 'CampusHostel_5G' and use student LDAP credentials for 100 Mbps symmetrical speeds."
  },
  {
    id: "not-3",
    title: "Overhead Water Tank Maintenance & Deep Cleaning",
    date: "08 Oct 2026",
    time: "11:00 AM",
    category: "Maintenance",
    badge: "Alert",
    author: "Hostel Caretaker",
    description: "Scheduled chemical cleaning of overhead domestic water tanks will take place this Saturday between 02:00 PM and 04:30 PM. Water supply in all washrooms will be temporarily shut down. Kindly store sufficient water beforehand."
  },
  {
    id: "not-4",
    title: "Special Grand Sunday Feast & Diwali Celebration Dinner",
    date: "07 Oct 2026",
    time: "08:15 PM",
    category: "Mess Committee",
    badge: "Notice",
    author: "Student Mess Committee",
    description: "Special festive menu is scheduled for this upcoming Sunday dinner featuring Paneer Lababdar, Chicken Biryani / Veg Dum Biryani, Dal Makhani, Butter Naan, and Gulab Jamun. Mess tokens for day-scholar guests can be collected from the coupon counter."
  },
  {
    id: "not-5",
    title: "Inter-Floor Table Tennis and Badminton Tournament",
    date: "05 Oct 2026",
    time: "04:30 PM",
    category: "Sports & Cultural",
    badge: "Event",
    author: "Hostel Sports Secretary",
    description: "Registrations are now open for singles and doubles Table Tennis and Badminton. Matches commence this Friday evening at the Common Recreation Room. Interested students register with their respective floor representatives."
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: "CMP-104",
    title: "Study lamp wall socket sparking and tripping MCB",
    category: "Electricity",
    room: "304",
    description: "The 3-pin switch socket beside bed B sparks whenever a laptop charger is plugged in. The sub-MCB switch on the 3rd floor corridor tripped twice.",
    status: "In Progress",
    urgency: "High",
    createdAt: "10 Oct 2026, 09:15 AM",
    updatedAt: "10 Oct 2026, 11:00 AM",
    adminRemarks: "Electrician assigned (Mukesh). Work expected by 3:00 PM."
  },
  {
    id: "CMP-103",
    title: "Hot water geyser not heating in East Wing Washroom",
    category: "Water",
    room: "Floor 3 East",
    description: "The geyser turns on its red indicator but the water remains cold even after 25 minutes. All 8 residents on this side are affected.",
    status: "Pending",
    urgency: "High",
    createdAt: "10 Oct 2026, 07:45 AM",
    updatedAt: "10 Oct 2026, 07:45 AM",
    adminRemarks: "Complaint logged. Inspection scheduled today."
  },
  {
    id: "CMP-102",
    title: "Study room floor cleaning and dustbin clearance",
    category: "Cleaning",
    room: "Common Room 3A",
    description: "Dustbins have overflowed with discarded exam papers and snack wrappers. Floor requires wet mopping.",
    status: "Resolved",
    urgency: "Normal",
    createdAt: "09 Oct 2026, 03:20 PM",
    updatedAt: "09 Oct 2026, 06:10 PM",
    adminRemarks: "Housekeeping staff cleared the bins and mopped the room."
  },
  {
    id: "CMP-101",
    title: "Washbasin tap pipe leaking continuously underneath",
    category: "Plumbing",
    room: "308",
    description: "Water has accumulated in a small puddle beneath the washbasin counter due to loose PVC inlet hose.",
    status: "Resolved",
    urgency: "Normal",
    createdAt: "08 Oct 2026, 11:30 AM",
    updatedAt: "08 Oct 2026, 02:45 PM",
    adminRemarks: "Plumber replaced washer ring."
  },
  {
    id: "CMP-100",
    title: "Ceiling fan making squeaking noise at speed 4 and 5",
    category: "Other",
    room: "304",
    description: "The bearing of the ceiling fan seems dried up, making loud metallic squeaks disrupting sleep.",
    status: "Pending",
    urgency: "Low",
    createdAt: "08 Oct 2026, 10:00 PM",
    updatedAt: "08 Oct 2026, 10:00 PM",
    adminRemarks: "Awaiting maintenance batch visit."
  }
];

export const WEEKLY_MESS_MENU = {
  Monday: {
    breakfast: {
      items: "Poha with crunchy peanuts & sev, boiled eggs / boiled sprouts, bread butter jam, hot ginger tea & coffee",
      timing: "07:30 AM - 09:30 AM",
      special: "Sprouts / Eggs"
    },
    lunch: {
      items: "Rajma Masala (Punjabi style), steamed basmati rice, freshly baked phulkas / roti, boondi raita, green salad, papad",
      timing: "12:30 PM - 02:30 PM",
      special: "Rajma Chawal Feast"
    },
    snacks: {
      items: "Crispy Samosa (2 pcs), green mint & imli chutney, hot cutting masala chai",
      timing: "05:00 PM - 06:15 PM",
      special: "Masala Chai & Samosa"
    },
    dinner: {
      items: "Matar Paneer, Yellow Dal Tadka, Tawa Roti with ghee, Jeera Pulao, Gulab Jamun (1 pc)",
      timing: "08:00 PM - 10:00 PM",
      special: "Hot Gulab Jamun"
    }
  },
  Tuesday: {
    breakfast: {
      items: "Steamed Idli & Medu Vada, coconut chutney, hot piping sambar, filter coffee & tea",
      timing: "07:30 AM - 09:30 AM",
      special: "South Indian Breakfast"
    },
    lunch: {
      items: "Kadhi Pakora, Jeera Rice, Aloo Gobhi Dry, Chapati, sweet mango pickle, fried papad",
      timing: "12:30 PM - 02:30 PM",
      special: "Desi Kadhi Chawal"
    },
    snacks: {
      items: "Pao Bhaji / Bun Maska with butter, cardamom tea",
      timing: "05:00 PM - 06:15 PM",
      special: "Mumbai Style Pav Bhaji"
    },
    dinner: {
      items: "Egg Curry / Malai Kofta (Veg option), Dal Makhani, Steamed Rice, Butter Roti, Fruit Custard",
      timing: "08:00 PM - 10:00 PM",
      special: "Chilled Fruit Custard"
    }
  },
  Wednesday: {
    breakfast: {
      items: "Stuffed Aloo Paratha with fresh butter, curd & pickle, seasonal fruit (banana), milk / tea",
      timing: "07:30 AM - 09:30 AM",
      special: "Stuffed Parathas"
    },
    lunch: {
      items: "Chole Masala, Amritsari Kulcha / Bhature, Jeera Rice, Onion salad & lemon wedges, sweet lassi",
      timing: "12:30 PM - 02:30 PM",
      special: "Chole Bhature Lunch"
    },
    snacks: {
      items: "Veg Cutlet / Veg Pakora, tomato ketchup & mint dip, hot tea",
      timing: "05:00 PM - 06:15 PM",
      special: "Crispy Pakoras"
    },
    dinner: {
      items: "Chicken Curry (Non-veg) / Paneer Do Pyaza (Veg), Moong Dal Fry, Phulkas, Rice, Ice Cream cup",
      timing: "08:00 PM - 10:00 PM",
      special: "Non-Veg & Paneer Special"
    }
  },
  Thursday: {
    breakfast: {
      items: "Semolina Upma with vegetables, coconut chutney, boiled eggs / banana, tea & coffee",
      timing: "07:30 AM - 09:30 AM",
      special: "Veg Upma & Filter Coffee"
    },
    lunch: {
      items: "Dal Fry, Mix Veg dry sabzi, Steamed Rice, Tawa Roti, Cucumber raita, roasted papad",
      timing: "12:30 PM - 02:30 PM",
      special: "Comforting Dal Rice"
    },
    snacks: {
      items: "Bread Pakora with potato stuffing, tangy imli chutney, ginger chai",
      timing: "05:00 PM - 06:15 PM",
      special: "Hot Bread Pakora"
    },
    dinner: {
      items: "Palak Paneer / Veg Jalfrezi, Chana Dal Tadka, Steamed Rice, Roti, Moong Dal Halwa",
      timing: "08:00 PM - 10:00 PM",
      special: "Moong Dal Halwa"
    }
  },
  Friday: {
    breakfast: {
      items: "Uttapam with tomato onion topping, sambar, coconut chutney, fresh milk & tea",
      timing: "07:30 AM - 09:30 AM",
      special: "Crispy Uttapam"
    },
    lunch: {
      items: "Kashmiri Dum Aloo, Dal Palak, Steamed Rice, Chapati, Curd, Fried papad",
      timing: "12:30 PM - 02:30 PM",
      special: "Dum Aloo Special"
    },
    snacks: {
      items: "Maggi / Veg Hakka Noodles, hot tea or black coffee",
      timing: "05:00 PM - 06:15 PM",
      special: "Hostel Maggi & Tea"
    },
    dinner: {
      items: "Hyderabadi Chicken Biryani / Vegetable Dum Biryani, Mirchi ka Salan, Onion raita, Rasgulla (2 pcs)",
      timing: "08:00 PM - 10:00 PM",
      special: "Biryani Night Feast"
    }
  },
  Saturday: {
    breakfast: {
      items: "Puri Bhaji (Aloo tamatar rasedar), sooji halwa, pickle, tea & coffee",
      timing: "07:30 AM - 09:30 AM",
      special: "Weekend Puri Bhaji"
    },
    lunch: {
      items: "Sambhar, Rasam, Beetroot Poriyal, Steamed Rice, Curd Rice, Appalam (South Indian Thali)",
      timing: "12:30 PM - 02:30 PM",
      special: "Traditional Thali"
    },
    snacks: {
      items: "Bhelpuri / Sevpuri chaat, biscuits, hot tea",
      timing: "05:00 PM - 06:15 PM",
      special: "Street Food Chaat"
    },
    dinner: {
      items: "Paneer Butter Masala, Dal Makhani, Butter Naan / Tawa Roti, Veg Pulao, Brownie with chocolate syrup",
      timing: "08:00 PM - 10:00 PM",
      special: "Weekend Special Dinner"
    }
  },
  Sunday: {
    breakfast: {
      items: "Methi Thepla / Gobhi Paratha, fresh curd, lemon pickle, boiled egg / banana, masala tea",
      timing: "08:00 AM - 10:00 AM",
      special: "Extended Weekend Brunch"
    },
    lunch: {
      items: "Veg Tehri / Khichdi with desi ghee, baingan bharta, dahi boondi, papad, mango chutney",
      timing: "12:30 PM - 02:30 PM",
      special: "Light Weekend Lunch"
    },
    snacks: {
      items: "Aloo Tikki Chaat with curd & chutneys, hot tea",
      timing: "05:00 PM - 06:15 PM",
      special: "Aloo Tikki Chaat"
    },
    dinner: {
      items: "Grand Feast: Shahi Paneer, Butter Chicken (Non-veg), Dal Maharani, Garlic Naan, Kheer with dry fruits",
      timing: "08:00 PM - 10:00 PM",
      special: "Grand Sunday Feast"
    }
  }
};

export const INITIAL_MESS_FEEDBACK = [
  {
    id: "fb-1",
    mealType: "Lunch",
    day: "Today",
    rating: 5,
    studentName: "Aarav Sharma",
    room: "304",
    comment: "Rajma chawal was delicious today! Raita was fresh and chilled. Keep this quality up.",
    date: "10 Oct 2026, 02:15 PM"
  },
  {
    id: "fb-2",
    mealType: "Breakfast",
    day: "Today",
    rating: 4,
    studentName: "Vikram Mehta",
    room: "218",
    comment: "Poha was soft and good, but tea was served a little lukewarm around 8:45 AM.",
    date: "10 Oct 2026, 09:10 AM"
  },
  {
    id: "fb-3",
    mealType: "Dinner",
    day: "Yesterday",
    rating: 5,
    studentName: "Devansh Roy",
    room: "412",
    comment: "Gulab jamuns were hot and fresh. Paneer pieces were generous. Excellent dinner!",
    date: "09 Oct 2026, 09:40 PM"
  }
];

export const INITIAL_LOST_FOUND = [
  {
    id: "LF-101",
    title: "Casio fx-991EX ClassWiz Scientific Calculator",
    category: "Lost",
    location: "2nd Floor Central Study Reading Room",
    date: "10 Oct 2026",
    contact: "Aarav Sharma (Room 304 | WhatsApp: 9876543210)",
    description: "Black and silver casing with 'CSE-304' marked in silver marker on the backside. Left on the window study desk around 11 PM last night.",
    status: "Active",
    badgeColor: "rose"
  },
  {
    id: "LF-102",
    title: "boAt Airdopes 141 Case (White Color)",
    category: "Found",
    location: "Hostel Gymnasium / Bench Area",
    date: "09 Oct 2026",
    contact: "Ramesh Guard (Security Desk Ground Floor)",
    description: "Found on the dumbbell bench around 7 PM. Left earbud is inside the case. Owner can claim after verifying serial code / Bluetooth pairing name.",
    status: "Active",
    badgeColor: "emerald"
  },
  {
    id: "LF-103",
    title: "College ID Card - Priya Nair (Dept of CSE)",
    category: "Found",
    location: "Mess Dining Hall counter near Water Cooler",
    date: "08 Oct 2026",
    contact: "Handed to Mess Supervisor Mr. Jagdish",
    description: "College identity card attached with blue lanyard. Belongs to Priya Nair (Roll: 22BCSE088). Kept safe at supervisor desk.",
    status: "Claimed",
    badgeColor: "emerald"
  },
  {
    id: "LF-104",
    title: "Milton Thermosteel 1L Water Bottle (Matte Blue)",
    category: "Lost",
    location: "Badminton Court Spectator Benches",
    date: "07 Oct 2026",
    contact: "Rohan Verma (Room 215 | +91 98123 45678)",
    description: "Matte navy blue finish with a small sticker of Linux Penguin near the cap. Has a minor dent near base.",
    status: "Active",
    badgeColor: "rose"
  }
];
