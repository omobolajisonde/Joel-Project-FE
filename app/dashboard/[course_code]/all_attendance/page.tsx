"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  _id: string;
  name: string;
  matricNo: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  studentsPresent: Student[];
}

interface AttendancePageProps {
  params: any;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ params }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/courses/attendance/${decodeURIComponent(params.course_code).replace(
            "%20",
            " "
          )}`
        );
        console.log(response);

        setAttendanceRecords(response.data.attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
      setLoading(false);
    };

    fetchAttendanceRecords();
  }, [params.course_code]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>
        Attendance Records for Course{" "}
        {decodeURIComponent(params.course_code).replace("%20", " ")}
      </h2>
      <ul>
        {attendanceRecords.map((record, index) => (
          <li key={index}>
            <span>Date: {record.date}</span>
            <ul>
              {record.studentsPresent.map((student, index) => (
                <li key={index}>
                  <span>Name: {student.name}</span> |{" "}
                  <span>Matric No: {student.matricNo}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendancePage;
