"use client";
import { PlusCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import CourseResultModal from "./CourseResultModal";
import CourseResultTable from "./CourseResultTable";

interface CourseResultProps {
  courseId: string;
}
export default function CourseResult({ courseId }: CourseResultProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedCourseResult, setSelectedCourseResult] = useState<any>();
  const [courseResults, setCourseResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const hanldeCreateCourseResult = () => {
    setModalOpen(true);
    setModalMode("create");
    setSelectedCourseResult(null);
  };

  const fetchCourseResults = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/course/${courseId}`).then((res) =>
        res.json()
      );
      setCourseResults(response.courseResults);
    } catch (err: any) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseResults();
  }, [courseId]);

  return (
    <div>
      <div className="mb-3 space-x-3">
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={hanldeCreateCourseResult}
        >
          Create Result
        </Button>
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          onClick={fetchCourseResults}
        >
          Refresh
        </Button>
      </div>
      <CourseResultTable
        courseResults={courseResults}
        onRefetch={fetchCourseResults}
        setModalOpen={setModalOpen}
        setModalMode={setModalMode}
        setSelectedCourseResult={setSelectedCourseResult}
        loading={loading}
      />
      <CourseResultModal
        open={modalOpen}
        setOpen={setModalOpen}
        mode={modalMode}
        courseId={courseId}
        courseResultId={selectedCourseResult?.id}
        onRefetch={fetchCourseResults}
      />
    </div>
  );
}
