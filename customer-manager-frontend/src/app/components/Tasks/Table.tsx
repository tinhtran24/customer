"use client";
import Loading from "@/app/dashboard/loading";
import { fetchAllTask } from "@/app/lib/actions";
import {
  Customer,
  Pagination,
  SETTINGS_TYPE,
  Task,
} from "@/app/lib/definitions";
import { DatePicker, Button, Row, Col, Table, Space, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ModalEdit } from "./ModalEdit";
import Link from "next/link";
import { SettingSelect } from "../Common/Select";
import { UserSelect } from "../Common/UserSelect";
const { RangePicker } = DatePicker;

const initFilter = {
  from: null as Dayjs | null,
  to: null as Dayjs | null,
  status: "",
  customerName: "",
  userIncharge: "",
};

export default function TaskTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tasks, setTasks] = useState<Pagination<Task>>();
  const [isLoading, setLoading] = useState(false);
  const [filtersValue, setFiltersValue] = useState(initFilter);

  const getData = async (
    from?: string,
    to?: string,
    status?: string,
    customerName?: string,
    userInChargeId?: string,
  ) => {
    setLoading(true);
    const data = await fetchAllTask({
      from,
      to,
      status,
      customerName,
      page: currentPage,
      pageSize,
      userInChargeId,
    });
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    getData(
      filtersValue.from
        ? dayjs(filtersValue.from).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : "",
      filtersValue.to
        ? dayjs(filtersValue.to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : "",
      filtersValue.status,
      filtersValue.customerName,
      filtersValue.userIncharge,
    );
  }, [currentPage, pageSize]);

  const handleResetAll = () => {
    setFiltersValue(initFilter);
    getData();
  };

  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates) {
      setFiltersValue((prevState) => ({
        ...prevState,
        from: dates[0],
        to: dates[1],
      }));
    } else {
      setFiltersValue((prevState) => ({
        ...prevState,
        from: null,
        to: null,
      }));
    }
  };

  const handleChangeStatus = (status: string) => {
    setFiltersValue((prevState) => ({
      ...prevState,
      status: status,
    }));
  };

  const handleChangeUserInCharge = (userIncharge: string) => {
    setFiltersValue((prevState) => ({
      ...prevState,
      userIncharge: userIncharge,
    }));
  };

  const onSearch = () => {
    getData(
      filtersValue.from
        ? dayjs(filtersValue.from).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : "",
      filtersValue.to
        ? dayjs(filtersValue.to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : "",
      filtersValue.status,
      filtersValue.customerName,
      filtersValue.userIncharge,
    );
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    setTasks(undefined);
    setLoading(true);
  };

  const columns: ColumnsType<Task> = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => (
        <div style={{ textAlign: "center" }}>{index + 1}</div>
      ),
    },
    {
      title: "Mã số",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Mã KH",
      dataIndex: ["appoinment", "customer", "code"],
      key: "customerCode",
    },
    {
      title: "Tên KH",
      dataIndex: ["appoinment", "customer"],
      key: "CustomerFullname",
      render: (customer: Customer) => (
        <Link href={`/dashboard/customers/${customer.id}`}>
          {customer.fullName}
        </Link>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày hẹn",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Người phụ trách",
      dataIndex: ["userInCharge", "name"],
      key: "userInCharge",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tương tác",
      key: "action",
      render: (task) => (
        <Space size="middle">
          <ModalEdit
            task={task}
            refetch={() => {
              getData();
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ margin: "1rem 0 2rem 0" }}>
        <Col span={5} style={{ paddingLeft: "0" }}>
          <RangePicker
            onChange={handleDateChange}
            style={{ width: "100%" }}
            value={
              filtersValue.from && filtersValue.to
                ? ([filtersValue.from, filtersValue.to] as [Dayjs, Dayjs])
                : undefined
            }
          />
        </Col>
        <Col span={5}>
          <SettingSelect
            type={SETTINGS_TYPE.TASK_STATUS}
            style={{ width: "100%" }}
            placeholder="- Chọn trạng thái công việc-"
            onChange={handleChangeStatus}
            value={filtersValue.status || null}
            allowClear
            onClear={() => handleChangeStatus("")}
          />
        </Col>
        <Col span={5}>
          <Input
            placeholder="Tên khách hàng"
            allowClear
            size="large"
            onChange={(e) => {
              setFiltersValue((prevState) => ({
                ...prevState,
                customerName: e.target.value,
              }));
            }}
            style={{ height: "33px", fontSize: 14 }}
          />
        </Col>
        <Col span={5}>
          <UserSelect
            style={{ width: "100%" }}
            placeholder="- Chọn nhân viên -"
            onChange={handleChangeUserInCharge}
            value={filtersValue.userIncharge || null}
            allowClear
            onClear={() => handleChangeUserInCharge("")}
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={onSearch}>
            Lọc
          </Button>
          <Button
            type="primary"
            onClick={() => handleResetAll()}
            style={{
              marginLeft: "10px",
              background: "white",
              border: "1px solid blue",
              color: "blue",
            }}
          >
            Bỏ lọc
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          dataSource={tasks?.items}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: tasks?.meta?.totalItems || 0,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      )}
    </>
  );
}
