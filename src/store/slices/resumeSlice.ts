import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resume, Language, IdentityTraits, Hobby } from '../../types';

interface ResumeState {
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
}

const sampleResume: Resume = {
  id: '1',
  userId: '1',
  personalInfo: {
    fullName: 'Alexander Thompson',
    email: 'alex.thompson@techleader.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Innovative Tech Leader with 8+ years of experience in software development and team leadership. Proven track record of delivering high-impact projects at scale while mentoring engineering teams. Passionate about cloud architecture, distributed systems, and creating efficient, scalable solutions that drive business growth.',
    photo: '',
    gender: 'male',
    birthday: '1990-01-01',
    address: '123 Main St, San Francisco, CA 94101',
    skype: 'alex.thompson',
    portfolio: 'https://alex-thompson.com',
    professionalAreas: [
      {
        id: 'tech1',
        name: 'Software Development',
        category: 'Technology',
      },
      {
        id: 'tech2',
        name: 'Cloud Computing',
        category: 'Technology',
      },

      {
        id: 'bus1',
        name: 'Project Management',
        category: 'Business',
      },

    ],
    hobbies: [
      {
        id: 'hobby1',
        name: 'Reading',
        icon: '👀',
      },
      {
        id: 'hobby2',
        name: 'Traveling',
        icon: '🌍',
      },
      {
        id: 'hobby3',
        name: 'Cooking',
        icon: '🍳',
      },
      {
        id: 'hobby4',
        name: 'Yoga',
        icon: '🧘‍♂️',
      },
    ],
  },


  education: [
    {
      id: 'edu1',
      school: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2014-09-01',
      endDate: '2016-06-01',
      description: 'Specialized in Artificial Intelligence and Distributed Systems. Research assistant in Cloud Computing Lab.',
    },
    {
      id: 'edu2',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science & Engineering',
      startDate: '2010-09-01',
      endDate: '2014-05-01',
      description: 'Dean\'s List all semesters. Led the Software Engineering Club. Completed honors thesis in distributed systems.',
    }
  ],
  experience: [
    {
      id: 'exp1',
      company: 'TechGiant Inc.',
      position: 'Senior Engineering Manager',
      startDate: '2020-01-01',
      endDate: '',
      location: 'San Francisco, CA',
      description: 'Leading a team of 25+ engineers across multiple product lines. Architected and launched company\'s flagship cloud platform, resulting in 200% revenue growth. Implemented agile methodologies that reduced deployment time by 60%.',
    },
    {
      id: 'exp2',
      company: 'InnovateTech Solutions',
      position: 'Lead Software Engineer',
      startDate: '2017-03-01',
      endDate: '2019-12-31',
      location: 'Mountain View, CA',
      description: 'Spearheaded development of microservices architecture serving 1M+ users. Mentored junior developers and established best practices for code quality and testing. Reduced system downtime by 99.9%.',
    },
    {
      id: 'exp3',
      company: 'StartupRocket',
      position: 'Full Stack Developer',
      startDate: '2016-06-01',
      endDate: '2017-02-28',
      location: 'Palo Alto, CA',
      description: 'Early employee at fast-growing startup. Built and deployed critical features for the main product. Implemented real-time analytics dashboard used by 50K+ customers.',
    }
  ],
  skills: [
    {
      id: 'skill1',
      name: 'System Architecture',
      level: 'Expert',
      category: 'job-specific'
    },
    {
      id: 'skill2',
      name: 'Cloud Computing (AWS, GCP)',
      level: 'Expert',
      category: 'job-specific'
    },
    {
      id: 'skill3',
      name: 'Kubernetes',
      level: 'Advanced',
      category: 'job-specific'
    },
    {
      id: 'skill4',
      name: 'Node.js/TypeScript',
      level: 'Expert',
      category: 'job-specific'
    },
    {
      id: 'skill5',
      name: 'React/Next.js',
      level: 'Advanced',
      category: 'job-specific'
    },
    {
      id: 'skill6',
      name: 'Python',
      level: 'Advanced',
      category: 'job-specific'
    },
    {
      id: 'skill7',
      name: 'Team Leadership',
      level: 'Expert',
      category: 'transferable'
    },
    {
      id: 'skill8',
      name: 'Agile Methodologies',
      level: 'Expert',
      category: 'transferable'
    },
    {
      id: 'skill9',
      name: 'System Design',
      level: 'Advanced',
      category: 'job-specific'
    },
    {
      id: 'skill10',
      name: 'CI/CD',
      level: 'Advanced',
      category: 'job-specific'
    },
    {
      id: 'skill11',
      name: 'Microservices',
      level: 'Expert',
      category: 'job-specific'
    },
    {
      id: 'skill12',
      name: 'Database Design',
      level: 'Advanced',
      category: 'job-specific'
    }
  ],
  languages: [
    {
      id: 'lang1',
      name: 'English',
      proficiency: 'Native',
    }
  ],
  identityTraits: {
    outgoingReserved: 80,
    directedFlexible: 20,
    steadySensitive: 50,
    carefreeEfficient: 90,
    curiousConsistent: 10,
  },
  hobbies: [
    {
      id: 'hobby1',
      name: 'Reading',
      icon: '📚',
    },
    {
      id: 'hobby2',
      name: 'Traveling',
      icon: '✈️',
    },
         
  ],
};

const initialState: ResumeState = {
  currentResume: sampleResume,
  isLoading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setCurrentResume: (state, action: PayloadAction<Resume | null>) => {
      state.currentResume = action.payload;
    },
    updatePersonalInfo: (state, action: PayloadAction<Resume['personalInfo']>) => {
      if (state.currentResume) {
        state.currentResume.personalInfo = action.payload;
      }
    },
    addEducation: (state, action: PayloadAction<Resume['education'][0]>) => {
      if (state.currentResume) {
        state.currentResume.education.push(action.payload);
      }
    },
    addExperience: (state, action: PayloadAction<Resume['experience'][0]>) => {
      if (state.currentResume) {
        state.currentResume.experience.push(action.payload);
      }
    },
    addSkill: (state, action: PayloadAction<Resume['skills'][0]>) => {
      if (state.currentResume) {
        state.currentResume.skills.push(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addLanguage: (state, action: PayloadAction<Language>) => {
      if (state.currentResume) {
        state.currentResume.languages.push(action.payload);
      }
    },
    updateIdentityTraits: (state, action: PayloadAction<IdentityTraits>) => {
      if (state.currentResume) {
        state.currentResume.identityTraits = action.payload;
      }
    },
    addHobby: (state, action: PayloadAction<Hobby>) => {
      if (state.currentResume) {
        state.currentResume.personalInfo.hobbies.push(action.payload);
      }
    },
    deleteLanguage: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.languages = state.currentResume.languages.filter(
          lang => lang.id !== action.payload
        );
      }
    },
    deleteEducation: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.education = state.currentResume.education.filter(
          edu => edu.id !== action.payload
        );
      }
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.experience = state.currentResume.experience.filter(
          exp => exp.id !== action.payload
        );
      }
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.skills = state.currentResume.skills.filter(
          skill => skill.id !== action.payload
        );
      }
    },
  },
});

export const {
  setCurrentResume,
  updatePersonalInfo,
  addEducation,
  addExperience,
  addSkill,
  setLoading,
  setError,
  addLanguage,
  updateIdentityTraits,
  addHobby,
  deleteLanguage,
  deleteEducation,
  deleteExperience,
  deleteSkill,
} = resumeSlice.actions;

export default resumeSlice.reducer;