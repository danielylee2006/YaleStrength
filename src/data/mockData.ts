export interface Lifter {
  id: string;
  name: string;
  total: number;
  bench: number;
  squat: number;
  deadlift: number;
  status: "verified" | "pending";
  email: string;
  yearClass: string;
  college: string;
  lifts: LiftRecord[];
}

export interface LiftRecord {
  id: string;
  type: "bench" | "squat" | "deadlift";
  weight: number;
  date: string;
  videoUrl: string;
  status: "verified" | "pending";
}

export const lifters: Lifter[] = [
  {
    id: "1",
    name: "Mike Williams",
    total: 1275,
    bench: 315,
    squat: 455,
    deadlift: 505,
    status: "verified",
    email: "mike.williams@yale.edu",
    yearClass: "2025",
    college: "Saybrook",
    lifts: [
      { id: "l1", type: "bench", weight: 315, date: "2024-01-15", videoUrl: "#", status: "verified" },
      { id: "l2", type: "squat", weight: 455, date: "2024-01-10", videoUrl: "#", status: "verified" },
      { id: "l3", type: "deadlift", weight: 505, date: "2024-01-05", videoUrl: "#", status: "verified" },
    ],
  },
  {
    id: "2",
    name: "John Smith",
    total: 1245,
    bench: 295,
    squat: 445,
    deadlift: 505,
    status: "verified",
    email: "john.smith@yale.edu",
    yearClass: "2026",
    college: "Davenport",
    lifts: [
      { id: "l4", type: "bench", weight: 295, date: "2024-01-12", videoUrl: "#", status: "verified" },
      { id: "l5", type: "squat", weight: 445, date: "2024-01-08", videoUrl: "#", status: "verified" },
      { id: "l6", type: "deadlift", weight: 505, date: "2024-01-03", videoUrl: "#", status: "verified" },
    ],
  },
  {
    id: "3",
    name: "Sam Brown",
    total: 1225,
    bench: 285,
    squat: 435,
    deadlift: 505,
    status: "verified",
    email: "sam.brown@yale.edu",
    yearClass: "2024",
    college: "Berkeley",
    lifts: [
      { id: "l7", type: "bench", weight: 285, date: "2024-01-14", videoUrl: "#", status: "verified" },
      { id: "l8", type: "squat", weight: 435, date: "2024-01-09", videoUrl: "#", status: "verified" },
      { id: "l9", type: "deadlift", weight: 505, date: "2024-01-04", videoUrl: "#", status: "verified" },
    ],
  },
  {
    id: "4",
    name: "Alex Johnson",
    total: 1155,
    bench: 275,
    squat: 405,
    deadlift: 475,
    status: "verified",
    email: "alex.johnson@yale.edu",
    yearClass: "2027",
    college: "Trumbull",
    lifts: [
      { id: "l10", type: "bench", weight: 275, date: "2024-01-13", videoUrl: "#", status: "verified" },
      { id: "l11", type: "squat", weight: 405, date: "2024-01-07", videoUrl: "#", status: "verified" },
      { id: "l12", type: "deadlift", weight: 475, date: "2024-01-02", videoUrl: "#", status: "verified" },
    ],
  },
  {
    id: "5",
    name: "Chris Davis",
    total: 1125,
    bench: 265,
    squat: 395,
    deadlift: 465,
    status: "pending",
    email: "chris.davis@yale.edu",
    yearClass: "2025",
    college: "Morse",
    lifts: [
      { id: "l13", type: "bench", weight: 265, date: "2024-01-11", videoUrl: "#", status: "pending" },
      { id: "l14", type: "squat", weight: 395, date: "2024-01-06", videoUrl: "#", status: "pending" },
      { id: "l15", type: "deadlift", weight: 465, date: "2024-01-01", videoUrl: "#", status: "pending" },
    ],
  },
  {
    id: "6",
    name: "Taylor Martinez",
    total: 1095,
    bench: 255,
    squat: 385,
    deadlift: 455,
    status: "verified",
    email: "taylor.martinez@yale.edu",
    yearClass: "2026",
    college: "Pierson",
    lifts: [
      { id: "l16", type: "bench", weight: 255, date: "2024-01-10", videoUrl: "#", status: "verified" },
      { id: "l17", type: "squat", weight: 385, date: "2024-01-05", videoUrl: "#", status: "verified" },
      { id: "l18", type: "deadlift", weight: 455, date: "2023-12-30", videoUrl: "#", status: "verified" },
    ],
  },
  {
    id: "7",
    name: "Jordan Lee",
    total: 1065,
    bench: 245,
    squat: 375,
    deadlift: 445,
    status: "verified",
    email: "jordan.lee@yale.edu",
    yearClass: "2024",
    college: "Silliman",
    lifts: [
      { id: "l19", type: "bench", weight: 245, date: "2024-01-09", videoUrl: "#", status: "verified" },
      { id: "l20", type: "squat", weight: 375, date: "2024-01-04", videoUrl: "#", status: "verified" },
      { id: "l21", type: "deadlift", weight: 445, date: "2023-12-29", videoUrl: "#", status: "verified" },
    ],
  },
  {
    id: "8",
    name: "Casey Wilson",
    total: 1035,
    bench: 235,
    squat: 365,
    deadlift: 435,
    status: "pending",
    email: "casey.wilson@yale.edu",
    yearClass: "2027",
    college: "Timothy Dwight",
    lifts: [
      { id: "l22", type: "bench", weight: 235, date: "2024-01-08", videoUrl: "#", status: "pending" },
      { id: "l23", type: "squat", weight: 365, date: "2024-01-03", videoUrl: "#", status: "pending" },
      { id: "l24", type: "deadlift", weight: 435, date: "2023-12-28", videoUrl: "#", status: "pending" },
    ],
  },
];

export const getLifterById = (id: string): Lifter | undefined => {
  return lifters.find((lifter) => lifter.id === id);
};

export const getLeaderboardByCategory = (category: "total" | "bench" | "squat" | "deadlift") => {
  return [...lifters].sort((a, b) => b[category] - a[category]);
};
