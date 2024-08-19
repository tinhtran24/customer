import { logOut } from "@/app/lib/actions";
import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const logOutHandle = async () => {
    setIsLoading(true);
    const result = await logOut();
    setIsLoading(false);
    router.push("/login");
  };

  return (
    <Button
      type="primary"
      icon={<LogoutOutlined />}
      onClick={logOutHandle}
      loading={isLoading}
    />
  );
}
