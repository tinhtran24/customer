import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { CreateSetting, SETTINGS_TYPE } from "@/app/lib/definitions";
import { createSettings } from "@/app/lib/actions";
import { generateCode } from "@/app/utils/generateString";
interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  type: SETTINGS_TYPE;
}

export const AddModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  type,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsSubmit(true);
        const body: CreateSetting = {
          key: generateCode("SET", new Date(), Date.now().valueOf()),
          label: values.label,
          type: type,
        };
        const result = await createSettings(body);

        setIsSubmit(false);

        if (result.statusCode) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          form.resetFields();
          onClose();
          message.success("Tạo thông tin thành công");
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Tạo mới"
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
