"use client";
import Loading from "@/app/dashboard/loading";
import { fetchAllTask } from "@/app/lib/actions";
import { Task } from "@/app/lib/definitions";
import { DatePicker, Button, Row, Col, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
const { RangePicker } = DatePicker;

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
    dataIndex: ["appoinment", "customer", "fullName"],
    key: "CustomerFullname",
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
    render: (date: string) =>  dayjs(date).format('DD/MM/YYYY HH:ss'),
  },
  {
    title: "Người phụ trách",
    dataIndex: ["userInCharge", "name"],
    key: "userInCharge",
  },
];

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>();
  const [isLoading, setLoading] = useState(false);
  const [filtersValue, setFiltersValue] = useState({
    from: null as Dayjs | null,
    to: null as Dayjs | null,
  });

  const getData = async (from?: string, to?: string) => {
    setLoading(true);
    const data = await fetchAllTask({ from, to });
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleResetAll = () => {
    setFiltersValue({ from: null, to: null });
    getData();
  };

  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates) {
      setFiltersValue({
        from: dates[0],
        to: dates[1],
      });
    } else {
      setFiltersValue({
        from: null,
        to: null,
      });
    }
  };

  const onSearch = () => {
    if (filtersValue.from && filtersValue.to) {
      getData(
        dayjs(filtersValue.from).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        dayjs(filtersValue.to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
      );
    } else {
      getData();
    }
  };

  if (isLoading) return <Loading />;

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
      <Table
        dataSource={tasks}
        columns={columns}
        rowKey={(record) => record.id}
      />
    </>
  );
}
