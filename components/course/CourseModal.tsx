import { AppContext } from "@/context/AppContext";
import { Form, Input, Modal, Upload, UploadFile } from "antd";
import { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import supabase, { bucketName, supabaseUrl } from "@/supbase/supabase";

interface CourseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "update";
  data?: any;
  onRefetch(): Promise<void>;
}
export default function CourseModal(props: CourseModalProps) {
  const appContext = useContext(AppContext);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryImgs, setGalleryImgs] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [deletedFile, setDeletedFile] = useState<string[]>([]);

  const { open, mode } = props;

  const handleCancel = () => {
    props.setOpen(false);
    setDeletedFile([]);
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    if (values?.files) delete values.files;

    setConfirmLoading(true);
    try {
      if (mode === "create") {
        await onCreate(values);
      } else if (mode === "update") {
        await onUpdate(values);
      }

      if (deletedFile.length) {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .remove(deletedFile);
      }

      handleCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
      props.onRefetch();
    }
  };

  const onCreate = async (values: any) => {
    try {
      await fetch("/api/course", {
        method: "POST",
        body: JSON.stringify({ ...values, galleryImgs }),
      }).then((res) => res.json());
      appContext.openNotification(
        "success",
        "Success",
        "Course created successfully"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      const id = props?.data?.id;
      if (!id) throw new Error("CourseId is required");

      await fetch(`/api/course/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...values, galleryImgs }),
      })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(err);
        });

      appContext.openNotification(
        "success",
        "Success",
        "Course update successfully"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleUploadImage = async (file: RcFile) => {
    const courseName: string = form.getFieldValue("courseName");

    if (!courseName) {
      appContext.openNotification(
        "warning",
        "Warning",
        "Please enter Course name"
      );
      return;
    }

    try {
      setUploading(true);
      setConfirmLoading(true);

      const fileDir = `/COURSE-${courseName.toLowerCase()}/${file.name}`;
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
        throw new Error(JSON.stringify(error));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
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
    const regex = new RegExp(`https://.+?/${bucketName}/(.+)$`);
    const _path = file.url?.match(regex)?.[1];
    _path && setDeletedFile((prev) => [...prev, _path]);

    setGalleryImgs((prev) => prev.filter((img) => img !== file.url));
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const loadGalleryImgs = async () => {
    form.setFieldsValue(props?.data);
    const galleryImgs: string[] = props?.data?.galleryImgs;
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
    if (!props.open) {
      form.resetFields();
    } else if (props?.data) {
      form.setFieldsValue(props.data);
      loadGalleryImgs();
    }
  }, [props.open, props?.data]);

  return (
    <Modal
      title={mode === "create" ? "Create Course" : "Update Course"}
      open={open}
      onOk={handleOk}
      width={800}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      closable={false}
      maskClosable={false}
    >
      <Form
        form={form}
        name="wrap"
        labelCol={{ flex: "110px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
      >
        <Form.Item label="Name" name="courseName" rules={[{ required: true }]}>
          <Input placeholder="Course's name" />
        </Form.Item>
        <Form.Item
          label="Date Display"
          name="dateDisplay"
          rules={[{ required: true }]}
        >
          <Input placeholder="Q1.2023, Q2.2023, Q4.2022 (you must use this format)" />
        </Form.Item>
        <Form.Item label="Top gallery" name="files">
          <Upload
            action="/api/storage/upload"
            accept="image/*"
            fileList={fileList}
            multiple={true}
            listType="picture-card"
            beforeUpload={(file) => handleUploadGalleryImages(file)}
            onRemove={(file) => handleRemoveImage(file)}
            disabled={uploading}
          >
            {uploadButton}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
