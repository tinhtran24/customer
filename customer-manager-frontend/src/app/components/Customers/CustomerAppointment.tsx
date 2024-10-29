"use client";
import {
  createAppointmentForCustomer,
  fetchTaskByCustomerId,
  fetchUsers,
} from "@/app/lib/actions";
import {
  CreateCustomerAppointmentBody,
  SETTINGS_TYPE,
  Task,
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
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useAuthContext } from "../auth";
import { generateCode } from "@/app/utils/generateString";
import { SettingSelect } from "../Common/Select";
import { ModelCreate } from "@/app/components/Tasks/ModelCreate";
// import { SettingSelect } from "../Common/Select";

// const { Option } = Select;

interface CreateCustomerAppointmentProps {
  customerId: string;
}

export function CreateCustomerAppointment({
  customerId,
}: CreateCustomerAppointmentProps) {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    const tasks = await fetchTaskByCustomerId(customerId);
    setData(tasks);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: TableColumnsType<Task> = [
    {
      title: "Ngày hẹn",
      dataIndex: "date",
      key: "date",
      render: (d) => {
        const date = new Date(d);
        const formattedDate = date.toLocaleDateString("en-GB");

        return `${formattedDate}`;
      },
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
      width: "40%",
      ellipsis: true,
    },
  ];

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "5rem 0",
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <ModelCreate
          customerId={customerId}
          refetch={() => getData()}
          setIsModalVisible= {setIsModalVisible}
          isModalVisible={isModalVisible}
      />
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
