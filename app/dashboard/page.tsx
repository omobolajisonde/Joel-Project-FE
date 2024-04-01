"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import io from "socket.io-client";

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
}

interface FormData {
  name: string;
  matricNo: string;
}

export const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_WS}`);

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollModalOpen, setEnrollModalOpen] = useState<boolean>(false);
  const [attendanceModalOpen, setAttendanceModalOpen] =
    useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    matricNo: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<{ courses: Course[] }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/joelojerinde@gmail.com`
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleAttendanceClick = (course: Course) => {
    setSelectedCourse(course);
    setAttendanceModalOpen(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Emit the enroll event to the server
      socket.emit("enroll", {
        ...formData,
        ...selectedCourse,
        lecturerEmail: "joelojerinde@gmail.com",
      });
      console.log("Enroll event emitted");

      // Reset formData and close modal after successful submission (no need to wait for response)
      setFormData({ name: "", matricNo: "" });
      setEnrollModalOpen(false);
    } catch (error) {
      console.error("Error emitting enroll event:", error);
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Emit the attendance event to the server
      socket.emit("attendance", { ...formData, ...selectedCourse });
      console.log("Attendance event emitted");

      // Reset formData and close modal after successful submission (no need to wait for response)
      setFormData({ name: "", matricNo: "" });
      setAttendanceModalOpen(false);
    } catch (error) {
      console.error("Error emitting attendance event:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for enrollment feedback from the server
    socket.on("enroll_feedback", (feedback) => {
      console.log("Enrollment feedback received:", feedback);
      setLoading(false); // Set loading to false once feedback is received
      if (feedback.error) {
        console.error("Error occurred during enrollment:", feedback.error);
        // Handle error if needed
      } else {
        console.log("Student enrolled successfully");
        // Handle success if needed
      }
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("enroll_feedback");
    };
  }, []);

  useEffect(() => {
    // Listen for attendance feedback from the server
    socket.on("attendance_feedback", (feedback) => {
      console.log("Attendance feedback received:", feedback);
      setLoading(false); // Set loading to false once feedback is received
      if (feedback.error) {
        console.error(
          "Error occurred during attendance marking:",
          feedback.error
        );
        // Handle error if needed
      } else {
        console.log("Attendance marked successfully");
        // Handle success if needed
      }
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("attendance_feedback");
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            <h2>{course.courseCode}</h2>
            <p>{course.courseName}</p>
            <button onClick={() => handleEnrollClick(course)}>
              Enroll Student
            </button>
            <button onClick={() => handleAttendanceClick(course)}>
              Take Attendance
            </button>
            <Link href={`/dashboard/${course?.courseCode}/enrolled_students`}>
              See enrolled students for the course
            </Link>
            <Link href={`/dashboard/${course?.courseCode}/all_attendance`}>
              See attendance for the course
            </Link>
          </li>
        ))}
      </ul>

      {/* Enroll Modal */}
      {enrollModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* Modal content for enrollment */}
            <span className="close" onClick={() => setEnrollModalOpen(false)}>
              &times;
            </span>
            <h2>
              Enroll Student for {selectedCourse && selectedCourse.courseCode}
            </h2>
            <form onSubmit={handleEnrollSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="matricNo">Matric No:</label>
                <input
                  type="text"
                  id="matricNo"
                  value={formData.matricNo}
                  onChange={(e) =>
                    setFormData({ ...formData, matricNo: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {attendanceModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* Modal content for taking attendance */}
            <span
              className="close"
              onClick={() => setAttendanceModalOpen(false)}
            >
              &times;
            </span>
            <h2>
              Take Attendance for {selectedCourse && selectedCourse.courseCode}
            </h2>
            <form onSubmit={handleAttendanceSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="matricNo">Matric No:</label>
                <input
                  type="text"
                  id="matricNo"
                  value={formData.matricNo}
                  onChange={(e) =>
                    setFormData({ ...formData, matricNo: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
