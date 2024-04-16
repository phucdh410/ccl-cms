export const courseResultMapping = (course: any) => {
  if (!course || !course?.courseResults || !course?.courseResults?.length) {
    return null;
  }

  const result = course.courseResults.map((item: any) => {
    const modifiedGalleryImgs = item.galleryImgs?.filter(
      (img: any) => img !== item?.imageSrc
    );
    return {
      imageSrc: item.imageSrc || course.imageSrc,
      studentName: item.studentName || "",
      occupation: item.occupation || "",
      result: item.result || "",
      resultGroup: item.resultGroup || "",
      resultComment: item.resultComment || "",
      url: item.url || "",
      galleryImgs: [item?.imageSrc, ...modifiedGalleryImgs] || [],
      TestMonth: ("0" + item.testMonth).slice(-2),
      TestYear: item.year ? `Results${item.year}` : "",
      TestTime: item?.testTime || "",
    };
  });
  return result;
};
