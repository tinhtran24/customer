import { Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const defaultStyle: React.CSSProperties = {
  backgroundColor: "#f2f4ff",
  color: "#000000",
  borderRadius: "4px",
  marginBottom: "8px",
  padding: "5px 10px",
  border: "1px solid #1890ff",
  boxShadow: "0 4px 8px rgba(24, 144, 255, 0.3)",
};

interface ReusableTagProps {
  label: string;
  onClose: () => void;
  style?: React.CSSProperties;
}
const ReusableTag = ({ label, onClose, style }: ReusableTagProps) => {
  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <Tag
      closable
      onClose={onClose}
      closeIcon={<CloseOutlined />}
      style={combinedStyle}
    >
      {label}
    </Tag>
  );
};

export default ReusableTag;
