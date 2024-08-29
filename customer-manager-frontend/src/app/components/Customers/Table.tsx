"use client";
import { Customer, Pagination } from "@/app/lib/definitions";
import {
  Tag,
  Table,
  theme,
  Modal,
  message,
  Menu,
  Dropdown,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import { TableColumnsType } from "antd";
import Link from "next/link";
import { MdDeleteOutline } from "react-icons/md";
import { Categories } from "./Categories";
import SearchCustomers from "./Search";
import { deleteCustomer, fetchCustomers } from "@/app/lib/actions";
import Loading from "@/app/dashboard/loading";
import { FiEdit3 } from "react-icons/fi";
import { DownOutlined } from "@ant-design/icons";

export default function CustomerTable() {
  //#region hook
  const [data, setData] = useState<Pagination<Customer>>();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const getData = async (p?: string) => {
    setIsLoading(true);
    setData(
      await fetchCustomers({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        q: p ? p : "",
        status: p ? "" : category,
      })
    );
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    if (!data) setIsLoading(true);
    else setIsLoading(false);
  }, [currentPage, category]);

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
    {
      title: "Liên hệ",
      dataIndex: "contacts",
      render: (contacts: any[]) => {
        try {
          const parsedContacts = contacts.map((contact) => {
            const correctedJson = contact.replace(/(\w+):/g, '"$1":');
            return JSON.parse(correctedJson);
          });

          return parsedContacts.map(
            (contact: { name: string; phone: string }, index: number) => (
              <div>
                <Tag
                  color="blue"
                  key={index}
                  style={{
                    marginTop: "5px",
                    width: "160px",
                    textAlign: "center",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    display: "-webkit-box",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {contact?.name?.length > 6
                    ? contact.name.substring(0, 6) + "..."
                    : contact.name}{" "}
                  - {contact.phone}
                </Tag>
              </div>
            )
          );
        } catch (error) {
          console.error("Error parsing contacts:", error);
          return null;
        }
      },
    },
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
      render: (customer) => (
        <Dropdown overlay={menu(customer)} trigger={["click"]}>
          <Button>
            <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <SearchCustomers
        text={searchText}
        onChange={(e: any) => {
          setSearchText(e.target.value);
          setCategory("");
        }}
        handleSearch={() => {
          if (searchText?.length > 0) {
            getData(searchText);
          }
        }}
      />
      <Categories
        setCategory={(e: string) => {
          if (e !== category) {
            setCategory(e);
            setSearchText("");
            setData(undefined);
          }
        }}
      />
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
