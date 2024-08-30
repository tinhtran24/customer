import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import { NewProduct } from "@/app/lib/definitions";
import { createProduct } from "@/app/lib/actions";
import { generateCode } from "@/app/utils/generateString";
interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsSubmit(true);
        const body: NewProduct = {
          title: values.title,
          description: values.description,
          code: generateCode("SP", new Date(), Date.now().valueOf()),
        };
        const result = await createProduct(body);

        setIsSubmit(false);

        if (result.statusCode) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          form.resetFields();
          onClose();
          message.success("Tạo sản phẩm thành công");
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Sản phẩm mới"
      onCancel={onClose}
      onOk={handleOk}
      footer={[
        <Button key="back" onClick={onClose}>
          Thoát
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={handleOk}
          loading={isSubmit}
        >
          Tạo
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng thêm tên sản phẩm" }]}
        >
          <Input placeholder="Tên sản phẩm ..." />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng thêm thông tin mô tả" }]}
        >
          <Input.TextArea rows={4} placeholder="Mô tả ..." />
        </Form.Item>

      </Form>
    </Modal>
  );
};
