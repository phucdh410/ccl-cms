import { AppContext } from "@/context/AppContext";
import { Form, Input, Modal } from "antd";
import { useContext, useEffect, useState } from "react";

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

  const { open, mode } = props;

  const handleCancel = () => {
    props.setOpen(false);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    setConfirmLoading(true);
    try {
      if (mode === "create") {
        await onCreate(values);
      } else if (mode === "update") {
        await onUpdate(values);
      }
      props.setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
      props.onRefetch();
    }
  };

  const onCreate = async (values: any) => {
    await fetch("/api/course", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((res) => res.json());
    appContext.openNotification(
      "success",
      "Success",
      "Course created successfully"
    );
  };

  const onUpdate = async (values: any) => {
    const id = props?.data?.id;
    if (!id) throw new Error("CourseId is required");
    await fetch(`/api/course/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    }).then((res) => res.json());
    appContext.openNotification(
      "success",
      "Success",
      "Course update successfully"
    );
  };

  useEffect(() => {
    if (!props.open) {
      form.resetFields();
    } else if (props?.data) {
      form.setFieldsValue(props.data);
    }
  }, [props.open]);

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
          <Input placeholder="04.2023, 02.2023, 09.2022 (you must use this format)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
