-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "galleryImgs" TEXT[],
    "dateDisplay" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseResult" (
    "id" TEXT NOT NULL,
    "studentName" TEXT,
    "occupation" TEXT,
    "testMonth" INTEGER,
    "result" TEXT NOT NULL,
    "resultGroup" TEXT,
    "resultComment" TEXT,
    "imageSrc" TEXT,
    "url" TEXT,
    "year" TEXT,
    "galleryImgs" TEXT[],
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseResult" ADD CONSTRAINT "CourseResult_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
