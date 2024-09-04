"use client";
import { Modal } from "antd";
import { FiEdit3 } from "react-icons/fi";

import React, { useState } from "react";
import UpdateCustomerForm from "./UpdateForm";
import { Customer } from "@/app/lib/definitions";

const css: React.CSSProperties = {
  cursor: "pointer",
  color: "green",
};

interface UpdateButtonDetailProps {
  customer: Customer;
  provinces: any[];
}
export function UpdateButtonDetail({
  customer,
  provinces,
}: UpdateButtonDetailProps) {
  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  if (!provinces || !customer) return <></>;

  return (
    <>
      <FiEdit3 onClick={() => setVisible(true)} size={20} style={css} />
      {visible && (
        <Modal
          visible={visible}
          title="Cập nhật thông tin khách hàng"
          onCancel={onClose}
          width={"80%"}
          footer={[]}
        >
          <UpdateCustomerForm
            provinces={provinces}
            customer={customer}
            isReload
            onCancel={() => setVisible(false)}
          />
        </Modal>
      )}
    </>
  );
}
