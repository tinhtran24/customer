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
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const [users, setUsers] = useState<User[] | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const { currentUser } = useAuthContext();

  const [data, setData] = useState<AppointmentData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getData = async () => {
    const users = await fetchUsers();
    setUsers(users);
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async (values: any) => {
    setIsFormSubmitting(true);

    try {
      const body: CreateCustomerAppointmentBody = {
        createScheduleDto: {
          customerId: customerId,
        },
        createTaskDto: data.map((s) => ({
          code: generateCode("LH", new Date(), Date.now().valueOf()),
          description: s.content,
          date: s.date,
          label: s.label,
          userInChargeId:
            currentUser?.role != "admin"
              ? (currentUser as any).sub
              : values.userInChargeId,
        })),
      };

      const result = await createAppointmentForCustomer(body);
      if (result.statusCode) {
        message.error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        message.success("Tạo lịch hẹn thành công");
        form.resetFields();
        setData([]);
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const onDeleteItem = (record: AppointmentData) => {
    setData((pre) => {
      return pre.filter((order) => order.code !== record.code);
    });
    message.success("Đã xóa lịch hẹn thành công");
  };

  const handleOk = () => {
    formModal
      .validateFields()
      .then((values) => {
        const newData: AppointmentData = {
          code: generateCode("LH", new Date(), Date.now().valueOf()),
          date: values.date,
          content: values.content,
          label: values.label,
        };
        setData([...data, newData]);
        formModal.resetFields();
        setIsModalVisible(false);
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
    {
      key: "4",
      title: "",
      render: (record) => {
        return (
          <>
            <DeleteOutlined
              onClick={() => {
                onDeleteItem(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        tasks: [{ label: "", description: "", date: null }],
      }}
    >
      {currentUser?.role === "admin" && (
        <>
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
        </>
      )}

      <Modal
        title="Thêm lịch hẹn"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Thoát
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="LHForm">
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

      <Row>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            label=" "
            labelCol={{ xs: { span: 0 }, lg: { span: 7 } }}
            colon={false}
          >
            <Space size={"middle"}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isFormSubmitting}
              >
                Tạo
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
