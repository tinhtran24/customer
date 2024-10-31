"use client";
import Loading from "@/app/dashboard/loading";
import {
  fetchWareHouse,
} from "@/app/lib/actions";
import {
  ProductWarehouseLog,
  ProductWarehouses,
} from "@/app/lib/definitions";
import {
  Table,
  TableColumnsType,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import "../Warehourse/style.css";
import dayjs from "dayjs";

// use to display
type GroupItem = {
  id: string;
  source: string;
  productWarehouseLogs: ProductWarehouseLog[];
};

export default function LogTable() {
  const [warehouse, setWarehouse] = useState<ProductWarehouses[]>();
  const [isLoading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const data = await fetchWareHouse();
    setWarehouse(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const groupedData: GroupItem[] =
  warehouse?.reduce((acc: GroupItem[], current: ProductWarehouses) => {
    const existingItemIndex = acc.findIndex(
      (item) => item.source === current.source
    );

    const logs: ProductWarehouseLog[] = current.productWarehouseLogs || []

    if (existingItemIndex >= 0) {
      acc[existingItemIndex].productWarehouseLogs.push(...logs);
    } else {
      acc.push({
        id: current.id,
        source: current.source,
        productWarehouseLogs: [...logs]
      });
    }

    return acc;
  }, []) || [];

  groupedData.forEach((group) => {
    group.productWarehouseLogs.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const expandedRowRender = (record: GroupItem) => {
    const miniTableColumns: TableColumnsType<ProductWarehouseLog> = [
      {
        title: "Ngày",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (dateStr) => dayjs(dateStr).format("DD/MM/YYYY HH:mm:ss"),
        width: "20%"
      },
      {
        title: "Tên sản phẩm",
        key: "product",
        dataIndex: "product",
        render: (s: any) => s.title,
        width: "20%"
      },
      {
        title: "Người thực hiện",
        key: "createdUser",
        dataIndex: "createdUser",
        render: (s: any) => s.name,
        width: "15%"
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        width: "15%"
      },
      {
        title: "Đơn giá",
        dataIndex: "price",
        key: "price",
        render: (s: number) => formatPrice(s),
        width: "10%"
      },
      {
        title: "Đã nhập",
        dataIndex: "quantityInStock",
        key: "quantityInStock",
        width: "10%"
      },
      {
        title: "Đã bán",
        dataIndex: "quantityInUse",
        key: "quantityInUse",
        width: "10%"
      },
    ];

    return (
      <Table
        columns={miniTableColumns}
        dataSource={record.productWarehouseLogs}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const columns: ColumnsType<GroupItem> = [
    {
      title: "",
      dataIndex: "source",
      key: "source",
      width: "100%",
    },
  ];

  if (isLoading || !groupedData) return <Loading />;

  return (
    <>
      <Table
        dataSource={groupedData}
        columns={columns}
        rowKey={(record) => record.id}
        onRow={(record, rowIndex) => {
          return {
            className: "custom-row",
          };
        }}
        expandable={{
          expandedRowRender,
        }}
      />
    </>
  );
}
