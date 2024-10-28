"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Space } from "antd";
import React, { useState } from "react";
import { ProductWarehouseModal } from "@/app/components/Warehourse/ProductWarehouseModal";

export function CreateProductWarehouse() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <Flex align="flex-end">
        <Space size={"middle"}>
          <Button type="primary" onClick={() => setShowCreate(true)}>
            <span style={{ marginRight: 10 }}>Nhập kho</span>
            <PlusOutlined />
          </Button>
        </Space>
      </Flex>
      <ProductWarehouseModal
        visible={showCreate}
        onClose={() => {
          setShowCreate(false);
        }}
      />
    </>
  );
}
