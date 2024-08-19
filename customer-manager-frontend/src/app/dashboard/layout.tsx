"use client";
import React, { useEffect, useState } from "react";
import { FundFilled, GithubOutlined } from "@ant-design/icons";
import { Layout, Divider, Space, theme, Spin, Button } from "antd";
import DashboardMenu from "@/app/components/Dashboard/Menu";
import User from "@/app/components/Users/UserName";
import Logout from "@/app/components/Users/Logout";
import Link from "next/link";

const { Header, Content, Footer, Sider } = Layout;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [user, setUser] = useState({});
  const [isUserFetching, setIsUserFetching] = useState(true);

  useEffect(() => {
    setIsUserFetching(false);
  }, [user]);

  useEffect(() => {
    fetch("/api/getUser")
      .then((res) => res.json())
      .then((data) => {
        setUser(data?.user);
      });
  }, []);

  return (
    <Layout>
      <Sider
        breakpoint="xxl"
        collapsedWidth="0"
        style={{
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ textAlign: "center", margin: 7 }}>
          <FundFilled
            style={{
              fontSize: "50px",
              color: "white",
              display: "inline-block",
            }}
          />
        </div>
        <Divider style={{ margin: 0, borderColor: "white", opacity: 0.1 }} />
        <DashboardMenu />
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            direction: "rtl",
            position: "sticky",
            zIndex: 100,
            top: 0,
            minWidth: 500,
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 15px 10px -15px",
          }}
        >
          <Space size={"large"}>
            <Logout />
            {isUserFetching ? <Spin /> : <User user={user} />}
          </Space>
        </Header>

        <Divider style={{ margin: 0 }} />

        <Content style={{ margin: 20 }}>
          <div
            style={{
              padding: 20,
              minHeight: 460,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
          }}
        >
          <Divider
            orientation="center"
            style={{
              borderColor: "#dfae04",
              margin: 0,
              padding: 5,
            }}
          />
          <Link href="#" style={{ color: "black" }}>
            <span style={{ margin: "0px 10px 0px 0px", fontSize: 18 }}>
             OrientSoftware
            </span>

            <GithubOutlined
              style={{ margin: "0px 10px 0px 0px", fontSize: 20 }}
            />

            <span style={{ margin: "0px 10px 0px 0px", fontSize: 18 }}>
              2024
            </span>
          </Link>
        </Footer>
      </Layout>
    </Layout>
  );
}
