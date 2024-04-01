"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../socket";

interface Student {
  _id: string;
  name: string;
  matricNo: string;
}

interface EnrolledStudentsProps {
  params: any;
}

const EnrolledStudents: React.FC<EnrolledStudentsProps> = ({ params }) => {
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [studentsIsLoading, setStudentsIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      setStudentsIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/enroll/${params.course_code}`
        );
        console.log(response);

        setEnrolledStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching enrolled Students:", error);
      }
      setStudentsIsLoading(false);
    };

    fetchEnrolledStudents();
  }, [params.course_code]);

  const handleDeleteEnrolledStudent = (
    courseCode: string,
    matricNo: string
  ) => {
    try {
      setIsDeleting(true);
      // Emit the event to the server
      socket.emit("delete_enrolled_students", { courseCode, matricNo });
      console.log("Delete Event emmitted");
    } catch (error) {
      console.error("Error emitting delete event:", error);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    // Listen for attendance feedback from the server
    socket.on("delete_enrolled_students_feedback", (feedback) => {
      console.log("Delete Enrolled students feedback received:", feedback);
      setIsDeleting(false); // Set loading to false once feedback is received
      if (feedback.error) {
        console.error(
          "Error occurred during deletion of enrolled students",
          feedback.error
        );
      } else {
        console.log("Student deleted successfully");
      }
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("delete_enrolled_students_feedback");
    };
  }, []);

  if (studentsIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>
        Enrolled Students for Course{" "}
        {decodeURIComponent(params.course_code).replace("%20", " ")}
      </h2>
      <ul>
        {enrolledStudents.map((user) => (
          <li key={user._id}>
            <span>Name: {user.name}</span> |{" "}
            <span>Matric No: {user.matricNo}</span>
            <button
              onClick={() =>
                handleDeleteEnrolledStudent(
                  decodeURIComponent(params.course_code).replace("%20", " "),
                  user.matricNo
                )
              }
            >
              {isDeleting ? "Deleting" : "Delete student"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnrolledStudents;
