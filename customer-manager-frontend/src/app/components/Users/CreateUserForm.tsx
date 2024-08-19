"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Form, Input, Button, Space, message } from "antd";
import { useRouter } from "next/navigation";
import { NewUser } from "@/app/lib/definitions";
import { createUser } from "@/app/lib/actions";

export default function CreateUserForm() {
  const [form] = Form.useForm();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setIsFormSubmitting(true);

    const newUser: NewUser = {
      email: values.email,
      name: values.name,
      password: values.password,
    };

    const result = await createUser(newUser);

    setIsFormSubmitting(false);

    if (result.statusCode) {
      message.error(
        Array.isArray(result.message) ? result.message[0] : result.message
      );
    } else {
      message.success(result.message);
      router.push("/dashboard/admin");
    }
  };

  return (
    <Form
      autoCorrect="off"
      autoComplete="off"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 8 }}
      form={form}
      onFinish={onFinish}
    >
      <Form.Item label="Email" required>
        <Form.Item
          name="email"
          noStyle
          rules={[{ required: true, type: "email", message: "Hãy nhập email" }]}
        >
          <Input autoComplete="none" />
        </Form.Item>
      </Form.Item>

      <Form.Item label="Tên người dùng" required>
        <Form.Item
          name="name"
          noStyle
          rules={[{ required: true, message: "Hãy nhập tên người dùng" }]}
        >
          <Input autoComplete="none" />
        </Form.Item>
      </Form.Item>

      <Form.Item label="Mật khẩu" required>
        <Form.Item
          name="password"
          noStyle
          rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}
        >
          <Input.Password autoComplete="none" />
        </Form.Item>
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space size={"middle"}>
          <Button type="primary" htmlType="submit" loading={isFormSubmitting}>
            Tạo
          </Button>

          <Button type="primary" style={{ background: "gray" }}>
            <Link href="/dashboard/admin/">Hủy</Link>
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
