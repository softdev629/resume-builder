export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'transferable' | 'job-specific';
}

export interface Resume {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  identityTraits: IdentityTraits;
  hobbies: Hobby[];
}


export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  // New fields
  photo: string;
  gender: 'male' | 'female' | 'other' | '';
  birthday: string;
  address: string;
  skype: string;
  portfolio: string;
  professionalAreas: ProfessionalArea[];
  hobbies: Hobby[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface IdentityTraits {
  outgoingReserved: number; // 1-10 scale
  directedFlexible: number;
  steadySensitive: number;
  carefreeEfficient: number;
  curiousConsistent: number;
}

export interface Hobby {
  id: string;
  name: string;
  icon: string;
}


export interface ProfessionalArea {
  id: string;
  name: string;
  category: string;
}

