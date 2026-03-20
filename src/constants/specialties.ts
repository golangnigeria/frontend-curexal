export interface Specialty {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const SPECIALTIES: Specialty[] = [
  {
    id: "general",
    name: "General Practice",
    icon: "👨‍⚕️",
    desc: "Common illnesses, checkups",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: "👶",
    desc: "Child health and development",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "🫀",
    desc: "Heart and blood vessels",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    icon: "🧴",
    desc: "Skin, hair, and nails",
  },
  {
    id: "psychiatry",
    name: "Psychiatry",
    icon: "🧠",
    desc: "Mental health and therapy",
  },
  { 
    id: "gynecology", 
    name: "Gynecology", 
    icon: "🤰", 
    desc: "Women's health" 
  },
];
