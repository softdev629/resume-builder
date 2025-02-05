import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resume } from '../../types';

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
    },
    {
      id: 'skill2',
      name: 'Cloud Computing (AWS, GCP)',
      level: 'Expert',
    },
    {
      id: 'skill3',
      name: 'Kubernetes',
      level: 'Advanced',
    },
    {
      id: 'skill4',
      name: 'Node.js/TypeScript',
      level: 'Expert',
    },
    {
      id: 'skill5',
      name: 'React/Next.js',
      level: 'Advanced',
    },
    {
      id: 'skill6',
      name: 'Python',
      level: 'Advanced',
    },
    {
      id: 'skill7',
      name: 'Team Leadership',
      level: 'Expert',
    },
    {
      id: 'skill8',
      name: 'Agile Methodologies',
      level: 'Expert',
    },
    {
      id: 'skill9',
      name: 'System Design',
      level: 'Advanced',
    },
    {
      id: 'skill10',
      name: 'CI/CD',
      level: 'Advanced',
    },
    {
      id: 'skill11',
      name: 'Microservices',
      level: 'Expert',
    },
    {
      id: 'skill12',
      name: 'Database Design',
      level: 'Advanced',
    }
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
} = resumeSlice.actions;

export default resumeSlice.reducer;