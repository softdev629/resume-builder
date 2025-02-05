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
}

export interface Resume {
  id: string;
  userId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}