"use client";
import { createAppointmentForCustomer, fetchUsers } from "@/app/lib/actions";
import { CreateCustomerAppointmentBody, User } from "@/app/lib/definitions";
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
} from "antd";
import { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuthContext } from "../auth";
import { generateCode } from "@/app/utils/generateString";

const { Option } = Select;

interface CreateCustomerAppointmentProps {
  customerId: string;
}

export function CreateCustomerAppointment({
  customerId,
}: CreateCustomerAppointmentProps) {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[] | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { currentUser } = useAuthContext();

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
          customerId: customerId
        },
        createTaskDto: values.tasks.map((task: any) => ({
          code: generateCode("DH", new Date(), Date.now().valueOf()),
          description: task.description,
          date: task.date.format("YYYY-MM-DD"),
          label: task.label,
          userInChargeId: (currentUser as any).sub,
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
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        tasks: [{ label: "", description: "", date: null }],
      }}
    >
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

      <Form.List name="tasks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "label"]}
                  label="Tiêu đề"
                  rules={[{ required: true, message: "Vui lòng thêm tiêu đề" }]}
                >
                  <Input placeholder="Tiêu đề ..." />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "description"]}
                  label="Chi tiết"
                  rules={[{ required: true, message: "Vui lòng thêm mô tả" }]}
                >
                  <Input placeholder="Mô tả ..." />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "date"]}
                  label="Ngày hẹn"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày hẹn" },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày và giờ ..."
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "20px",
                      }}
                    />
                  )}
                </div>
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm tiêu đề, mô tả, và ngày
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

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
