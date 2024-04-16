"use client";

import { loginUser } from "@/app/api/auth";
import { setCookie } from "@/utils/cookie";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginContent = () => {
  //#region Data
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  //#endregion

  //#region Event
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await loginUser(values);

      if (!!res?.error) {
        messageApi.open({
          type: "error",
          content: res.error?.message,
        });

        form.resetFields();
        return;
      }

      setCookie("auth", res.data, 7);
      router.push("/course");
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: "error",
        content: "Có lỗi xảy ra!",
      });

      form.resetFields();
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  //#region Render
  return (
    <div className="bg-white p-8 rounded-2xl flex flex-col">
      {contextHolder}
      <h3 className="text-center text-2xl mb-3">Login</h3>
      <Form
        form={form}
        name="wrap"
        labelCol={{ flex: "110px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }]}
          className="mb-2"
        >
          <Input placeholder="Your email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
          className="mb-2"
        >
          <Input.Password placeholder="Your password" />
        </Form.Item>

        <div className="text-center mt-5">
          <Form.Item>
            <Button htmlType="submit" type="primary" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
  //#endregion
};
