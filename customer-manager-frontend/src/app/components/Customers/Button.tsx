"use client";
import Link from "next/link";
import {
  PlusOutlined,
  ExportOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Flex, Space, Modal, Form, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  getToken,
  getURL,
  updateCustomersStatus,
  updateUserIncharge,
} from "@/app/lib/actions";
import { Dayjs } from "dayjs";
import { useAuthContext } from "../auth";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE, User } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
const { Option } = Select;

interface CreateCustomerProp {
  filteredValue: {
    searchText: string;
    status: string;
    date: [Dayjs | null, Dayjs | null];
    userInCharge: string;
  };
  pageSize: number;
  currentPage: number;
  customerIds: string[];
}
export function CreateCustomer({
  filteredValue,
  pageSize,
  currentPage,
  customerIds,
}: CreateCustomerProp) {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const [isHandling, setIsHandling] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUserInchargeModalVisible, setUserInchargeModalVisible] =
    useState(false);
  const [users, setUSers] = useState<User[]>([]);
  const [formModal] = Form.useForm();
  const [formUserInChargeModal] = Form.useForm();

  const getUsers = async () => {
    var results = await fetchUsers();
    setUSers(results);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleExport = async () => {
    if (isHandling) return;

    message.info("Đang xử lí ...");
    setIsHandling(true);

    const [from, to] = filteredValue.date;
    const formattedFrom = from ? from.format("YYYY-MM-DD") : "";
    const formattedTo = to ? to.format("YYYY-MM-DD") : "";
    try {
      await getFileCustomerData({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        q: filteredValue.searchText,
        status: filteredValue.status,
        from: formattedFrom,
        to: formattedTo,
        userInChargeId: filteredValue.userInCharge.split("@")[0],
      });
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setIsHandling(false);
    }
  };

  const getFileCustomerData = async (queryParams: Record<string, string>) => {
    const accessToken: any = await getToken();
    const url = new URL(`${await getURL()}/customers/export`);

    Object.keys(queryParams).forEach((key) => {
      url.searchParams.append(key, queryParams[key]);
    });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "downloaded-file.xlsx";
    a.click();
    a.remove();
  };

  const handleChangeStatus = async () => {
    formModal.validateFields().then(async (values) => {
      try {
        console.log(customerIds);
        const result = await updateCustomersStatus({
          ids: customerIds,
          status: values.status,
        });
        if (result.statusCode === 500) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          message.success("Cập nhật trạng thái khách hàng thành công");
          formModal.resetFields();
          setIsModalVisible(false);
        }
        setIsModalVisible(false);
        window.location.reload();
      } catch (error) {
        message.error("Đã có lỗi xảy ra.");
        setIsModalVisible(false);
      }
    });
  };

  const handleChangeUserIncharge = async () => {
    formUserInChargeModal.validateFields().then(async (values) => {
      try {
        const result = await updateUserIncharge({
          ids: customerIds,
          userInChargeId: values.userInChargeId,
        });
        if (result.statusCode === 500) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          message.success("Cập nhật người phụ trách thành công");
          formUserInChargeModal.resetFields();
          setIsModalVisible(false);
          router.refresh();
        }
        setUserInchargeModalVisible(false);
        window.location.reload();
      } catch (error) {
        message.error("Đã có lỗi xảy ra.");
        setIsModalVisible(false);
      }
    });
  };

  return (
    <Flex align="flex-end">
      {currentUser?.role === "admin" && customerIds?.length > 0 && (
        <>
          {/* Trạng thái người phụ trách */}
          <Space size={"middle"} style={{ marginLeft: 12 }}>
            <Button
              type="primary"
              onClick={() => setUserInchargeModalVisible(true)}
              style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
            >
              <span style={{ marginRight: 10 }}>Thay đổi người phụ trách</span>
              <InfoCircleOutlined />
            </Button>
          </Space>

          <Modal
            title="Thay đối người phụ trách"
            open={isUserInchargeModalVisible}
            onCancel={() => setUserInchargeModalVisible(false)}
            footer={[
              <Button
                key="back"
                onClick={() => setUserInchargeModalVisible(false)}
              >
                Thoát
              </Button>,
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                onClick={handleChangeUserIncharge}
              >
                Cập nhật
              </Button>,
            ]}
          >
            <Form
              form={formUserInChargeModal}
              layout="vertical"
              style={{ marginTop: 24 }}
            >
              <Form.Item
                label="Người phụ trách"
                name="userInChargeId"
                rules={[
                  { required: true, message: "Vui lòng chọn người phụ trách" },
                ]}
              >
                <Select placeholder="- Chọn -" style={{ width: "100%" }}>
                  {users?.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {`${user.name} - ${user.email}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          {/* Trạng thái KH */}
          <Space size={"middle"} style={{ marginLeft: 12 }}>
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              <span style={{ marginRight: 10 }}>Thay đổi trạng thái</span>{" "}
              <InfoCircleOutlined />
            </Button>
          </Space>

          <Modal
            title="Thay đối trạng thái khách hàng"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="back" onClick={() => setIsModalVisible(false)}>
                Thoát
              </Button>,
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                onClick={handleChangeStatus}
              >
                Cập nhật
              </Button>,
            ]}
          >
            <Form form={formModal} layout="vertical" style={{ marginTop: 24 }}>
              <Form.Item
                label="Trạng thái mới"
                name="status"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <SettingSelect
                  type={SETTINGS_TYPE.STATUS}
                  placeholder="- Chọn -"
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}

      <Space size={"middle"} style={{ marginLeft: 12 }}>
        <Button type="primary">
          <Link href="/dashboard/customers/create">
            <span style={{ marginRight: 10 }}>Tạo mới</span> <PlusOutlined />
          </Link>
        </Button>
      </Space>

      {currentUser?.role === "admin" && (
        <Space size={"middle"} style={{ marginLeft: 12 }}>
          <Button type="primary" danger onClick={handleExport}>
            <span style={{ marginRight: 10 }}>Export</span> <ExportOutlined />
          </Button>
        </Space>
      )}
    </Flex>
  );
}
