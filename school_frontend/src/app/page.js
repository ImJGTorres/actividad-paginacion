"use client";
import { useState, useEffect } from "react";  
import StudentList from "@/components/ui/StudentList";

const API_BASE_URL = "http://localhost:8000";

const loadStudents = async () => {
  const res = await fetch(`${API_BASE_URL}/students/`);
  const data = await res.json();
  return data;
}


export default function Home() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents().then((data) => {
      setStudents(data);
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <StudentList />
    </div>
  );
}
