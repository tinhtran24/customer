// components/UpdateProductModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import { Product } from "@/app/lib/definitions";

interface UpdateProductModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdateProduct: any;
  initialValues: Product;
}

export const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  visible,
  onClose,
  onUpdateProduct,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues); // Set initial form values when modal is opened
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsLoading(true);
        await onUpdateProduct(values);
        form.resetFields(); // Reset form fields after submission
        onClose(); // Close the modal
        setIsLoading(false);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Cập nhật sản phẩm"
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
          loading={isLoading}
          onClick={handleOk}
        >
          Cập nhật
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
