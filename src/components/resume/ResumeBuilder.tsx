import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  setCurrentResume,
  updatePersonalInfo,
  addEducation,
  addExperience,
  addSkill,
  updateIdentityTraits,
  addLanguage,
  deleteLanguage,
  deleteEducation,
  deleteExperience,
  deleteSkill,
} from "../../store/slices/resumeSlice";
import type {
  Resume,
  Education,
  Experience,
  Skill,
  Language,
  Hobby,
  ProfessionalArea,
} from "../../types";
import Dialog from "../layout/Dialog";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    anychart: any;
  }
}

type Section = "personal" | "education" | "experience" | "skills";
type PreviewView = "text" | "visual";

const AVAILABLE_HOBBIES: Hobby[] = [
  { id: "hobby1", name: "Reading", icon: "📚" },
  { id: "hobby2", name: "Traveling", icon: "✈️" },
  { id: "hobby3", name: "Photography", icon: "📷" },
  { id: "hobby4", name: "Cooking", icon: "👨‍🍳" },
  { id: "hobby5", name: "Gaming", icon: "🎮" },
  { id: "hobby6", name: "Music", icon: "🎵" },
  { id: "hobby7", name: "Sports", icon: "⚽" },
  { id: "hobby8", name: "Painting", icon: "🎨" },
  { id: "hobby9", name: "Gardening", icon: "🌱" },
  { id: "hobby10", name: "Writing", icon: "✍️" },
  { id: "hobby11", name: "Dancing", icon: "💃" },
  { id: "hobby12", name: "Hiking", icon: "🏃" },
  { id: "hobby13", name: "Yoga", icon: "🧘" },
  { id: "hobby14", name: "Movies", icon: "🎬" },
  { id: "hobby15", name: "Chess", icon: "♟️" },
];

