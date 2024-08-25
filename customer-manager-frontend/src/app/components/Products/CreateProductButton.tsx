"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Space } from "antd";
import React, { useState } from "react";
import { AddProductModal } from "./CreateModal";

export function CreateProduct() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <Flex align="flex-end">
        <Space size={"middle"}>
          <Button type="primary" onClick={() => setShowCreate(true)}>
            <span style={{ marginRight: 10 }}>Tạo mới</span>
            <PlusOutlined />
          </Button>
        </Space>
      </Flex>
      <AddProductModal
        visible={showCreate}
        onClose={() => {
          setShowCreate(false);
        }}
      />
    </>
  );
}
