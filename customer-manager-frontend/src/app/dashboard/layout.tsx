"use client";
import React, { useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import {
    Layout,
    theme,
    ConfigProvider,
    Badge,
    Dropdown,
    Avatar,
    MenuProps,
    message
} from "antd";
import { useAuthContext } from "@/app/components/auth";
import styles from './index.module.less';
import { getThemeBg } from "@/app/utils/theme";
import { DashboardMenu } from "@/app/components/Dashboard/Menu";
import { logOut } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
    children: React.ReactNode,
    curActive: string,
    defaultOpen?: string[]
}

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorTextBase, colorWarningText  },
  } = theme.useToken();
    const [curTheme, setCurTheme] = useState<boolean>(false);
    const router = useRouter();

    const toggleTheme = () => {
        const _curTheme = !curTheme;
        setCurTheme(_curTheme);
        localStorage.setItem('isDarkTheme', _curTheme ? 'true' : '');
    }
    const { currentUser, setIsSignedIn } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const logOutHandle = async () => {
        message.info("Đang đăng xuất...")
        setIsLoading(true);
        await logOut();
        setIsSignedIn(false);
        setIsLoading(false);
        router.push("/login");
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a rel="noopener noreferrer" href="/dashboard/profile">
                    Thông tin cá nhân
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="#">
                    Cài đặt
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a onClick={logOutHandle} rel="noopener noreferrer">
                    Đăng xuất
                </a>
            ),
        },
    ];

    useEffect(() => {
        const isDark = !!localStorage.getItem("isDarkTheme");
        setCurTheme(isDark);
    }, []);

      return (
          <ConfigProvider
              theme={{
                  algorithm: curTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
              }}
          >
            <Layout style={{minHeight: "100vh"}}>
                <Sider
                    theme={curTheme ? "dark" : "light" }
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                    }}
                    onCollapse={(collapsed, type) => {
                    }}
                >
                    <span className={styles.logo} style={getThemeBg(curTheme)}>Customer</span>
                    <DashboardMenu />
                </Sider>

              <Layout>
                  <Header style={{ padding: 0, ...getThemeBg(curTheme), display: 'flex' }}>
                  <div className={styles.rightControl}>
                      <span className={styles.msg}>
                        <Badge dot>
                            <BellOutlined />
                        </Badge>
                      </span>
                      <div className={styles.avatar}>
                          <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                              <Avatar style={{color: '#fff', backgroundColor: colorTextBase}}>{currentUser?.name}</Avatar>
                          </Dropdown>
                      </div>
                  </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                  <div
                      style={{
                          padding: 24,
                          minHeight: 520,
                          ...getThemeBg(curTheme),
                          borderRadius: borderRadiusLG,
                      }}
                  >
                    {children}
                  </div>
                </Content>
                  <Footer style={{ textAlign: 'center' }}>
                      Customer-Admin ©{new Date().getFullYear()}
                  </Footer>
              </Layout>
            </Layout>
          </ConfigProvider>
      );
}
