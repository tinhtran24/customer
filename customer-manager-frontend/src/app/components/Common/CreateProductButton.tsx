"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Space } from "antd";
import React, { useState } from "react";
import { AddModal } from "./CreateModal";
import { SETTINGS_TYPE } from "@/app/lib/definitions";

interface CreateButtonProps {
  type: SETTINGS_TYPE;
}
export function CreateButton({ type }: CreateButtonProps) {
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
      <AddModal
        visible={showCreate}
        onClose={() => {
          setShowCreate(false);
        }}
        type={type}
      />
    </>
  );
}
