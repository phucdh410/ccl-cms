"use client";
import { PlusCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import CourseModal from "./CourseModal";
import CourseTable from "./CourseTable";

export default function Courses() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const hanldeCreateCourse = () => {
    setModalMode("create");
    setModalOpen(true);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const courses = await fetch("/api/course").then((res) => res.json());
      setCourses(courses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  
  return (
    <>
      <div className="mb-3 space-x-3">
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={hanldeCreateCourse}
        >
          Create Course
        </Button>
        <Button icon={<ReloadOutlined />} type="primary" onClick={fetchCourses}>
          Refresh
        </Button>
      </div>
      <CourseTable
        courses={courses}
        loading={loading}
        setModalOpen={setModalOpen}
        setModalMode={setModalMode}
        setSelectedCourse={setSelectedCourse}
        onRefetch={fetchCourses}
      />
      <CourseModal
        open={modalOpen}
        setOpen={setModalOpen}
        mode={modalMode}
        data={selectedCourse}
        onRefetch={fetchCourses}
      />
    </>
  );
}
