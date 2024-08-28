'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, ConfigProvider, Badge, Popover, type MenuProps } from 'antd';
import getNavList from './menu';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
    BellOutlined,
    MoonOutlined,
    SunOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';
import { useAuthContext } from '../auth';
import { logOut } from '@/app/lib/actions';
import { Link, pathnames, usePathname } from '@/naviagation';
import { getThemeBg } from '@/app/utils/background';

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
    children: React.ReactNode,
    curActive: string,
    defaultOpen?: string[]
}


const CommonLayout: React.FC<IProps> = ({ children, curActive, defaultOpen = ['/'] }) => {
  const {
    token: { borderRadiusLG, colorTextBase, colorWarningText },
  } = theme.useToken();

  const t = useTranslations('global');

  const [isLoading, setIsLoading] = useState(false);
  const { setIsSignedIn } = useAuthContext();

  const locale = useLocale();
  const otherLocale:any = locale === 'en' ? ['zh', '中'] : ['en', 'En'];

  const router = useRouter();
  const pathname = usePathname();
  const navList = getNavList(t);

  const [curTheme, setCurTheme] = useState<boolean>(false);
  const toggleTheme = () => {
        const _curTheme = !curTheme;
        setCurTheme(_curTheme);
        localStorage.setItem('isDarkTheme', _curTheme ? 'true' : '');
  }

  
const logOutHandle = async () => {
    setIsLoading(true);
    await logOut();
    localStorage.removeItem('token')
};

const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Thông tin cá nhân
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          Thay đổi thông tin
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" onClick={logOutHandle} rel="noopener noreferrer" href="/login">
          Đăng xuất
        </a>
      ),
    },
  ];

  const handleSelect = (row: {key: string}) => {
    router.push(row.key)
  }

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
                <span className={styles.logo} style={getThemeBg(curTheme)}>Customer-Admin</span>
                <Menu 
                    theme={curTheme ? "dark" : "light" }
                    mode="inline" 
                    defaultSelectedKeys={[curActive]} 
                    items={navList} 
                    defaultOpenKeys={defaultOpen} 
                    onSelect={handleSelect}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, ...getThemeBg(curTheme), display: 'flex' }}>
                    <div className={styles.rightControl}>
                        <span className={styles.msg}>
                            <Badge dot>
                                <BellOutlined />
                            </Badge>
                        </span>
                        <Link href={pathname as any} locale={otherLocale[0]} className={styles.i18n} style={{color: colorTextBase}}>
                            {otherLocale[1]}
                        </Link>
                        <span onClick={toggleTheme} className={styles.theme}>
                            {
                                !curTheme ? <SunOutlined style={{color: colorWarningText}} /> : <MoonOutlined />
                            }
                        </span>
                        <div className={styles.avatar}>
                        <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                            <Avatar style={{color: '#fff', backgroundColor: colorTextBase}}>Admin</Avatar>
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
                        { children }
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Customer manager ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    </ConfigProvider>
  );
};

export default CommonLayout;