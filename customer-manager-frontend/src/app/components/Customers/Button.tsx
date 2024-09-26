"use client";
import Link from "next/link";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Flex, Space, message } from "antd";
import React, { useState } from "react";
import { getToken, getURL } from "@/app/lib/actions";
import { Dayjs } from "dayjs";
import axios from "axios";

interface CreateCustomerProp {
  filteredValue: {
    searchText: string;
    status: string;
    date: [Dayjs | null, Dayjs | null];
  };
  pageSize: number;
  currentPage: number;
}
export function CreateCustomer({
  filteredValue,
  pageSize,
  currentPage,
}: CreateCustomerProp) {
  const [isHandling, setIsHandling] = useState(false);

  const handleExport = async () => {
    if (isHandling) return;

    message.info("Đang xử lí ...");
    setIsHandling(true);

    const [from, to] = filteredValue.date;
    const formattedFrom = from ? from.format("YYYY-MM-DD") : "";
    const formattedTo = to ? to.format("YYYY-MM-DD") : "";
    try {
      await getFileCustomerData2({
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

  const getFileCustomerData2 = async (queryParams: Record<string, string>) => {
    const accessToken: any = await getToken();
    const url = new URL(`${await getURL()}/customers/export`);

    Object.keys(queryParams).forEach((key) => {
      url.searchParams.append(key, queryParams[key]);
    });

    // const response = await axios.get(url.toString(), {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${accessToken?.value}`,
    //   },
    //   responseType: "blob",
    // });

    // const blob = new Blob([response.data], {
    //   type: response.headers["content-type"],
    // });

    // const link = document.createElement("a");
    // const url2 = window.URL.createObjectURL(blob);

    // const contentDisposition = response.headers["content-disposition"];
    // const filename = contentDisposition
    //   ? contentDisposition.split("filename=")[1].replace(/"/g, "")
    //   : "downloaded-file.csv";

    // link.href = url2;
    // link.download = filename;

    // document.body.appendChild(link);
    // link.click();

    // document.body.removeChild(link);
    // window.URL.revokeObjectURL(url2);

    //
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

  return (
    <Flex align="flex-end">
      <Space size={"middle"}>
        <Button type="primary">
          <Link href="/dashboard/customers/create">
            <span style={{ marginRight: 10 }}>Tạo mới</span> <PlusOutlined />
          </Link>
        </Button>
      </Space>

      <Space size={"middle"} style={{ marginLeft: 12 }}>
        <Button type="primary" danger onClick={handleExport}>
          <span style={{ marginRight: 10 }}>Export</span> <ExportOutlined />
        </Button>
      </Space>
    </Flex>
  );
}
