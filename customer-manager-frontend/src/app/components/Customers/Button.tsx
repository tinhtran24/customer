"use client";
import Link from "next/link";
import {
  PlusOutlined,
  ExportOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Flex, Space, Modal, Form, message } from "antd";
import React, { useState } from "react";
import { getToken, getURL, updateCustomersStatus } from "@/app/lib/actions";
import { Dayjs } from "dayjs";
import { useAuthContext } from "../auth";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

interface CreateCustomerProp {
  filteredValue: {
    searchText: string;
    status: string;
    date: [Dayjs | null, Dayjs | null];
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
  const [formModal] = Form.useForm();

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
        const result = await updateCustomersStatus({
          ids: customerIds,
          status: values.status,
        });
        if (result.statusCode) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          message.success("Cập nhật trạng thái khách hàng thành công");
          // router.refresh();
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        message.error("Đã có lỗi xảy ra.");
      } finally {
        setIsModalVisible(false);
      }
    });
  };

  return (
    <Flex align="flex-end">
      {customerIds?.length > 0 && (
        <>
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
            footer={[]}
          >
            <Form
              id="productForm"
              form={formModal}
              layout="vertical"
              onFinish={handleChangeStatus}
              style={{ marginTop: 24 }}
            >
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
              <div style={{ textAlign: "right" }}>
                <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                  Hủy
                </Button>
                <Button
                  key="submit"
                  htmlType="submit"
                  type="primary"
                  style={{ marginLeft: 8 }}
                >
                  Xác nhận
                </Button>
              </div>
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
