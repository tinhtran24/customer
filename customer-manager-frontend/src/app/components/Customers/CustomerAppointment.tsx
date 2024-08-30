"use client";
import { createAppointmentForCustomer, fetchUsers } from "@/app/lib/actions";
import {
  CreateCustomerAppointmentBody,
  SETTINGS_TYPE,
  User,
} from "@/app/lib/definitions";
import {
  Form,
  Input,
  Row,
  Button,
  message,
  Select,
  Col,
  Space,
  DatePicker,
  TableColumnsType,
  Table,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuthContext } from "../auth";
import { generateCode } from "@/app/utils/generateString";
import { SettingSelect } from "../Common/Select";

const { Option } = Select;

interface AppointmentData {
  code: string;
  date: string;
  content: string;
  label: string;
}

interface CreateCustomerAppointmentProps {
  customerId: string;
}

export function CreateCustomerAppointment({
  customerId,
}: CreateCustomerAppointmentProps) {
  const [formModal] = Form.useForm();
  const { currentUser } = useAuthContext();

  const [data, setData] = useState<AppointmentData[]>([]); //  awating for api - update later
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    formModal
      .validateFields()
      .then(async (values) => {
        try {
          setIsLoading(true);
          const body: CreateCustomerAppointmentBody = {
            createScheduleDto: {
              customerId: customerId,
            },
            createTaskDto: [
              {
                code: generateCode("LH", new Date(), Date.now().valueOf()),
                description: values.content,
                date: values.date,
                label: values.label,
                userInChargeId: (currentUser as any).sub,
              },
            ],
          };

          const result = await createAppointmentForCustomer(body);
          if (result.statusCode) {
            message.error(
              Array.isArray(result.message) ? result.message[0] : result.message
            );
          } else {
            message.success("Tạo lịch hẹn thành công");
            formModal.resetFields();
            setIsModalVisible(false);
          }
        } catch (error) {
          message.error("Đã có lỗi xảy ra khi gửi dữ liệu.");
        } finally {
          setIsLoading(false);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: TableColumnsType<AppointmentData> = [
    {
      title: "Mã công việc",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Ngày hẹn",
      dataIndex: "date",
      key: "date",
      render: (d) => {
        const date = new Date(d);
        const formattedDate = date.toLocaleDateString("en-GB");
        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
  ];

  return (
    <>
      <Modal
        title="Thêm lịch hẹn"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Thoát
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="LHForm"
            loading={isLoading}
          >
            Thêm
          </Button>,
        ]}
      >
        <Form
          form={formModal}
          id="LHForm"
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            name="date"
            label="Ngày hẹn"
            rules={[{ required: true, message: "Vui lòng chọn ngày hẹn" }]}
          >
            <DatePicker
              placeholder="Chọn ngày và giờ ..."
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="label"
            label="Mã công việc"
            rules={[{ required: true, message: "Vui lòng chọn mã công việc" }]}
          >
            <SettingSelect
              type={SETTINGS_TYPE.TASK_CODE}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Chi tiết"
            rules={[{ required: true, message: "Vui lòng thêm chi tiết" }]}
          >
            <Input.TextArea placeholder="Chi tiết..." />
          </Form.Item>
        </Form>
      </Modal>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ float: "right", marginBottom: "1rem" }}
      >
        Thêm lịch hẹn
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />
    </>
  );
}
