import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button, message, Select } from "antd";
import {
  Customer,
  NewAppointment,
  NewProduct,
  User,
} from "@/app/lib/definitions";
import { createAppointment } from "@/app/lib/actions";
const { Option } = Select;

interface AddAppointmentModalProps {
  visible: boolean;
  users: User[];
  customers: Customer[];
  onClose: () => void;
  refresh: any;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  visible,
  users,
  customers,
  onClose,
  refresh,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsSubmit(true);
        const body: NewAppointment = {
          customerId: values.customerId,
          userInChargeId: values.userInChargeId,
          customerGroup: values.customerGroup,
        };
        const result = await createAppointment(body);

        setIsSubmit(false);

        if (result.statusCode) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          form.resetFields();
          onClose();
          message.success("Tạo lịch hẹn thành công");
          refresh();
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Lịch hẹn"
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
          name="customerId"
          label="Khách hàng"
          rules={[{ required: true, message: "Chọn khách hàng" }]}
        >
          <Select
            placeholder="- Chọn -"
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              (option?.children as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {customers?.map((user) => (
              <Option key={user.id} value={user.id}>
                {`${user.fullName} - ${user.code}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="userInChargeId"
          label="Người phụ trách"
          rules={[{ required: true, message: "Chọn người phụ trách" }]}
        >
          <Select
            placeholder="- Chọn -"
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              (option?.children as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {users?.map((user) => (
              <Option key={user.id} value={user.id}>
                {`${user.name} - ${user.email}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="customerGroup"
          label="Nhóm khách hàng"
          rules={[{ required: true, message: "Vui lòng thêm nhóm khách hàng" }]}
        >
          <Input placeholder="Nhóm khách hàng ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
