"use client";
import React, { useState, useEffect } from "react";
import { Table, TableColumnsType, Modal } from "antd";
import OrderFilter from "./OrderFilter";
import moment from "moment";
import {
  fetchAllProducts,
  fetchCustomerDashboard,
} from "@/app/lib/actions";
import Loading from "@/app/dashboard/loading";
import {
  Customer,
  CustomerProduct,
  CustomerProductItem,
  Pagination,
  Product,
  User,
} from "@/app/lib/definitions";
import { Card, Col, Row, Statistic } from "antd";
import { LabelFilterOrder } from "./LabelFilter";
import { FilterValues, ParamsReset } from "./order.interface";
import { StatusFilter } from "../Customers/StatusFilter";
import { ModalEdit } from "./ModalEdit";

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

const TableOrder: React.FC = () => {
  const initFilter = {
    from: null,
    to: null,
    customerName: null,
    source: null,
    sale: null,
  };
  const [data, setData] = useState<Pagination<CustomerProduct>>();

  const [filters, setFilters] = useState<FilterValues>(initFilter);
  const [filteredValues, setFilteredValues] =
    useState<FilterValues>(initFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const getData = async (params?: ParamsReset, statusFilter?: string) => {
    setIsLoading(true);

    const cusName = params?.isCustomerNameNull
      ? null
      : filters.customerName?.trim();
    const sale = params?.isSaleNull ? null : filters.sale;
    const source = params?.isSourceNull ? null : filters.source;
    const from =
      params?.isDateNull !== true && filters.from
        ? moment(filters.from).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null;
    const to =
      params?.isDateNull !== true && filters.to
        ? moment(filters.to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null;
    const customerStatus = params?.isCustomerStatusNull
      ? null
      : statusFilter || filters.status;

    setFilters({
      customerName: cusName,
      sale: sale,
      source: source,
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
      status: customerStatus,
    });
    setFilteredValues({
      customerName: cusName,
      sale: sale,
      source: source,
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
      status: customerStatus,
    });

    const data = await fetchCustomerDashboard(
      currentPage,
      pageSize,
      cusName || null,
      sale || null,
      source || null,
      from,
      to,
      customerStatus || null
    );
    setData(data);

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  //#region get data for modal faster
  const [stateUtil, setStateUtil] = useState<{
    products: Product[];
    provinces: any[];
  }>({
    products: [],
    provinces: [],
  });

  const getProductsAndProvinces = async () => {
    const [products] = await Promise.all([
      fetchAllProducts(),
    ]);
    setStateUtil((prevState) => ({
      ...prevState,
      products: products,
    }));
  };

  useEffect(() => {
    getProductsAndProvinces();
  }, []);
  //#endregion

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

  const handleFilterReset = (params: ParamsReset) => {
    setCurrentPage(1);
    getData(params);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => (
        <div style={{ textAlign: "center" }}>
          {index + 1 + (currentPage - 1) * pageSize}
        </div>
      ),
    },
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
    {
      title: "",
      key: "edit",
      render: (s: any) => <ModalEdit customerProduct={s} stateUtil={stateUtil} refetch={() => {getData()}}/>,
    },
  ];

  return (
    <div>
      <DashboardStats
        totalOrders={data?.meta?.totalItems?.toString() || "_"}
        totalValue={data?.totalPrice ? formatPrice(data?.totalPrice) : "_"}
      />
      <OrderFilter
        filtersValue={filters}
        onFilter={handleFilter}
        onSearch={getData}
        handleResetAll={handleReset}
        handleFilterReset={handleFilterReset}
      />
      {!isLoading && (
        <>
          <StatusFilter
            handleFilter={(status: string) => {
              setCurrentPage(1);
              if (!status) getData({ isCustomerStatusNull: true });
              else getData(undefined, status);
            }}
          />
          <LabelFilterOrder
            filteredValue={filteredValues}
            handleFilterReset={handleFilterReset}
          />
        </>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          style={{ marginTop: "1rem" }}
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
