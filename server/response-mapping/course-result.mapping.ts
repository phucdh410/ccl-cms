export const courseResultMapping = (course: any) => {
  if (!course || !course?.courseResults || !course?.courseResults?.length) {
    return null;
  }

  const result = course.courseResults.map((item: any) => {
    return {
      imageSrc: item.imageSrc || course.imageSrc,
      studentName: item.studentName || "",
      occupation: item.occupation || "",
      result: item.result || "",
      resultGroup: item.resultGroup || "",
      resultComment: item.resultComment || "",
      url: item.url || "",
      galleryImgs: item.galleryImgs || [],
      TestMonth: ("0" + item.testMonth).slice(-2),
      TestYear: item.year ? `Results${item.year}` : "",
    };
  });
  return result;
};