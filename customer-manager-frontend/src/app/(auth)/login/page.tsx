import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LoginForm from "@/app/components/Users/LoginForm";
import { Card, Flex } from "antd";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
    return (
    <main>
      <AntdRegistry>
        <main>
          <Flex
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundImage:
                "linear-gradient(90deg, rgba(77,134,156,1) 0%, rgba(122,178,178,1) 36%, rgba(205,232,229,1) 100%)",
            }}
          >
            <Flex
              style={{
                backgroundColor: "transparent",
              }}
            >
              <Card
                bordered={false}
                style={{
                  minWidth: 450,
                  justifyContent: "center",
                  boxShadow: "5px 5px 5px #0d2f5f",
                }}
              >
                <LoginForm />
              </Card>
            </Flex>
          </Flex>
        </main>
      </AntdRegistry>
    </main>
  );
}

export default LoginPage;