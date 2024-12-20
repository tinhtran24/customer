"use client";
import { ExportOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Modal, Space, message } from "antd";
import React, { useState } from "react";
import {
  getToken,
  getURL,
  updateCustomerProductStatus,
} from "@/app/lib/actions";
import { useAuthContext } from "../auth";
import { FilterValues } from "./order.interface";
import moment from "moment";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE } from "@/app/lib/definitions";
import { isNull } from "@antv/util";

interface ExportButtonProp {
  filteredValue: FilterValues;
  pageSize: number;
  currentPage: number;
  orderIds: string[];
}
export function ExportButton({
  filteredValue,
  pageSize,
  currentPage,
  orderIds,
}: ExportButtonProp) {
  const [formModal] = Form.useForm();

  const { currentUser } = useAuthContext();
  const [isHandling, setIsHandling] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleExport = async () => {
    if (isHandling) return;

    message.info("Đang xử lí ...");
    setIsHandling(true);

    const cusName = filteredValue?.customerName || null;
    const sale = filteredValue?.sale || null;
    const source = filteredValue?.source || null;
    const formattedFrom = filteredValue?.from
      ? moment(filteredValue.from).format("YYYY-MM-DD")
      : null;
    const formattedTo = filteredValue?.to
      ? moment(filteredValue.to).format("YYYY-MM-DD")
      : null;
    const status = filteredValue?.status || null;
    const customerStatus = filteredValue?.customerStatus || null;

    try {
      await getFileOrderData({
        customerName: cusName,
        saleName: sale,
        source: source,
        from: formattedFrom,
        to: formattedTo,
        customerStatus: customerStatus,
        status: status,
        ids: (orderIds.length > 0 && orderIds[0] !== '') ? `${orderIds.join(",")}` : null,
      });
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setIsHandling(false);
    }
  };

  const getFileOrderData = async (queryParams: Record<string, any>) => {
    const accessToken: any = await getToken();
    const url = new URL(`${await getURL()}/customer-product/export`);

    Object.keys(queryParams).forEach((key) => {
      if (!isNull(queryParams[key])) {
        url.searchParams.append(key, queryParams[key]);
      }
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
    a.download = "downloaded-order-file.xlsx";
    a.click();
    a.remove();
  };

  const handleChangeStatus = async () => {
    formModal.validateFields().then(async (values) => {
      console.log({
        ids: orderIds,
        status: values.status,
      })
      try {
        const result = await updateCustomerProductStatus({
          ids: orderIds,
          status: values.status,
        });
        if (result.statusCode === 500) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          message.success("Cập nhật trạng thái đơn hàng thành công");
          formModal.resetFields();
          setIsModalVisible(false);
          window.location.reload();
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error("Đã có lỗi xảy ra.");
        setIsModalVisible(false);
      }
    });
  };

  return (
    <Flex align="flex-end">
      {currentUser?.role === "admin" && (
        <>
          {orderIds?.length > 0 && (
            <>
              <Space size={"middle"} style={{ marginLeft: 12 }}>
                <Button
                  type="primary"
                  onClick={() => setIsModalVisible(true)}
                  style={{ backgroundColor: "green", borderColor: "green" }}
                >
                  <span style={{ marginRight: 10 }}>
                    Thay đổi trạng thái đơn hàng
                  </span>{" "}
                  <InfoCircleOutlined />
                </Button>
              </Space>

              <Modal
                title="Thay đối trạng thái đơn hàng"
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
                <Form
                  form={formModal}
                  layout="vertical"
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
                      type={SETTINGS_TYPE.ORDER_STATUS}
                      placeholder="- Chọn -"
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}
          <Space size={"middle"} style={{ marginLeft: 12 }}>
            <Button type="primary" danger onClick={handleExport}>
              <span style={{ marginRight: 10 }}>Export</span> <ExportOutlined />
            </Button>
          </Space>
        </>
      )}
    </Flex>
  );
}
