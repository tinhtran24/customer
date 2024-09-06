"use client";
import { Divider, Input, Checkbox, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ApartmentOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/app/components/auth";
import Loading from "../loading";
import { useState } from "react";

export default function CustomerPage() {
  const { currentUser } = useAuthContext();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
   // call api change pw
  };

  if (!currentUser) return <Loading />;

  return (
    <main style={{ paddingLeft: "3rem", minHeight: "100vh" }}>
      <h2 style={{ color: "#0d2f5f", marginBottom: "2rem" }}>
        Thông tin cá nhân
      </h2>
      <Divider />
      <div style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
        <UserOutlined style={{ marginRight: 10 }} />
        <span style={{ fontWeight: 500 }}>Tên:</span> {currentUser?.name}
      </div>
      <div style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
        <MailOutlined style={{ marginRight: 10 }} />
        <span style={{ fontWeight: 500 }}>Email:</span> {currentUser?.email}
      </div>
      <div style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        <ApartmentOutlined style={{ marginRight: 10 }} />
        <span style={{ fontWeight: 500 }}>Quyền:</span>
        {currentUser?.role?.charAt(0).toUpperCase() +
          currentUser?.role?.slice(1)}
      </div>

      <Divider />

      <Checkbox
        onChange={() => setIsChangingPassword(!isChangingPassword)}
        checked={isChangingPassword}
        style={{ fontSize: "1.2rem" }}
      >
        Thay đổi mật khẩu?
      </Checkbox>

      {isChangingPassword && (
        <div style={{ marginTop: "2rem" }}>
          <div>
            <Input.Password
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <LockOutlined /> : <LockOutlined />
              }
              style={{ width: "300px" }}
            />
          </div>
          <div>
            <Input.Password
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <LockOutlined /> : <LockOutlined />
              }
              style={{ width: "300px", marginTop: "1rem" }}
            />
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <Button
              type="primary"
              onClick={handlePasswordChange}
              disabled={newPassword !== confirmPassword || newPassword === ""}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
