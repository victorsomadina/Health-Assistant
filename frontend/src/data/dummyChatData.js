// data/dummyChatData.js
export const dummyResponses = [
  {
    id: 1,
    message: "I understand you're experiencing some concerning symptoms. Based on what you've described, here are some possible causes and recommendations:",
    suggestions: [
      "Consider seeing a healthcare provider within 24-48 hours",
      "Monitor your symptoms and note any changes",
      "Stay hydrated and get plenty of rest",
      "Avoid strenuous activities until you feel better"
    ],
    followUpQuestions: [
      "How long have you been experiencing these symptoms?",
      "Have you taken any medications recently?",
      "Do you have any known allergies or medical conditions?"
    ]
  },
  {
    id: 2,
    message: "Thank you for providing more details. Based on your symptoms of headache and fatigue, this could be related to several factors including stress, dehydration, lack of sleep, or a viral infection.",
    suggestions: [
      "Ensure you're drinking enough water (8-10 glasses daily)",
      "Try to get 7-9 hours of quality sleep",
      "Practice stress management techniques",
      "Consider over-the-counter pain relief if needed"
    ],
    followUpQuestions: [
      "Have you been under unusual stress lately?",
      "How many hours of sleep are you getting per night?",
      "Have you been eating regularly?"
    ]
  },
  {
    id: 3,
    message: "I understand you're concerned about chest pain. Chest pain can have various causes, and it's important to take it seriously. While some causes are minor, others require immediate medical attention.",
    suggestions: [
      "Seek immediate medical attention if pain is severe, crushing, or accompanied by shortness of breath",
      "Call emergency services if you experience nausea, sweating, or pain radiating to arm/jaw",
      "For mild discomfort, try sitting upright and taking slow, deep breaths",
      "Avoid physical exertion until evaluated by a healthcare provider"
    ],
    followUpQuestions: [
      "Is the pain sharp, dull, or crushing?",
      "Does the pain worsen with movement or breathing?",
      "Are you experiencing any shortness of breath or nausea?"
    ],
    urgent: true
  },
  {
    id: 4,
    message: "Based on your description of cold-like symptoms, this appears to be a common viral upper respiratory infection. These typically resolve on their own within 7-10 days.",
    suggestions: [
      "Get plenty of rest and sleep",
      "Stay well-hydrated with water, herbal teas, and warm broths",
      "Use a humidifier or breathe steam from a hot shower",
      "Consider over-the-counter medications for symptom relief"
    ],
    followUpQuestions: [
      "How long have you had these symptoms?",
      "Do you have a fever?",
      "Are you experiencing any difficulty breathing?"
    ]
  },
  {
    id: 5,
    message: "Digestive issues can be uncomfortable and may be related to diet, stress, medications, or underlying conditions. Let's explore some potential causes and solutions.",
    suggestions: [
      "Keep a food diary to identify potential triggers",
      "Eat smaller, more frequent meals",
      "Stay hydrated and avoid foods that typically cause discomfort",
      "Consider probiotics to support digestive health"
    ],
    followUpQuestions: [
      "When did the digestive issues start?",
      "Have you made any recent changes to your diet?",
      "Are you taking any new medications?"
    ]
  }
];

// Function to get a random response (simulating AI response)
export const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * dummyResponses.length);
  return dummyResponses[randomIndex];
};

// Function to simulate typing delay
export const simulateTyping = (callback, delay = 2000) => {
  setTimeout(callback, delay);
};