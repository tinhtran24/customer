// components/UpdateProductModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { Setting } from "@/app/lib/definitions";

interface UpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: any;
  initialValues: Setting;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  onClose,
  onUpdate,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsLoading(true);
        await onUpdate(values);
        form.resetFields();
        onClose();
        setIsLoading(false);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Cập nhật"
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
          name="label"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng thêm nội dung" }]}
        >
          <Input placeholder="Nội dung ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
