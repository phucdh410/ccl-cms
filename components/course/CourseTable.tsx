import { AppContext } from "@/context/AppContext";
import { Button, Image, Modal, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useContext, useState } from "react";
import PlaceholderImg from "../PlaceholderImg";

interface CourseTableProps {
  courses: any[];
  loading: boolean;
  setModalOpen(open: boolean): void;
  setModalMode(mode: "create" | "update"): void;
  setSelectedCourse(course: any): void;
  onRefetch(): Promise<void>;
}
export default function CourseTable({
  courses,
  loading,
  setModalOpen,
  setModalMode,
  setSelectedCourse,
  onRefetch,
}: CourseTableProps) {
  const appContext = useContext(AppContext);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [showImage, setShowImage] = useState(false);

  const columns: ColumnsType<any> = [
    {
      title: "Course's Name",
      dataIndex: "courseName",
      filters: courses?.map((course) => {
        return {
          text: course?.courseName,
          value: course?.courseName,
        };
      }),
      onFilter: (value: any, record) => record?.course?.startsWith(value),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEditCourse(record)}>
            Edit
          </Button>
          <Link href={`/course/${record.id}`}>
            <Button size="small">Results</Button>
          </Link>
          <Popconfirm
            title="Delete the course?"
            description="Are you sure to delete this course?"
            onConfirm={() => handleDeleteCourse(record)}
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

  const handleEditCourse = (record: any) => {
    setSelectedCourse(record);
    setModalMode("update");
    setModalOpen(true);
  };

  const handleDeleteCourse = async (record: any) => {
    const id = record?.id;
    if (!id) return;
    setConfirmLoading(true);
    try {
      const response = await fetch(`/api/course/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        appContext.openNotification(
          "success",
          "Success",
          "Course deleted successfully"
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
        dataSource={courses}
        scroll={{ x: 1300, y: 600 }}
      />
    </>
  );
}
