import CourseResult from "@/components/course-result/CourseResult";

export default function CourseResultPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-center">Course Result</h1>
      <CourseResult courseId={params.id} />
    </div>
  );
}
