"use client";
import { Divider, Input, Checkbox, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { FaEye } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";
import { useAuthContext } from "@/app/components/auth";
import Loading from "../loading";
import { useState } from "react";
import { changePassword } from "@/app/lib/actions";

export default function CustomerPage() {
  const { currentUser } = useAuthContext();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const handlePasswordChange = async () => {
    setIsSubmit(true);

    const result = await changePassword({
      newPassword: newPassword,
      oldPassword: oldPassword,
    });

    setIsSubmit(false);

    if (result.statusCode) {
      message.error(
        Array.isArray(result.message) ? result.message[0] : result.message
      );
    } else {
      message.success("Thay đổi mật khẩu thành công");
    }
  };

  if (!currentUser) return <Loading />;

  return (
    <main style={{ paddingLeft: "3rem", minHeight: "100vh" }}>
      <h2 style={{ color: "#0d2f5f", marginBottom: "2rem" }}>
        Thông tin cá nhân
      </h2>
      <Divider />

      <div style={{ marginBottom: "1.5rem" }}>
        <UserOutlined style={{ marginRight: 10 }} />
        <span style={{ fontWeight: 500 }}>Tên:</span> {currentUser?.name}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <MailOutlined style={{ marginRight: 10 }} />
        <span style={{ fontWeight: 500 }}>Email:</span> {currentUser?.email}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <ApartmentOutlined style={{ marginRight: 10 }} />
        <span style={{ fontWeight: 500 }}>Quyền:</span>
        {currentUser?.role?.charAt(0).toUpperCase() +
          currentUser?.role?.slice(1)}
      </div>

      <Divider />

      <Checkbox
        onChange={() => setIsChangingPassword(!isChangingPassword)}
        checked={isChangingPassword}
      >
        Thay đổi mật khẩu?
      </Checkbox>

      {isChangingPassword && (
        <div style={{ marginTop: "1rem" }}>
          <div>
            <Input.Password
              placeholder="Mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <FaEye /> : <IoEyeOffSharp />
              }
              style={{ width: "300px" }}
            />
          </div>

          <div>
            <Input.Password
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <FaEye /> : <IoEyeOffSharp />
              }
              style={{ width: "300px", marginTop: "1rem" }}
            />
          </div>

          <div>
            <Input.Password
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <FaEye /> : <IoEyeOffSharp />
              }
              style={{ width: "300px", marginTop: "1rem" }}
            />
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <Button
              type="primary"
              onClick={handlePasswordChange}
              loading={isSubmit}
              disabled={
                newPassword !== confirmPassword ||
                newPassword === "" ||
                oldPassword === ""
              }
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
