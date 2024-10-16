"use client";
import Loading from "@/app/dashboard/loading";
import { fetchAllTask } from "@/app/lib/actions";
import { Customer, SETTINGS_TYPE, Task } from "@/app/lib/definitions";
import { DatePicker, Button, Row, Col, Table, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ModalEdit } from "./ModalEdit";
import Link from "next/link";
import { SettingSelect } from "../Common/Select";
const { RangePicker } = DatePicker;

const initFilter = {
  from: null as Dayjs | null,
  to: null as Dayjs | null,
  status: "",
};

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>();
  const [isLoading, setLoading] = useState(false);
  const [filtersValue, setFiltersValue] = useState(initFilter);

  const getData = async (from?: string, to?: string, status?: string) => {
    setLoading(true);
    const data = await fetchAllTask({ from, to, status });
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleResetAll = () => {
    setFiltersValue({ from: null, to: null, status: "" });
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

  const onSearch = () => {
    getData(
      filtersValue.from
        ? dayjs(filtersValue.from).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : "",
      filtersValue.to
        ? dayjs(filtersValue.to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : "",
      filtersValue.status
    );
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
      title: "Chi tiết",
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
        <Col span={6} style={{ paddingLeft: "0" }}>
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
        <Col span={6}>
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
          dataSource={tasks}
          columns={columns}
          rowKey={(record) => record.id}
        />
      )}
    </>
  );
}
