"use client";

import { useState } from "react";
import axios from "axios";

interface Course {
  courseCode: string;
  courseName: string;
}

const CreateLecturer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    courses: [{ courseCode: "", courseName: "" }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: keyof Course
  ) => {
    const { value } = e.target;
    const updatedCourses = [...formData.courses];
    updatedCourses[index][fieldName] = value;
    setFormData({
      ...formData,
      courses: updatedCourses,
    });
  };

  const handleAddCourse = () => {
    setFormData({
      ...formData,
      courses: [...formData.courses, { courseCode: "", courseName: "" }],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lecturers`,
        formData
      );
      console.log(response.data);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        courses: [{ courseCode: "", courseName: "" }],
      });
    } catch (error) {
      console.error("Error creating lecturer:", error);
    }
  };

  return (
    <div>
      <h1>Create Lecturer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Courses:</label>
          {formData.courses.map((course, index) => (
            <div key={index}>
              <input
                type="text"
                name="courseCode"
                placeholder="Course Code"
                value={course.courseCode}
                onChange={(e) => handleChange(e, index, "courseCode")}
                required
              />
              <input
                type="text"
                name="courseName"
                placeholder="Course Name"
                value={course.courseName}
                onChange={(e) => handleChange(e, index, "courseName")}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddCourse}>
            Add Course
          </button>
        </div>
        <button type="submit">Create Lecturer</button>
      </form>
    </div>
  );
};

export default CreateLecturer;
