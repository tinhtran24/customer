"use client";
import React, { useState, useEffect } from "react";
import { Table, TableColumnsType } from "antd";
import OrderFilter from "./OrderFilter";
import moment, { Moment } from "moment";
import { fetchCustomerDashboard } from "@/app/lib/actions";
import Loading from "@/app/dashboard/loading";
import {
  Customer,
  CustomerProduct,
  CustomerProductItem,
  Pagination,
  User,
} from "@/app/lib/definitions";
import { Card, Col, Row, Statistic } from "antd";

interface DashboardStatsProps {
  totalOrders: string;
  totalValue: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalOrders,
  totalValue,
}) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card>
          <Statistic
            title="Tổng Đơn Hàng"
            value={totalOrders}
            valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Statistic
            title="Tổng Doanh Thu"
            value={totalValue}
            valueStyle={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#3f8600",
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export interface FilterValues {
  from: Date | null;
  to: Date | null;
  customerName?: string;
  sale?: string;
  source?: string;
}

const TableOrder: React.FC = () => {
  const initFilter = {
    from: null,
    to: null,
    customerName: "",
    source: "",
    sale: "",
  };
  const [data, setData] = useState<Pagination<CustomerProduct>>();

  const [filters, setFilters] = useState<FilterValues>(initFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const getData = async () => {
    setIsLoading(true);

    const data = await fetchCustomerDashboard(
      currentPage,
      pageSize,
      filters.customerName || null,
      filters.sale || null,
      filters.source || null,
      filters.from
        ? moment(filters.from).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null,
      filters.to
        ? moment(filters.to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null
    );

    setData(data);

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handleFilter = (newFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleReset = () => {
    // router.refresh();
    window.location.reload();
  };

  const toggleExpand = (key: React.Key) => {
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  const expandedRowRender = (record: CustomerProduct) => {
    const miniTableColumns: TableColumnsType<any> = [
      {
        title: "Tên sản phẩm",
        key: "productName",
        render: (_: any, s: CustomerProductItem) => s.product?.title,
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        key: "unitPrice",
        render: (s: number) => formatPrice(s),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Kho",
        dataIndex: "source",
        key: "source",
      },
    ];

    return (
      <Table
        columns={miniTableColumns}
        dataSource={record.customerProductItems}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setData(undefined);
    setIsLoading(true);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer: Customer) => customer.fullName,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (s: number) => formatPrice(s),
    },
    {
      title: "PT Giao hàng",
      dataIndex: "shipMethod",
      key: "shipMethod",
    },
    {
      title: "PT Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Người tạo",
      dataIndex: "createdUser",
      key: "createdUser",
      render: (user: User) => user.name,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div>
      <DashboardStats
        totalOrders={data?.meta.totalItems?.toString() || "_"}
        totalValue={data?.totalPrice ? formatPrice(data?.totalPrice) : "_"}
      />
      <OrderFilter
        onFilter={handleFilter}
        onSearch={getData}
        handleReset={handleReset}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={data?.data}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.meta?.totalItems || 0,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          rowKey="id"
          expandedRowKeys={expandedRowKeys}
          onExpand={(expanded, record) => toggleExpand(record.id)}
          expandable={{
            expandedRowRender,
          }}
        />
      )}
    </div>
  );
};

export default TableOrder;
