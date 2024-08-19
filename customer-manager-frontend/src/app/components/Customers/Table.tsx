"use client";
import { Customer, CustomerDataType } from "@/app/lib/definitions";
import { Button, Input, Space, Table, Badge, Avatar, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Link from "next/link";
import CustomerDetailModal from "@/app/components/Customers/CustomerDetailModal";

export default function CustomerTable({
  customers,
}: {
  customers: Customer[];
}) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  //#region hook
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerDataType>({
    key: "",
    customerId: "",
    fullName: "",
    taxCode: "",
    urn: "",
    address: "",
    status: "",
    contacts: [],
  });
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    if (!customers) setIsLoading(true);
  }, [customers]);
  //#endregion

  //#region customer filter
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<CustomerDataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Tìm theo tên"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "!#ffc069",
            padding: 0,
            color: "orange !important",
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  //#endregion

  //#region column data

  type DataIndex = keyof CustomerDataType;

  const data: CustomerDataType[] = customers.map((customer: any) => ({
    key: `customer-key-${customer.id}`,
    customerId: customer.id,
    fullName: customer.fullName,
    taxCode: customer.taxCode,
    address: customer.street
      ? `${customer.street}, ${customer.ward.fullName}, ${customer.ward.district.fullName}, ${customer.ward.district.province.fullName}`
      : `${customer.ward.fullName}, ${customer.ward.district.fullName}, ${customer.ward.district.province.fullName}`,
    contacts: customer.contacts,
    urn: customer.urn,
    status: customer.status
  }));

  const arrayAddress = customers.map((customer: any) => ({
    text: customer.ward.district.province.name,
    value: customer.ward.district.province.name,
  }));

  const key = "value";
  const addressFilter = [
    ...new Map(arrayAddress.map((item) => [item[key], item])).values(),
  ];

  const arrayStatus = [{
    text: 'Khách hàng mới',
    value: 'NEW',
  },{
      text: 'Chưa nghe máy',
      value: 'NOT_RECEIVE_CALL',
  }]
  const statusFilter = [
    ...new Map(arrayStatus.map((item) => [item[key], item])).values(),
  ];

  const columns: TableColumnsType<CustomerDataType> = [
    {
      title: "Tên đầy đủ",
      dataIndex: "fullName",
      ...getColumnSearchProps("fullName"),
      render: (_: any, record: CustomerDataType) => (
        <Link href={`/dashboard/customers/${record.customerId}`}>
          {record.fullName}
        </Link>
      ),
    },
    {
      title: "Mã số thuế",
      dataIndex: "taxCode",
      ...getColumnSearchProps("taxCode"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      filters: addressFilter,
      onFilter: (value, record) =>
        record.address.indexOf(value as string) !== -1,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      filters: statusFilter,
      onFilter: (value, record) =>
          record.status.indexOf(value as string) !== -1
    },
    {
      title: "Người liên hệ",
      align: "center",
      dataIndex: "contacts",
      render: (_: any, record: CustomerDataType) => (
        <Badge
          count={record.contacts?.length ?? "0"}
          showZero
          color={record.contacts?.length > 0 ? "#52c41a" : "#faad14"}
        >
          <Avatar
            shape="square"
            style={{
              color: record.contacts?.length > 0 ? "#52c41a" : "#faad14",
              backgroundColor: "#f0f0f0",
            }}
            icon={<UserOutlined />}
          />
        </Badge>
      ),
    },
    {
      title: "Chi tiết",
      align: "center",
      render: (_: any, record: CustomerDataType) => (
        <EyeOutlined
          style={{ cursor: "pointer", color: colorPrimary, fontSize: "16px" }}
          onClick={() => {
            showCustomerDetail(record);
          }}
        />
      ),
    },
  ];

  //#endregion

  //#region show customer's detail
  const showCustomerDetail = (record: CustomerDataType) => {
    setCustomer(record);
    setIsDetailModalOpen(true);
  };
  //#endregion

  return (
    <>
      <Table
        loading={isLoading}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: "Không tìm thấy khách hàng",
          filterReset: "Xóa",
          filterConfirm: "Lọc",
        }}
        columns={columns}
        dataSource={data}
        showSorterTooltip={{ target: "sorter-icon" }}
      />

      <CustomerDetailModal
        customer={customer}
        setIsDetailModalOpen={setIsDetailModalOpen}
        isDetailModalOpen={isDetailModalOpen}
      />
    </>
  );
}
