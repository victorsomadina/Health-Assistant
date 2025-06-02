// data/promptTemplates.js
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Hospital, 
  Pill, 
  TrendingUp, 
  Baby, 
  Wind, 
  AlertCircle, 
  Activity, 
  Droplets, 
  Clock, 
  Bed, 
  Dumbbell,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Thermometer,
  Calendar,
  FileText,
  Users,
  Shield,
  Apple,
  Moon,
  Scale,
  Plane,
  Zap
} from 'lucide-react';

export const promptTemplates = [
  {
    text: "I've been feeling dizzy and tired for the last two days, what could be the cause?",
    icon: AlertCircle
  },
  {
    text: "I met my doctor today and uploaded our conversation, can you give me the summary?",
    icon: HeadphonesIcon
  },
  {
    text: "What did the doctor say about my next steps during our last visit?",
    icon: MessageSquare
  },
  {
    text: "Should I go to the hospital for chest pain if it lasts more than an hour?",
    icon: Hospital
  },
  {
    text: "I have a headache that won't go away, what should I do?",
    icon: Brain
  },
  {
    text: "My child has been coughing for 3 days, should I be concerned?",
    icon: Baby
  },
  {
    text: "I'm experiencing shortness of breath, is this serious?",
    icon: Wind
  },
  {
    text: "What are the side effects of the medication I was prescribed?",
    icon: Pill
  },
  {
    text: "I have a rash that appeared suddenly, what could it be?",
    icon: Zap
  },
  {
    text: "My blood pressure reading seems high, what should I do?",
    icon: TrendingUp
  },
  {
    text: "I'm feeling nauseous and have stomach pain, what's wrong?",
    icon: Activity
  },
  {
    text: "Should I fast before my upcoming blood test?",
    icon: Droplets
  },
  {
    text: "I forgot to take my medication yesterday, what should I do?",
    icon: Clock
  },
  {
    text: "I'm experiencing unusual fatigue, could this be a symptom?",
    icon: Bed
  },
  {
    text: "What exercises are safe for someone with my condition?",
    icon: Dumbbell
  },
  {
    text: "I have a fever of 102°F, should I see a doctor immediately?",
    icon: Thermometer
  },
  {
    text: "My vision has been blurry lately, what could be wrong?",
    icon: Eye
  },
  {
    text: "I've been having chest pains during exercise, is this normal?",
    icon: Heart
  },
  {
    text: "When should I schedule my next routine checkup?",
    icon: Calendar
  },
  {
    text: "Can you help me understand my recent lab results?",
    icon: FileText
  },
  {
    text: "I'm pregnant and experiencing morning sickness, any advice?",
    icon: Users
  },
  {
    text: "My elderly parent fell and hit their head, should we go to ER?",
    icon: Shield
  },
  {
    text: "I think I might have food poisoning, what should I do?",
    icon: Apple
  },
  {
    text: "I've been having trouble sleeping for weeks, any suggestions?",
    icon: Moon
  },
  {
    text: "My anxiety has been worse lately, how can I manage it?",
    icon: Stethoscope
  },
  {
    text: "I cut myself while cooking, when do I need stitches?",
    icon: AlertCircle
  },
  {
    text: "My back pain is getting worse, what treatments are available?",
    icon: Zap
  },
  {
    text: "I'm diabetic and my blood sugar is acting strange today",
    icon: Activity
  },
  {
    text: "Can you explain what my doctor meant by 'pre-hypertension'?",
    icon: TrendingUp
  },
  {
    text: "I'm planning to travel abroad, what vaccines do I need?",
    icon: Plane
  },
  {
    text: "My teenager has been complaining of joint pain, is this normal?",
    icon: Users
  },
  {
    text: "I missed my period and took a test, what are my next steps?",
    icon: Calendar
  },
  {
    text: "I've been losing weight without trying, should I be concerned?",
    icon: Scale
  },
  {
    text: "My doctor prescribed antibiotics, when should I start feeling better?",
    icon: Pill
  },
  {
    text: "I have seasonal allergies, what's the best treatment approach?",
    icon: Wind
  },
  {
    text: "I work night shifts and feel constantly tired, any advice?",
    icon: Moon
  },
  {
    text: "My skin is breaking out more than usual, what could cause this?",
    icon: Eye
  },
  {
    text: "I'm starting a new exercise routine, how do I avoid injury?",
    icon: Dumbbell
  },
  {
    text: "My child has a high fever and rash, should I call the doctor?",
    icon: Thermometer
  },
  {
    text: "I've been having memory issues lately, is this concerning?",
    icon: Brain
  },
  {
    text: "What's the difference between urgent care and emergency room?",
    icon: Hospital
  },
  {
    text: "I'm experiencing withdrawal symptoms from quitting smoking",
    icon: Wind
  },
  {
    text: "My prescription ran out, can I get a refill without an appointment?",
    icon: FileText
  },
  {
    text: "I have chronic pain, what are my long-term management options?",
    icon: Activity
  },
  {
    text: "My doctor wants me to see a specialist, what should I expect?",
    icon: Stethoscope
  },
  {
    text: "I'm concerned about a family history of heart disease",
    icon: Heart
  },
  {
    text: "How often should I get my cholesterol checked at my age?",
    icon: Droplets
  },
  {
    text: "I'm feeling depressed and need help, where should I start?",
    icon: Users
  },
  {
    text: "My medication makes me drowsy, is there an alternative?",
    icon: Bed
  },
  {
    text: "I want to start a family, what pre-conception care do I need?",
    icon: Baby
  },
  {
    text: "I have recurring UTIs, how can I prevent them?",
    icon: Shield
  }
];