const PROFESSIONAL_AREAS: ProfessionalArea[] = [
  // Technology
  { id: "tech1", name: "Software Development", category: "Technology" },
  { id: "tech2", name: "Data Science", category: "Technology" },
  { id: "tech3", name: "Cloud Computing", category: "Technology" },
  { id: "tech4", name: "Cybersecurity", category: "Technology" },
  { id: "tech5", name: "DevOps", category: "Technology" },

  // Business
  { id: "bus1", name: "Project Management", category: "Business" },
  { id: "bus2", name: "Marketing", category: "Business" },
  { id: "bus3", name: "Finance", category: "Business" },
  { id: "bus4", name: "Human Resources", category: "Business" },
  { id: "bus5", name: "Business Analysis", category: "Business" },

  // Healthcare
  { id: "health1", name: "Nursing", category: "Healthcare" },
  { id: "health2", name: "Medical Practice", category: "Healthcare" },
  { id: "health3", name: "Physical Therapy", category: "Healthcare" },

  // Creative
  { id: "creative1", name: "Graphic Design", category: "Creative" },
  { id: "creative2", name: "UX/UI Design", category: "Creative" },
  { id: "creative3", name: "Content Creation", category: "Creative" },

  // Education
  { id: "edu1", name: "Teaching", category: "Education" },
  { id: "edu2", name: "Educational Technology", category: "Education" },
  { id: "edu3", name: "Curriculum Development", category: "Education" },
];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const resume = useAppSelector((state) => state.resume.currentResume);
  const isLoading = useAppSelector((state) => state.resume.isLoading);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewView, setPreviewView] = useState<PreviewView>("text");

  // Form states for new entries
  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [newExperience, setNewExperience] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    location: "",
  });

  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({
    name: "",
    level: "Beginner",
    category: "job-specific",
  });

  const [newLanguage, setNewLanguage] = useState<Omit<Language, "id">>({
    name: "",
    proficiency: "Basic",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!resume) {
      const newResume: Resume = {
        id: crypto.randomUUID(),
        userId: user.id,
        personalInfo: {
          fullName: user.name,
          email: user.email,
          phone: "",
          location: "",
          summary: "",
          photo: "",
          gender: "",
          birthday: "",
          address: "",
          skype: "",
          portfolio: "",
          professionalAreas: [],
          hobbies: [],
        },
        education: [],
        experience: [],
        skills: [],
        languages: [],
        identityTraits: {
          outgoingReserved: 5,
          directedFlexible: 5,
          steadySensitive: 5,
          carefreeEfficient: 5,
          curiousConsistent: 5,
        },
        hobbies: [],
      };
      dispatch(setCurrentResume(newResume));
    }
  }, [user, resume, navigate, dispatch]);

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!resume) return;
    const { name, value } = e.target;
    dispatch(
      updatePersonalInfo({
        ...resume.personalInfo,
        [name]: value,
      })
    );
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addEducation({
        id: crypto.randomUUID(),
        ...newEducation,
      })
    );
    setNewEducation({
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addExperience({
        id: crypto.randomUUID(),
        ...newExperience,
      })
    );
    setNewExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addSkill({
        id: crypto.randomUUID(),
        ...newSkill,
      })
    );
    setNewSkill({
      name: "",
      level: "Beginner",
      category: "job-specific",
    });
  };

  const handleAddLanguage = () => {
    if (newLanguage.name.trim()) {
      dispatch(
        addLanguage({
          id: crypto.randomUUID(),
          ...newLanguage,
        })
      );
      setNewLanguage({
        name: "",
        proficiency: "Basic",
      });
    }
  };

  // Move useEffect to component level
  useEffect(() => {
    if (previewView === "visual" && typeof window.anychart !== "undefined") {
      // Create timeline chart
      const chart = window.anychart.timeline();

      // Create range series
      const rangeSeries1 = chart.range([
        ...resume!.experience.map((item, index) => ({
          start: item.startDate,
          end: item.endDate || new Date().toISOString(),
          fill: [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEEAD",
            "#D4A5A5",
          ][index % 6],
          stroke: "#00000000",
        })),
      ]);

      // Set range series labels settings
      rangeSeries1
        .labels()
        .useHtml(true)
        .fontColor("#fff")
        .format(
          '<span style="font-size: 85%">{%start}{dateTimeFormat:MM/yyyy} - {%end}{dateTimeFormat:MM/yyyy}</span>'
        );

      // Set range series bar height
      rangeSeries1.height(50);

      const momentSeries1 = chart.moment([
        ...resume!.experience.map((item) => ({
          x: item.startDate,
          y: item.company,
        })),
      ]);

      momentSeries1.direction("up");

      const rangeSeries2 = chart.range([
        ...resume!.education.map((item, index) => ({
          start: item.startDate,
          end: item.endDate || new Date().toISOString(),
          fill: [
            // Professional theme
            // Vibrant theme
            "#E74C3C",
            "#9B59B6",
            "#F1C40F",
            "#E67E22",
            "#8E44AD",
            "#D35400",
            // Pastel theme
          ][index % 6],
          stroke: "#00000000",
        })),
      ]);

      rangeSeries2
        .labels()
        .useHtml(true)
        .fontColor("#fff")
        .format(
          '<span style="font-size: 85%">{%start}{dateTimeFormat:MM/yyyy} - {%end}{dateTimeFormat:MM/yyyy}</span>'
        );

      const momentSeries2 = chart.moment([
        ...resume!.education.map((item) => [item.startDate, item.school]),
      ]);

      momentSeries2.direction("down");

      rangeSeries2.height(50);
      rangeSeries2.direction("down");

      // Set container id for the chart
      chart.container("timeline-container");
      // Initiate chart drawing
      chart.draw();
      return () => {
        chart.dispose();
      };
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewView]); // Add previewView as dependency

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!resume) return null;

  const renderEducationSection = () => (
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Education</h2>
      <form onSubmit={handleAddEducation} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="School"
            className="input"
            value={newEducation.school}
            onChange={(e) =>
              setNewEducation({ ...newEducation, school: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Degree"
            className="input"
            value={newEducation.degree}
            onChange={(e) =>
              setNewEducation({ ...newEducation, degree: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Field of Study"
            className="input"
            value={newEducation.field}
            onChange={(e) =>
              setNewEducation({ ...newEducation, field: e.target.value })
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="Start Date"
              className="input"
              value={newEducation.startDate}
              onChange={(e) =>
                setNewEducation({ ...newEducation, startDate: e.target.value })
              }
              required
            />
            <input
              type="date"
              placeholder="End Date"
              className="input"
              value={newEducation.endDate}
              onChange={(e) =>
                setNewEducation({ ...newEducation, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <textarea
          placeholder="Description"
          className="input"
          value={newEducation.description}
          onChange={(e) =>
            setNewEducation({ ...newEducation, description: e.target.value })
          }
          rows={3}
        />
        <button type="submit" className="btn btn-primary">
          Add Education
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {resume.education.map((edu) => (
          <div key={edu.id} className="p-4 border rounded-lg group">
            <div className="flex justify-between">
              <h3 className="font-semibold">{edu.school}</h3>
              <button
                onClick={() => dispatch(deleteEducation(edu.id))}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <p>
              {edu.degree} in {edu.field}
            </p>
            <p className="text-gray-600">
              {new Date(edu.startDate).getFullYear()} -{" "}
              {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
            </p>
            {edu.description && <p className="mt-2">{edu.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );

  const renderExperienceSection = () => (
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
      <form onSubmit={handleAddExperience} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company"
            className="input"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Position"
            className="input"
            value={newExperience.position}
            onChange={(e) =>
              setNewExperience({ ...newExperience, position: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="input"
            value={newExperience.location}
            onChange={(e) =>
              setNewExperience({ ...newExperience, location: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="Start Date"
              className="input"
              value={newExperience.startDate}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  startDate: e.target.value,
                })
              }
              required
            />
            <input
              type="date"
              placeholder="End Date"
              className="input"
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience({ ...newExperience, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <textarea
          placeholder="Description"
          className="input"
          value={newExperience.description}
          onChange={(e) =>
            setNewExperience({ ...newExperience, description: e.target.value })
          }
          rows={3}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add Experience
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {resume.experience.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-lg group">
            <div className="flex justify-between">
              <h3 className="font-semibold">{exp.position}</h3>
              <button
                onClick={() => dispatch(deleteExperience(exp.id))}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <p>
              {exp.company} • {exp.location}
            </p>
            <p className="text-gray-600">
              {new Date(exp.startDate).getFullYear()} -{" "}
              {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
            </p>
            <p className="mt-2">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderSkillsSection = () => (
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <form onSubmit={handleAddSkill} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Skill name"
            className="input flex-1"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            required
          />
          <select
            className="input w-48"
            value={newSkill.level}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                level: e.target.value as Skill["level"],
              })
            }
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          <select
            className="input w-48"
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                category: e.target.value as "transferable" | "job-specific",
              })
            }
          >
            <option value="job-specific">Job Specific</option>
            <option value="transferable">Transferable</option>
          </select>
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            Add Skill
          </button>
        </div>
      </form>

      {/* Display Skills by Category */}
      <div className="mt-6 space-y-6">
        {/* Job-specific Skills */}
        <div>
          <h3 className="text-lg font-medium mb-3">Job-specific Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resume.skills
              .filter((skill) => skill.category === "job-specific")
              .map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 border rounded-lg flex justify-between items-center group"
                >
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        skill.level === "Expert"
                          ? "bg-primary-100 text-primary-800"
                          : skill.level === "Advanced"
                          ? "bg-blue-100 text-blue-800"
                          : skill.level === "Intermediate"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {skill.level}
                    </span>
                    <button
                      onClick={() => dispatch(deleteSkill(skill.id))}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Transferable Skills */}
        <div>
          <h3 className="text-lg font-medium mb-3">Transferable Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resume.skills
              .filter((skill) => skill.category === "transferable")
              .map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 border rounded-lg flex justify-between items-center group"
                >
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        skill.level === "Expert"
                          ? "bg-purple-100 text-purple-800"
                          : skill.level === "Advanced"
                          ? "bg-indigo-100 text-indigo-800"
                          : skill.level === "Intermediate"
                          ? "bg-violet-100 text-violet-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {skill.level}
                    </span>
                    <button
                      onClick={() => dispatch(deleteSkill(skill.id))}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderTextPreview = () => {
    return (
      <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
        {/* Header/Personal Info */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {resume.personalInfo.fullName}
          </h1>
          <div className="flex flex-wrap gap-3 text-gray-600 mb-4">
            {resume.personalInfo.email && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {resume.personalInfo.email}
              </span>
            )}
            {resume.personalInfo.phone && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {resume.personalInfo.phone}
              </span>
            )}
            {resume.personalInfo.location && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {resume.personalInfo.location}
              </span>
            )}
          </div>
          {resume.personalInfo.summary && (
            <p className="text-gray-700 leading-relaxed">
              {resume.personalInfo.summary}
            </p>
          )}
        </div>

        {/* Experience Section */}
        {resume.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="border-l-4 border-primary-500 pl-4 ml-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {exp.position}
                      </h3>
                      <div className="text-primary-600 font-medium">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -
                      {exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : " Present"}
                    </div>
                  </div>
                  {exp.location && (
                    <div className="text-gray-600 text-sm mb-2">
                      {exp.location}
                    </div>
                  )}
                  <p className="text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {resume.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              Education
            </h2>
            <div className="space-y-6">
              {resume.education.map((edu) => (
                <div
                  key={edu.id}
                  className="border-l-4 border-primary-500 pl-4 ml-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {edu.school}
                      </h3>
                      <div className="text-primary-600 font-medium">
                        {edu.degree} in {edu.field}
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {new Date(edu.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -
                      {edu.endDate
                        ? new Date(edu.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : " Present"}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {resume.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    skill.level === "Expert"
                      ? "bg-primary-100 text-primary-800 border border-primary-200"
                      : skill.level === "Advanced"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  {skill.name}
                  <span className="ml-1 text-xs opacity-75">
                    • {skill.level}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVisualView = () => {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-sm">
        {/* Top Section Grid */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Photo Section - 2 columns */}
          <div className="col-span-2 flex justify-center items-center border-r border-dashed border-gray-300">
            {resume.personalInfo.photo ? (
              <img
                src={resume.personalInfo.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Personal Info Section - 3.33 columns */}
          <div className="col-span-3 space-y-2 border-r border-dashed border-gray-300 pr-6">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary-600">
                {resume.personalInfo.fullName}
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">
                  {resume.personalInfo.gender || "Not specified"}
                </span>
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">
                  {resume.personalInfo.birthday
                    ? new Date(
                        resume.personalInfo.birthday
                      ).toLocaleDateString()
                    : "Not specified"}
                </span>
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">
                  {resume.personalInfo.address || "Not specified"}
                </span>
              </p>
            </div>
          </div>

          {/* Contact Info Section - 3.33 columns */}
          <div className="col-span-3 space-y-2 border-r border-dashed border-gray-300 pr-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Contact Information
            </h3>
            <div className="space-y-1">
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-medium">
                  {resume.personalInfo.phone || "Not specified"}
                </span>
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">
                  {resume.personalInfo.email || "Not specified"}
                </span>
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium">
                  {resume.personalInfo.skype || "Not specified"}
                </span>
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <a
                  href={resume.personalInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 hover:underline"
                >
                  {resume.personalInfo.portfolio || "Not specified"}
                </a>
              </p>
            </div>
          </div>

          {/* Professional Areas Section - 3.33 columns */}
          <div className="col-span-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Professional Areas
            </h3>
            <div className="space-y-2">
              <div className="space-y-1">
                {resume.personalInfo.professionalAreas.map((area) => (
                  <div
                    key={area.id}
                    className="grid grid-cols-2 gap-2 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="font-medium text-gray-800">{area.name}</div>
                    <div className="text-gray-600">{area.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div
          id="timeline-container"
          style={{ width: "100%", height: "400px" }}
          className="relative"
        >
          <div className="absolute top-0 left-0 z-10 text-2xl font-bold text-gray-400">
            Work Experience
          </div>
          <div className="absolute bottom-0 z-10 text-2xl font-bold text-gray-400">
            Education
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-12 gap-6 mt-12">
          {/* Hobbies and Languages Section */}
          <div className="col-span-3 space-y-6">
            {/* Hobbies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Hobbies
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {resume.personalInfo.hobbies.map((hobby) => (
                  <div key={hobby.id} className="flex flex-col items-center">
                    <span className="text-2xl mb-1">{hobby.icon}</span>
                    <span className="text-xs text-gray-600 text-center">
                      {hobby.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Languages
              </h3>
              <div className="space-y-3">
                {resume.languages.map((language) => (
                  <div key={language.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{language.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              getProficiencyLevel(language.proficiency) >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Identity Path Section */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Identity Path
            </h3>
            <div className="space-y-4">
              {Object.entries(resume.identityTraits).map(
                ([trait, value], index) => (
                  <div key={trait} className="relative">
                    {/* Vertical line connector */}
                    {index < Object.keys(resume.identityTraits).length - 1 && (
                      <div className="absolute left-3 top-8 w-0.5 h-8 bg-gray-200"></div>
                    )}
                    <div className="flex items-start gap-4">
                      {/* Circle indicator with progress */}
                      <div className="relative w-6 h-6 flex-shrink-0">
                        <div className="absolute inset-0 rounded-full bg-gray-100"></div>
                        <div
                          className="absolute inset-0 rounded-full border-2 border-primary-400"
                          style={{
                            clipPath: `inset(0 ${100 - value}% 0 0)`,
                          }}
                        ></div>
                      </div>
                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-700">
                            {trait
                              .split(/(?=[A-Z])/)[0]
                              .charAt(0)
                              .toUpperCase() +
                              trait.split(/(?=[A-Z])/)[0].slice(1)}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {trait.split(/(?=[A-Z])/)[1]}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-400 rounded-full"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {value}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="col-span-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Skills
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Transferable Skills */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
                  Transferable Skills
                </h4>
                <div className="space-y-3">
                  {["Expert", "Advanced", "Intermediate", "Basic"].map(
                    (level) => {
                      const levelSkills = resume.skills.filter(
                        (skill) =>
                          skill.category === "transferable" &&
                          skill.level === level
                      );
                      if (levelSkills.length === 0) return null;

                      return (
                        <div key={level} className="pl-5 relative">
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
                            style={{
                              borderColor:
                                level === "Expert"
                                  ? "#4F46E5"
                                  : level === "Advanced"
                                  ? "#059669"
                                  : level === "Intermediate"
                                  ? "#B45309"
                                  : "#6B7280",
                            }}
                          ></div>
                          <div className="flex flex-wrap gap-2">
                            {levelSkills.map((skill) => (
                              <span
                                key={skill.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Job Related Skills */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Job Related Skills
                </h4>
                <div className="space-y-2">
                  {["Expert", "Advanced", "Intermediate", "Beginner"].map(
                    (level) => {
                      const levelSkills = resume.skills.filter(
                        (skill) =>
                          skill.category === "job-specific" &&
                          skill.level === level
                      );
                      if (levelSkills.length === 0) return null;

                      return (
                        <div key={level} className="pl-5 relative">
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
                            style={{
                              borderColor:
                                level === "Expert"
                                  ? "#4F46E5"
                                  : level === "Advanced"
                                  ? "#059669"
                                  : level === "Intermediate"
                                  ? "#B45309"
                                  : "#6B7280",
                            }}
                          ></div>
                          <div className="flex flex-wrap gap-2">
                            {levelSkills.map((skill) => (
                              <span
                                key={skill.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPersonalSection = () => (
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

      {/* Photo Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
        </label>
        <div className="flex items-center space-x-4">
          {resume.personalInfo.photo && (
            <img
              src={resume.personalInfo.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  dispatch(
                    updatePersonalInfo({
                      ...resume.personalInfo,
                      photo: reader.result as string,
                    })
                  );
                };
                reader.readAsDataURL(file);
              }
            }}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="input"
            value={resume.personalInfo.fullName}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input"
            value={resume.personalInfo.email}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="input"
            value={resume.personalInfo.phone}
            onChange={handlePersonalInfoChange}
            placeholder="+1 (123) 456-7890"
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="input"
            value={resume.personalInfo.location}
            onChange={handlePersonalInfoChange}
            placeholder="City, Country"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            className="input"
            value={resume.personalInfo.gender}
            onChange={handlePersonalInfoChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birthday
          </label>
          <input
            type="date"
            name="birthday"
            className="input"
            value={resume.personalInfo.birthday}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skype Address
          </label>
          <input
            type="text"
            name="skype"
            className="input"
            value={resume.personalInfo.skype}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio Website
          </label>
          <input
            type="url"
            name="portfolio"
            className="input"
            value={resume.personalInfo.portfolio}
            onChange={handlePersonalInfoChange}
            placeholder="https://your-portfolio.com"
          />
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Languages</h3>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Language name"
              className="input flex-1"
              value={newLanguage.name}
              onChange={(e) =>
                setNewLanguage({ ...newLanguage, name: e.target.value })
              }
            />
            <select
              className="input w-48"
              value={newLanguage.proficiency}
              onChange={(e) =>
                setNewLanguage({
                  ...newLanguage,
                  proficiency: e.target.value as Language["proficiency"],
                })
              }
            >
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Native">Native</option>
            </select>
            <button
              type="button"
              onClick={handleAddLanguage}
              className="btn btn-primary whitespace-nowrap"
            >
              Add Language
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resume.languages.map((lang) => (
              <div
                key={lang.id}
                className="flex justify-between items-center p-3 border rounded-lg group"
              >
                <span className="font-medium">{lang.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                    {lang.proficiency}
                  </span>
                  <button
                    onClick={() => dispatch(deleteLanguage(lang.id))}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Professional Areas</h3>
          <div className="space-y-4">
            {Object.values(
              PROFESSIONAL_AREAS.reduce((acc, area) => {
                if (!acc[area.category]) {
                  acc[area.category] = {
                    category: area.category,
                    areas: [],
                  };
                }
                acc[area.category].areas.push(area);
                return acc;
              }, {} as Record<string, { category: string; areas: ProfessionalArea[] }>)
            ).map(({ category, areas }) => (
              <div key={category}>
                <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => {
                    const isSelected =
                      resume.personalInfo.professionalAreas.some(
                        (selected) => selected.id === area.id
                      );
                    return (
                      <button
                        key={area.id}
                        onClick={() => {
                          if (isSelected) {
                            dispatch(
                              updatePersonalInfo({
                                ...resume.personalInfo,
                                professionalAreas:
                                  resume.personalInfo.professionalAreas.filter(
                                    (a) => a.id !== area.id
                                  ),
                              })
                            );
                          } else {
                            dispatch(
                              updatePersonalInfo({
                                ...resume.personalInfo,
                                professionalAreas: [
                                  ...resume.personalInfo.professionalAreas,
                                  area,
                                ],
                              })
                            );
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          isSelected
                            ? "bg-primary-100 text-primary-800 border-2 border-primary-500"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {area.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Hobbies (Select up to 4)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AVAILABLE_HOBBIES.map((hobby) => {
              const isSelected = resume.personalInfo.hobbies.some(
                (selected) => selected.id === hobby.id
              );
              return (
                <button
                  key={hobby.id}
                  onClick={() => {
                    if (isSelected) {
                      dispatch(
                        updatePersonalInfo({
                          ...resume.personalInfo,
                          hobbies: resume.personalInfo.hobbies.filter(
                            (h) => h.id !== hobby.id
                          ),
                        })
                      );
                    } else if (resume.personalInfo.hobbies.length < 4) {
                      dispatch(
                        updatePersonalInfo({
                          ...resume.personalInfo,
                          hobbies: [...resume.personalInfo.hobbies, hobby],
                        })
                      );
                    }
                  }}
                  disabled={!isSelected && resume.personalInfo.hobbies.length >= 4}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-primary-100 text-primary-800 border-2 border-primary-500"
                      : resume.personalInfo.hobbies.length >= 4 && !isSelected
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xl">{hobby.icon}</span>
                  <span>{hobby.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Professional Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          className="input"
          value={resume.personalInfo.summary}
          onChange={handlePersonalInfoChange}
          placeholder="Write a brief summary of your professional background and career objectives..."
        />
      </div>

      {/* Identity Traits Sliders */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Identity Traits</h3>
        <div className="space-y-4">
          {Object.entries(resume.identityTraits).map(([trait, value]) => (
            <div key={trait}>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {trait
                    .split(/(?=[A-Z])/)[0]
                    .charAt(0)
                    .toUpperCase() + trait.split(/(?=[A-Z])/)[0].slice(1)}
                </span>
                <span>{trait.split(/(?=[A-Z])/)[1]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={value}
                onChange={(e) =>
                  dispatch(
                    updateIdentityTraits({
                      ...resume.identityTraits,
                      [trait]: parseInt(e.target.value),
                    })
                  )
                }
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Build Your Resume</h1>
        <div className="space-x-4">
          <button
            onClick={() => {
              setIsPreviewOpen(true);
              setPreviewView("text");
            }}
            className="btn bg-gray-200 hover:bg-gray-300"
          >
            Preview
          </button>
          <button className="btn bg-gray-200 hover:bg-gray-300">
            Save Draft
          </button>
          <button className="btn btn-primary">Generate PDF</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        {(["personal", "education", "experience", "skills"] as const).map(
          (section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeSection === section
                  ? "text-primary-600 border-primary-600"
                  : "text-gray-500 border-transparent hover:text-primary-600"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Active Section Content */}
      {activeSection === "personal" && renderPersonalSection()}
      {activeSection === "education" && renderEducationSection()}
      {activeSection === "experience" && renderExperienceSection()}
      {activeSection === "skills" && renderSkillsSection()}

      {/* Preview Dialog */}
      <Dialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Resume Preview"
      >
        <div>
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => setPreviewView("text")}
              className={`px-4 py-2 rounded-lg transition-all ${
                previewView === "text"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Text View
            </button>
            <button
              onClick={() => setPreviewView("visual")}
              className={`px-4 py-2 rounded-lg transition-all ${
                previewView === "visual"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Visual View
            </button>
          </div>

          {previewView === "text" ? (
            <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
              {renderTextPreview()}
            </div>
          ) : (
            renderVisualView()
          )}
        </div>
      </Dialog>
    </div>
  );
};

// Helper function for language proficiency
const getProficiencyLevel = (proficiency: string): number => {
  switch (proficiency) {
    case "Native":
      return 5;
    case "Advanced":
      return 4;
    case "Intermediate":
      return 3;
    case "Basic":
      return 2;
    default:
      return 1;
  }
};

export default ResumeBuilder;
