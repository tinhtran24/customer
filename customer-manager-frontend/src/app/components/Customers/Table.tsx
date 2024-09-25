"use client";
import { Customer, Pagination } from "@/app/lib/definitions";
import {
  Table,
  theme,
  Modal,
  message,
  Menu,
  Dropdown,
  Button,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { TableColumnsType } from "antd";
import Link from "next/link";
import { MdDeleteOutline } from "react-icons/md";
import SearchCustomers from "./Search";
import {
  deleteCustomer,
  fetchCustomers,
  fetchCustomerStatus,
} from "@/app/lib/actions";
import Loading from "@/app/dashboard/loading";
import { FiEdit3 } from "react-icons/fi";
import { DownOutlined } from "@ant-design/icons";
import { useAuthContext } from "../auth";
import { LabelFilter } from "./LabelFilter";
import { FilterCustomer } from "./customer.interface";
import { StatusFilter } from "./StatusFilter";
import { Dayjs } from "dayjs";

export default function CustomerTable() {
  //#region hook
  const [data, setData] = useState<Pagination<Customer>>();
  console.log("🚀 ~ CustomerTable ~ data:", data?.data?.length)

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [filteredValue, setFilteredValue] = useState({
    searchText: "",
    status: "",
    date: [null, null] as [Dayjs | null, Dayjs | null],
  });

  const { currentUser } = useAuthContext();

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const getData = async (params?: FilterCustomer, statusFilter?: string) => {
    setIsLoading(true);

    const q = params?.isKwNull ? "" : searchText?.trim();
    const s = params?.isStatusNull ? "" : statusFilter || status;
    const from = params?.isDateNull || !date[0] ? null : date[0];
    const to = params?.isDateNull || !date[1] ? null : date[1];

    setSearchText(q);
    setStatus(s);
    setDate([from, to]);

    setData(
      await fetchCustomers({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        q: q,
        status: s,
        from: from ? from.format("YYYY-MM-DD") : "",
        to: to ? to.format("YYYY-MM-DD") : "",
      })
    );

    setFilteredValue({
      searchText: q,
      status: s,
      date: [from, to],
    });

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    if (!data) setIsLoading(true);
    else setIsLoading(false);
  }, [currentPage]);

  //#region get customer status to filter
  const [customerStatus, setCustomerStatus] = useState<
    { key: string; value: string }[]
  >([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const getCustomerStatus = async () => {
    setIsLoadingStatus(true);
    setCustomerStatus(await fetchCustomerStatus());
    setIsLoadingStatus(false);
  };

  useEffect(() => {
    getCustomerStatus();
  }, []);

  //#endregion

  const handleResetFiltersAll = () => {
    setCurrentPage(1);
    getData({ isKwNull: true, isStatusNull: true });
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setData(undefined);
    setIsLoading(true);
  };

  const handleDelete = async (id: string) => {
    message.info("Đang xóa ...");
    try {
      const results = await deleteCustomer(id);
      if (results.id) {
        message.success("Đã xóa khách hàng thành công");
        if (currentPage !== 1) setCurrentPage(1);
        else getData();
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
  };

  const showDeleteConfirm = (customer: Customer) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa khách hàng này?",
      content: `${customer.code} - ${customer.fullName} - ${customer.status}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        handleDelete(customer.id);
      },
    });
  };

  const handleFilterReset = (params: FilterCustomer) => {
    setCurrentPage(1);
    getData(params);
  };

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDate(dates || [null, null]);
  };

  const menu = (customer: any) => (
    <Menu>
      <Menu.Item key="edit" style={{ color: "green" }}>
        <a href={`/dashboard/customers/${customer.id}/update`}>
          <FiEdit3 style={{ marginRight: 8 }} />
          Sửa
        </a>
      </Menu.Item>
      <Menu.Item
        key="delete"
        style={{ color: "red" }}
        onClick={() => showDeleteConfirm(customer)}
      >
        <MdDeleteOutline style={{ marginRight: 8 }} />
        Xóa
      </Menu.Item>
    </Menu>
  );

  const columns: TableColumnsType<Customer> = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: Customer, index: number) => (
        <div style={{ textAlign: "center" }}>
          {index + 1 + (currentPage - 1) * pageSize}
        </div>
      ),
    },
    {
      title: "Mã KH",
      dataIndex: "code",
    },
    {
      title: "Tên KH",
      dataIndex: "fullName",
      render: (_: any, record: Customer) => (
        <Link href={`/dashboard/customers/${record.id}`}>
          {record.fullName}
        </Link>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "street",
      render: (address) => {
        const shortenedAddress =
          address?.length > 15 ? `${address.slice(0, 15)}...` : address;
        return (
          <Tooltip title={address}>
            <div>{shortenedAddress}</div>
          </Tooltip>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Nhóm KH",
      dataIndex: "group",
    },
    {
      title: "Nguồn KH",
      dataIndex: "source",
    },
    {
      title: "Người phụ trách",
      dataIndex: "userInCharge",
      render: (userInCharge) => userInCharge.name,
    },
    // {
    //   title: "Liên hệ",
    //   dataIndex: "contacts",
    //   render: (contacts: any[]) => {
    //     try {
    //       const parsedContacts = contacts.map((contact) => {
    //         const correctedJson = contact.replace(/(\w+):/g, '"$1":');
    //         return JSON.parse(correctedJson);
    //       });

    //       return parsedContacts.map(
    //         (contact: { name: string; phone: string }, index: number) => (
    //           <div>
    //             <Tag
    //               color="blue"
    //               key={index}
    //               style={{
    //                 marginTop: "5px",
    //                 width: "160px",
    //                 textAlign: "center",
    //                 WebkitLineClamp: 1,
    //                 WebkitBoxOrient: "vertical",
    //                 overflow: "hidden",
    //                 display: "-webkit-box",
    //                 textOverflow: "ellipsis",
    //                 whiteSpace: "nowrap",
    //               }}
    //             >
    //               {contact?.name?.length > 6
    //                 ? contact.name.substring(0, 6) + "..."
    //                 : contact.name}{" "}
    //               - {contact.phone}
    //             </Tag>
    //           </div>
    //         )
    //       );
    //     } catch (error) {
    //       console.error("Error parsing contacts:", error);
    //       return null;
    //     }
    //   },
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d: string) => {
        const date = new Date(d);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "center" }}>{formattedDate}</div>;
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (d: string) => {
        const date = new Date(d);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "center" }}>{formattedDate}</div>;
      },
    },
    {
      title: "",
      width: "5%",
      render: (customer) =>
        currentUser?.role === "admin" ? (
          <Dropdown overlay={menu(customer)} trigger={["click"]}>
            <Button>
              <DownOutlined />
            </Button>
          </Dropdown>
        ) : (
          <a href={`/dashboard/customers/${customer.id}/update`}>
            <FiEdit3
              size={20}
              style={{
                color: "green",
                cursor: "pointer",
              }}
            />
          </a>
        ),
    },
  ];

  return (
    <>
      <SearchCustomers
        text={searchText}
        date={date}
        handleDateChange={handleDateChange}
        onChangeText={setSearchText}
        onChangeStatus={setStatus}
        handleFilter={() => {
          setCurrentPage(1);
          getData();
        }}
        status={status}
        handleResetFiltersAll={handleResetFiltersAll}
        handleFilterReset={handleFilterReset}
      />
      <StatusFilter
        handleFilter={(status: string) => {
          if (isLoading) return;

          setCurrentPage(1);
          if (!status) getData({ isStatusNull: true });
          else getData(undefined, status);
        }}
        status={customerStatus}
        isLoading={isLoadingStatus}
      />
      {!isLoading && (
        <LabelFilter
          filteredValue={filteredValue}
          handleFilterReset={handleFilterReset}
        />
      )}
      {isLoading || !data ? (
        <Loading />
      ) : (
        <Table
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.meta?.totalItems || 0,
            showSizeChanger: false,
          }}
          locale={{
            emptyText: "Không tìm thấy khách hàng",
          }}
          columns={columns}
          dataSource={data?.items || []}
          onChange={handleTableChange}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      )}
    </>
  );
}
