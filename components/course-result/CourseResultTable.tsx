"use client";
import { AppContext } from "@/context/AppContext";
import { Button, Image, Modal, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useContext, useState } from "react";
import PlaceholderImg from "../PlaceholderImg";

interface CourseTableProps {
  courseResults: any[];
  loading: boolean;
  setModalOpen(open: boolean): void;
  setModalMode(mode: "create" | "update"): void;
  setSelectedCourseResult(courseResult: any): void;
  onRefetch(): Promise<void>;
}
export default function CourseResultTable({
  courseResults,
  loading,
  setModalOpen,
  setModalMode,
  setSelectedCourseResult,
  onRefetch,
}: CourseTableProps) {
  const appContext = useContext(AppContext);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [showImage, setShowImage] = useState(false);

  const columns: ColumnsType<any> = [
    {
      title: "Student's Name",
      dataIndex: "studentName",
      width: 200,
      filterSearch: true,
      filters: courseResults?.map((courseResult) => {
        return {
          text: courseResult?.studentName,
          value: courseResult?.studentName,
        };
      }),
      onFilter: (value: any, record) => record?.studentName?.startsWith(value),
    },
    {
      title: "Occupation",
      dataIndex: "occupation",
    },
    {
      title: "Test Month",
      dataIndex: "testMonth",
      sorter: (a, b) => a.testMonth - b.testMonth,
      render: (month: number) => ("0" + month).slice(-2),
    },
    {
      title: "Result",
      dataIndex: "result",
    },
    {
      title: "Result Group",
      dataIndex: "resultGroup",
    },
    {
      title: "Year",
      dataIndex: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Main Image",
      dataIndex: "imageSrc",
      render: (img) => (
        <Button type="primary" onClick={() => handleViewImages([img])}>
          View
        </Button>
      ),
    },
    {
      title: "Gallery",
      dataIndex: "galleryImgs",
      render: (imgs: []) => (
        <Button type="primary" onClick={() => handleViewImages(imgs)}>
          View
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEditCourseResult(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the result?"
            description="Are you sure to delete this result?"
            onConfirm={() => handleDeleteCourseResult(record)}
            okButtonProps={{ loading: confirmLoading }}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleViewImages = (images: string[]) => {
    setImages(images);
    setShowImage(true);
  };

  const handleEditCourseResult = (record: any) => {
    setSelectedCourseResult(record);
    setModalMode("update");
    setModalOpen(true);
  };

  const handleDeleteCourseResult = async (record: any) => {
    const id = record?.id;
    if (!id) return;
    setConfirmLoading(true);
    try {
      const response = await fetch(`/api/course/result/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        appContext.openNotification(
          "success",
          "Success",
          "Course result deleted successfully"
        );

        onRefetch();
      } else {
        appContext.openNotification("error", "Error", "Something went wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Images"
        open={showImage}
        width="80%"
        onCancel={() => setShowImage(false)}
        footer={null}
      >
        <Image.PreviewGroup items={images}>
          {images.map((image, index) => (
            <Image
              key={index}
              width={250}
              src={image}
              placeholder={<PlaceholderImg />}
              alt=""
            />
          ))}
        </Image.PreviewGroup>
      </Modal>
      <Table
        loading={loading}
        rowKey={(row: any) => row.id}
        columns={columns}
        dataSource={courseResults}
        scroll={{ x: 1300, y: 600 }}
      />
    </>
  );
}
