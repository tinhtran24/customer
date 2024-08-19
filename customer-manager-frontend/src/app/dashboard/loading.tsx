import { Spin } from "antd";

export default function Loading() {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;
  return (
    <Spin tip="Đang tải dữ liệu..." size="large">
      {content}
    </Spin>
  );
}
