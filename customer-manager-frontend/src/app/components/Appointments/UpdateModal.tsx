// components/UpdateProductModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Spin } from "antd";
import { Appointment, Customer, Pagination, User } from "@/app/lib/definitions";
import { fetchCustomers, fetchUsers } from "@/app/lib/actions";
const { Option } = Select;

interface UpdateAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdateAppointment: any;
  initialValues: Appointment;
  refreshPage: any;
  customers: Customer[];
  users: User[]
}

export const UpdateAppointmentModal: React.FC<UpdateAppointmentModalProps> = ({
  visible,
  onClose,
  onUpdateAppointment,
  initialValues,
  refreshPage,
  users,
  customers
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
        await onUpdateAppointment(values);
        refreshPage();
        form.resetFields(); // Reset form fields after submission
        onClose(); // Close the modal
        setIsLoading(false);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  if (!users || !customers)
    return (
      <Modal title="Cập nhật lịch hẹn" visible={true} footer={[]}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "5rem 0",
          }}
        >
          <Spin size="large" />
        </div>
      </Modal>
    );

  return (
    <Modal
      visible={visible}
      title="Cập nhật lịch hẹn"
      onCancel={onClose}
      onOk={handleOk}
      footer={[
        <Button key="back" onClick={onClose}>
          Thoát
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleOk}
        >
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
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
            rules={[
              { required: true, message: "Vui lòng thêm nhóm khách hàng" },
            ]}
          >
            <Input placeholder="Nhóm khách hàng ..." />
          </Form.Item>
        </Form>
      </Form>
    </Modal>
  );
};
