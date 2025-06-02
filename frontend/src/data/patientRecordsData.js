export const conversations = [
  {
    id: 1,
    title: "Consultation - Chest Pain & Shortness of Breath",
    date: "2025-05-20",
    time: "14:30",
    doctor: "Dr. Sarah Johnson",
    type: "consultation",
    summary: "Discussed chest pain symptoms and breathing difficulties. Recommended ECG and chest X-ray."
  },
  {
    id: 2,
    title: "Follow-up - Diabetes Medication Adjustment",
    date: "2025-05-15",
    time: "10:15",
    doctor: "Dr. Michael Chen",
    type: "follow-up",
    summary: "Reviewed blood sugar levels and adjusted metformin dosage. Patient showing good progress."
  },
  {
    id: 3,
    title: "Discussion - Allergy Symptoms & Triggers",
    date: "2025-05-10",
    time: "16:45",
    doctor: "Dr. Emily Rodriguez",
    type: "discussion",
    summary: "Identified potential allergens and discussed management strategies. Prescribed antihistamines."
  },
  {
    id: 4,
    title: "Review - Blood Test Results & Next Steps",
    date: "2025-05-05",
    time: "11:20",
    doctor: "Dr. James Wilson",
    type: "review",
    summary: "Blood work shows improvement in cholesterol levels. Continue current medication regimen."
  },
  {
    id: 5,
    title: "Check-in - High Blood Pressure Monitoring",
    date: "2025-04-28",
    time: "09:00",
    doctor: "Dr. Lisa Thompson",
    type: "check-in",
    summary: "Blood pressure readings within normal range. Lifestyle modifications showing positive results."
  }
];

export const conversationTypes = {
  consultation: "text-blue-600 bg-blue-100",
  "follow-up": "text-green-600 bg-green-100",
  discussion: "text-purple-600 bg-purple-100",
  review: "text-orange-600 bg-orange-100",
  "check-in": "text-teal-600 bg-teal-100"
};