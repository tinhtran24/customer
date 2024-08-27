"use client";
import { createNote } from "@/app/lib/actions";
import { CreateNote } from "@/app/lib/definitions";
import { Form, Input, Button, message } from "antd";
import { useState } from "react";

interface DiscussFormProps {
    customerId: string;
}
const DiscussForm = ({customerId}: DiscussFormProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);

    try {
      const body: CreateNote = {
       customerId: customerId,
       description: values.description
      };

      const result = await createNote(body);
      if (result.statusCode) {
        message.error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        message.success("Lưu thông tin thành công");
        form.resetFields();
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="description"
        label="Nội dung"
        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
      >
        <Input.TextArea placeholder="Nhập nội dung..." rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Gửi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiscussForm;
