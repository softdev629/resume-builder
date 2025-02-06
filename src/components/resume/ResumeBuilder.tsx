import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  setCurrentResume,
  updatePersonalInfo,
  addEducation,
  addExperience,
  addSkill,
} from "../../store/slices/resumeSlice";
import type { Resume, Education, Experience, Skill } from "../../types";

type Section = "personal" | "education" | "experience" | "skills";
type PreviewView = "text" | "visual";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const resume = useAppSelector((state) => state.resume.currentResume);
  const isLoading = useAppSelector((state) => state.resume.isLoading);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [previewView, setPreviewView] = useState<PreviewView>("text");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [timelineWidth] = useState(1000);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);

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
        },
        education: [],
        experience: [],
        skills: [],
      };
      dispatch(setCurrentResume(newResume));
    }
  }, [user, resume, navigate, dispatch]);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
      setZoomLevel((prev) => Math.max(0.5, Math.min(2, prev + delta)));
    };

    timeline.addEventListener("wheel", handleWheelEvent, { passive: false });

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - scrollPosition.x, y: e.clientY - scrollPosition.y });
      timeline.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setScrollPosition({ x: newX, y: newY });
      timeline.scrollLeft = -newX;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      timeline.style.cursor = 'grab';
    };

    timeline.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      timeline.removeEventListener("wheel", handleWheelEvent);
      timeline.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const getTimelineYears = () => {
    const allDates = [
      ...resume!.experience.flatMap((exp) => [exp.startDate, exp.endDate]),
      ...resume!.education.flatMap((edu) => [edu.startDate, edu.endDate]),
    ].filter(Boolean);

    const minYear = Math.min(
      ...allDates.map((date) => new Date(date).getFullYear())
    );
    const maxYear = Math.max(
      ...allDates.map((date) =>
        date ? new Date(date).getFullYear() : new Date().getFullYear()
      )
    );

    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  };

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    });
  };

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
          <div key={edu.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{edu.school}</h3>
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
          <div key={exp.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{exp.position}</h3>
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
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            Add Skill
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resume.skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <span className="font-medium">{skill.name}</span>
            <span className="text-sm text-gray-600">{skill.level}</span>
          </div>
        ))}
      </div>
    </section>
  );

  const renderVisualView = () => (
    <div 
      ref={timelineRef}
      className="relative h-[600px] overflow-x-auto"
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none' // Prevent text selection while dragging
      }}

    >
      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          width: `${timelineWidth * zoomLevel}px`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
          transform: `translate(${scrollPosition.x}px, ${scrollPosition.y}px)`
        }}
      >
        {/* Timeline Bar */}
        <div className="h-1 bg-gray-300 w-full relative">
          {getTimelineYears().map((year) => (
            <div
              key={year}
              className="absolute transform -translate-x-1/2"
              style={{
                left: `${
                  (year - getTimelineYears()[0]) *
                  (100 / (getTimelineYears().length - 1))
                }%`,
              }}
            >
              <div className="h-3 w-1 bg-gray-300 -mt-1 mx-auto" />
              <div className="mt-2 text-sm text-gray-600">{year}</div>
            </div>
          ))}
        </div>

        {/* Experience Sections - Above Timeline */}
        <div className="absolute w-full" style={{ top: "-370px" }}>
          {resume.experience.map((exp, index) => {
            const startYear = new Date(exp.startDate).getFullYear();
            const endYear = exp.endDate
              ? new Date(exp.endDate).getFullYear()
              : new Date().getFullYear();
            const timelineStart = getTimelineYears()[0];
            const timelineLength = getTimelineYears().length - 1;

            return (
              <div
                key={exp.id}
                className="absolute"
                style={{
                  left: `${
                    (startYear - timelineStart) * (100 / timelineLength)
                  }%`,
                  width: `${(endYear - startYear) * (100 / timelineLength)}%`,
                  top: `${160 - (index % 2) * 120}px`, // Stack items vertically
                }}
              >
                <div className="bg-primary-100 p-3 rounded-lg border border-primary-200 mb-2 w-48">
                  <div className="font-semibold truncate">{exp.position}</div>
                  <div className="text-sm truncate">{exp.company}</div>
                  <div className="text-xs text-gray-500">
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
                      : "Present"}
                  </div>
                </div>
                <div className="w-3 h-3 bg-primary-500 rounded-full -ml-1.5" />
                <div
                  className={`border-l border-dashed border-primary-300`}
                  style={{ height: `${(index % 2) * 122 + 96}px` }}
                />
              </div>
            );
          })}
        </div>

        {/* Education Sections - Below Timeline */}
        <div className="absolute w-full" style={{ top: "40px" }}>
          {resume.education.map((edu) => {
            const startYear = new Date(edu.startDate).getFullYear();
            const endYear = edu.endDate
              ? new Date(edu.endDate).getFullYear()
              : new Date().getFullYear();
            const timelineStart = getTimelineYears()[0];
            const timelineLength = getTimelineYears().length - 1;

            return (
              <div
                key={edu.id}
                className="absolute"
                style={{
                  left: `${
                    (startYear - timelineStart) * (100 / timelineLength)
                  }%`,
                  width: `${(endYear - startYear) * (100 / timelineLength)}%`,
                }}
              >
                <div className="h-24 border-l border-dashed border-blue-300" />
                <div className="w-3 h-3 bg-blue-500 rounded-full -ml-1.5" />
                <div className="bg-blue-100 p-3 rounded-lg border border-blue-200 mt-2 w-48">
                  <div className="font-semibold truncate">{edu.school}</div>
                  <div className="text-sm truncate">{edu.degree}</div>
                  <div className="text-xs text-gray-500">
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
                      : "Present"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Build Your Resume</h1>
        <div className="space-x-4">
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
      {activeSection === "personal" && (
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
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
        </section>
      )}
      {activeSection === "education" && renderEducationSection()}
      {activeSection === "experience" && renderExperienceSection()}
      {activeSection === "skills" && renderSkillsSection()}

      {/* Preview Section */}
      <section className="bg-white p-8 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
          <div className="flex gap-2">
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
        </div>

        {previewView === "text" ? (
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
                            ? new Date(exp.endDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )
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
                            ? new Date(edu.endDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )
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
        ) : (
          renderVisualView()
        )}
      </section>
    </div>
  );
};

export default ResumeBuilder;
