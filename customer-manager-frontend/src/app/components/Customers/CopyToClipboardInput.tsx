import { Input, Space, Button, message } from "antd";
import { ReactNode, useState, Fragment } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

export default function CopyToClipboardInput({
  value,
  prefixIcon,
}: {
  value: string;
  prefixIcon: ReactNode;
}) {
  const [copyIcon, setCopyIcon] = useState<ReactNode>(<CopyOutlined />);

  const handleClick = () => {
    navigator.clipboard.writeText(value);

    setTimeout(() => {
      setCopyIcon(<CheckOutlined style={{ color: "green" }} />);
    }, 200);

    setTimeout(() => {
      message.success("Đã copy");
    }, 200);

    setTimeout(() => {
      setCopyIcon(<CopyOutlined />);
    }, 2000);
  };

  return (
    <Space.Compact>
      <Input value={value} disabled prefix={prefixIcon} />
      <Button
        onClick={() => {
          handleClick();
        }}
      >
        {copyIcon}
      </Button>
    </Space.Compact>
  );
}
