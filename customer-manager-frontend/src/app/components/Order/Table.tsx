"use client";
import React, { useState, useEffect } from "react";
import { Table, TableColumnsType, Modal, message, Space } from "antd";
import OrderFilter from "./OrderFilter";
import moment from "moment";
import {
  deleteOrder,
  deleteSetting,
  fetchAllProducts,
  fetchCustomerDashboard,
  fetchCustomerStatus,
} from "@/app/lib/actions";
import Loading from "@/app/dashboard/loading";
import {
  Customer,
  CustomerProduct,
  CustomerProductItem,
  Pagination,
  Product, Setting,
  User,
} from "@/app/lib/definitions";
import { Card, Col, Row, Statistic } from "antd";
import { LabelFilterOrder } from "./LabelFilter";
import { FilterValues, ParamsReset } from "./order.interface";
import { StatusFilter } from "../Customers/StatusFilter";
import { ModalEdit } from "./ModalEdit";
import { MdDeleteOutline } from "react-icons/md";
import { useAuthContext } from "../auth";

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

export const initFilterOrder = {
  from: null,
  to: null,
  customerName: null,
  source: null,
  sale: null,
  orderStatus: null
};

interface TableOrderProps {
  filteredValues: FilterValues;
  setFilteredValues: any;
  pageSize: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  orderIds: { page: number; ids: string[] }[];
  setOrderIds: any;
}
const TableOrder: React.FC<TableOrderProps> = ({
  filteredValues,
  setFilteredValues,
  pageSize,
  currentPage,
  setCurrentPage,
  orderIds,
  setOrderIds,
}) => {
  const [data, setData] = useState<Pagination<CustomerProduct>>();
  const [filters, setFilters] = useState<FilterValues>(initFilterOrder);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.role === "admin";

  const handleDelete = async (id: string) => {
    message.info("Đang xóa ...");
    try {
      const results = await deleteOrder(id);
      if (results.id) {
        message.success("Đã xóa thông tin thành công");
        window.location.reload();
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
  };

  const showDeleteConfirm = (s: CustomerProduct) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa thông tin này?",
      content: `${s.code}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        handleDelete(s.id);
      },
    });
  };

  //checkbox to change status
  const rowSelection = {
    selectedRowKeys: orderIds.map((order) => order.ids).flat(),
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setOrderIds((prev: any) => {
        const existingPage = prev.find(
          (order: any) => order.page === currentPage
        );
  
        if (existingPage) {
          return prev.map((order: any) =>
            order.page === currentPage
              ? { ...order, ids: newSelectedRowKeys }
              : order
          );
        } else {
          return [...prev, { page: currentPage, ids: newSelectedRowKeys }];
        }
      });
    },
  };

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
      : statusFilter || filters.customerStatus;

    const status = params?.isOrderStatusNull
      ? null
      : statusFilter || filters.status;

    setFilters({
      customerName: cusName,
      sale: sale,
      source: source,
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
      customerStatus: customerStatus,
      status: status,
    });
    setFilteredValues({
      customerName: cusName,
      sale: sale,
      source: source,
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
      customerStatus: customerStatus,
      status: status,
    });

    const data = await fetchCustomerDashboard(
      currentPage,
      pageSize,
      cusName || null,
      sale || null,
      source || null,
      from,
      to,
      customerStatus || null,
        status || null
    );
    if (data.statusCode == 500) {
      message.error(
        Array.isArray(data.message) ? data.message[0] : data.message
      );
    } else {
      setData(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  //#region get data for modal faster and get customer status =)))
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tương tác ",
      key: "edit",
      render: (s: any) => (
          <Space size="middle">
            <ModalEdit
                customerProduct={s}
                stateUtil={stateUtil}
                refetch={() => {
                  getData();
                }}
            />
            {isAdmin && (
              <MdDeleteOutline
                onClick={() => showDeleteConfirm(s)}
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
            />
            )}
          
          </Space>
      ),
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
      {/* <StatusFilter
        handleFilter={(status: string) => {
          if (isLoading) return;

          setCurrentPage(1);
          if (!status) getData({ isCustomerStatusNull: true });
          else getData(undefined, status);
        }}
        status={customerStatus}
        isLoading={isLoadingStatus}
      /> */}
      {!isLoading && (
        <LabelFilterOrder
          filteredValue={filteredValues}
          handleFilterReset={handleFilterReset}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          rowSelection={rowSelection}
          rowKey={(record) => record.id}
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
