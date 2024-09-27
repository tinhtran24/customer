"use client";
import { ExportOutlined } from "@ant-design/icons";
import { Button, Flex, Space, message } from "antd";
import React, { useState } from "react";
import { getToken, getURL } from "@/app/lib/actions";
import { useAuthContext } from "../auth";
import { FilterValues } from "./order.interface";
import moment from "moment";

interface ExportButtonProp {
  filteredValue: FilterValues;
  pageSize: number;
  currentPage: number;
}
export function ExportButton({
  filteredValue,
  pageSize,
  currentPage,
}: ExportButtonProp) {
  const { currentUser } = useAuthContext();
  const [isHandling, setIsHandling] = useState(false);

  const handleExport = async () => {
    if (isHandling) return;

    message.info("Đang xử lí ...");
    setIsHandling(true);

    const cusName = filteredValue?.customerName || "";
    const sale = filteredValue?.sale || "";
    const source = filteredValue?.source || "";
    const formattedFrom = filteredValue?.from
      ? moment(filteredValue.from).format("YYYY-MM-DD")
      : "";
    const formattedTo = filteredValue?.to
      ? moment(filteredValue.to).format("YYYY-MM-DD")
      : "";
    const customerStatus = filteredValue?.status || "";

    try {
      await getFileOrderData({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        customerName: cusName,
        saleName: sale,
        source: source,
        from: formattedFrom,
        to: formattedTo,
        customerStatus: customerStatus,
      });
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setIsHandling(false);
    }
  };

  const getFileOrderData = async (queryParams: Record<string, string>) => {
    const accessToken: any = await getToken();
    const url = new URL(`${await getURL()}/customer-product/export`);

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
    a.download = "downloaded-order-file.xlsx";
    a.click();
    a.remove();
  };

  return (
    <Flex align="flex-end">
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
