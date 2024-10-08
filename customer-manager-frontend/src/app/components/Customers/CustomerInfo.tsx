"use client";
import React from "react";
import { Customer } from "@/app/lib/definitions";
import { Collapse, Tag } from "antd";
import { UpdateButtonDetail } from "./UpdateButtonDetail";

const { Panel } = Collapse;

export function CustomersInfo({
  customer,
  provinces,
}: {
  customer: Customer;
  provinces: any[];
}) {
  const styles = {
    parent: {
      marginTop: "1rem",
      border: "1px solid lightGray",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      fontWeight: "500",
    } as React.CSSProperties,
    space: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "500",
    } as React.CSSProperties,
  };

  interface ItemProps {
    title: string;
    value: string;
  }
  const Item = ({ title, value }: ItemProps) => {
    return (
      <div style={styles.space}>
        <div>{title}</div>
        <div>{value}</div>
      </div>
    );
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const getPhoneNumber = (contacts: any) => {
    try {
      const parsedContacts = contacts.map((contact: any) => {
        const correctedJson = contact.replace(/(\w+):/g, '"$1":');
        return JSON.parse(correctedJson);
      });

      return parsedContacts?.map(
        (contact: { name: string; phone: string }, index: number) => (
          <Tag color="blue" key={index} style={{ marginTop: "5px" }}>
            {contact.phone}
          </Tag>
        )
      );
    } catch (error) {
      console.error("Error parsing contacts:", error);
      return null;
    }
  };

  return (
    <div>
      <div
        style={{
          margin: "10px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ margin: 0 }}>Thông tin khách hàng</h3>
        <UpdateButtonDetail customer={customer} provinces={provinces} />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <Collapse defaultActiveKey={["1"]} style={{ fontSize: "16px" }}>
          <Panel
            header={
              <h4 style={{ margin: "0", fontSize: "15px" }}>Thông tin chính</h4>
            }
            key="1"
          >
            <div>
              <span style={{ fontWeight: "600" }}>Mã KH:</span> {customer.code}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Họ và tên:</span>{" "}
              <span style={{ fontWeight: "700", color: "purple" }}>
                {customer.fullName}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Điện thoại:</span>{" "}
              {customer.phoneNumber}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Địa chỉ:</span> {customer.street}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Giới tính:</span>{" "}
              {customer.gender ? customer.gender : "_"}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Nhóm khách hàng:</span>{" "}
              {customer.group}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Trạng thái:</span>{" "}
              <span style={{ color: "green" }}>{customer.status}</span>
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Ghi chú:</span>{" "}
              <span>{customer.note ? customer.note : "_"}</span>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div style={styles.parent}>
        <Item title="Nguồn" value={customer.source} />
        <Item title="Người phụ trách" value={customer.userInCharge.name} />
        <Item title="Ngày tạo" value={formatDate(customer.createdAt)} />
        <Item title="Lần sửa gần nhất" value={formatDate(customer.updatedAt)} />
      </div>
    </div>
  );
}
