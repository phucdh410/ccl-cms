import { AppContext } from "@/context/AppContext";
import supabase, { bucketName, supabaseUrl } from "@/supbase/supabase";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useContext, useEffect, useState } from "react";

interface CourseResultModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "update";
  courseId: string;
  courseResultId?: string;
  onRefetch(): Promise<void>;
}

export default function CourseResultModal({
  open,
  setOpen,
  mode,
  courseId,
  courseResultId,
  onRefetch,
}: CourseResultModalProps) {
  const appContext = useContext(AppContext);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryImgs, setGalleryImgs] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [data, setData] = useState<any>();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    values.testMonth = Number(values.testMonth);
    values.year = values.year.toString();
    if (galleryImgs.length > 0) {
      values.imageSrc = galleryImgs[0];
    }
    setConfirmLoading(true);
    try {
      if (mode === "create") {
        await handleCreateCourseResult(values);
      } else if (mode === "update") {
        await handleUpdateCourseResult(values);
      }
      setOpen(false);
    } catch (err) {
      console.error("err", err);
    } finally {
      setConfirmLoading(false);
      onRefetch();
    }
  };

  const handleCreateCourseResult = async (values: any) => {
    try {
      const body = {
        ...values,
        galleryImgs,
        Course: {
          connect: {
            id: courseId,
          },
        },
      };
      await fetch("/api/course/result", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => res.json());
      appContext.openNotification(
        "success",
        "Success",
        "Course's Result created successfully"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCourseResult = async (values: any) => {
    try {
      const body = {
        ...values,
        galleryImgs,
      };
      await fetch(`/api/course/result/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }).then((res) => res.json());

      appContext.openNotification(
        "success",
        "Success",
        "Course's Result updated successfully"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadImage = async (file: RcFile) => {
    const studentName: string = form.getFieldValue("studentName");
    if (!studentName) {
      appContext.openNotification(
        "warning",
        "Warning",
        "Please enter student name"
      );
      return;
    }

    try {
      setUploading(true);
      const fileDir = `/${studentName.toLowerCase()}/${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileDir, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });
      if (data) {
        return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${data.path}`;
      } else {
        throw error;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadGalleryImages = async (file: RcFile) => {
    const url = await handleUploadImage(file);
    if (!url) return true;
    appendGalleryImg(url);
    appendFile({ uid: url, url, name: url });
    return false;
  };

  const handleRemoveImage = (file: UploadFile) => {
    setGalleryImgs((prev) => prev.filter((img) => img !== file.url));
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const getCourseResult = async () => {
    try {
      if (mode === "create") return;
      setFormLoading(true);
      const response = await fetch(`/api/course/result/${courseResultId}`).then(
        async (rs) => await rs.json()
      );
      setData(response);
    } catch (err) {
      console.error("err", err);
    } finally {
      setFormLoading(false);
    }
  };

  const loadGalleryImgs = async () => {
    form.setFieldsValue(data);
    const galleryImgs: string[] = data?.galleryImgs;
    for (const url of galleryImgs) {
      const file = { uid: url, url, name: url };
      appendGalleryImg(url);
      appendFile(file);
    }
  };

  const appendFile = (file: UploadFile) => {
    setFileList((prev) => {
      if (prev.find((f) => f.uid === file.uid)) return prev;
      return [...prev, file];
    });
  };

  const appendGalleryImg = (url: string) => {
    setGalleryImgs((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  };

  useEffect(() => {
    if (!data) return;
    loadGalleryImgs();
  }, [data]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setFileList([]);
      setGalleryImgs([]);
      setFormLoading(false);
    } else {
      getCourseResult();
    }
  }, [open]);

  return (
    <Modal
      title={
        mode === "create" ? "Create Course Result" : "Update Course Result"
      }
      open={open}
      onOk={handleOk}
      width={800}
      confirmLoading={uploading || confirmLoading}
      onCancel={handleCancel}
      closable={false}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        disabled={formLoading}
        form={form}
        name="wrap"
        labelCol={{ flex: "130px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
      >
        <Form.Item
          label="Student name"
          name="studentName"
          rules={[{ required: true }]}
        >
          <Input placeholder="Student's name" />
        </Form.Item>
        <Form.Item
          label="Occupation"
          name="occupation"
          rules={[{ required: true }]}
        >
          <Input placeholder="Occupation" />
        </Form.Item>
        {/* <Form.Item
          label="Test month"
          name="testMonth"
          rules={[{ required: true }]}
        >
          <InputNumber
            className="w-full"
            min={1}
            max={12}
            placeholder="Test month"
          />
        </Form.Item> */}
        <Form.Item
          label="Test time"
          name="testTime"
          rules={[{ required: true }]}
        >
          <Input className="w-full" placeholder="Test time (Q1/Q2/Q3/Q4)" />
        </Form.Item>
        <Form.Item label="Result" name="result" rules={[{ required: true }]}>
          <Input placeholder="60/80" />
        </Form.Item>
        <Form.Item
          label="Group Result"
          name="resultGroup"
          rules={[{ required: true }]}
        >
          <Input placeholder="70+" />
        </Form.Item>
        <Form.Item label="Comment" name="resultComment">
          <Input placeholder="Only learn in 7 days" />
        </Form.Item>
        <Form.Item label="Year" name="year" rules={[{ required: true }]}>
          <InputNumber
            className="w-full"
            minLength={4}
            maxLength={4}
            placeholder="Test Year"
          />
        </Form.Item>
        <Form.Item label="Url" name="url">
          <Input placeholder="#" />
        </Form.Item>
        <Upload
          action="/api/storage/upload"
          accept="image/*"
          fileList={fileList}
          multiple={true}
          showUploadList={true}
          beforeUpload={(file) => handleUploadGalleryImages(file)}
          onRemove={(file) => handleRemoveImage(file)}
          disabled={uploading}
        >
          <Button
            loading={uploading}
            className="ml-1 mt-1"
            icon={<UploadOutlined />}
          >
            Upload Gallery Images
          </Button>
        </Upload>
      </Form>
    </Modal>
  );
}
