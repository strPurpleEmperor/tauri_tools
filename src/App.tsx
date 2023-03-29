// @ts-nocheck

import './App.css';

import { AppstoreOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, Spin, FloatButton } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React, { useEffect, useState, Suspense } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { router, RouteType } from './router';

function App() {
	const location = useLocation();
	const [openKeys, setOpenKeys] = useState<string[]>(['/pdf']);
	const [selectedKeys, setSelectedKeys] = useState<string[]>(['/pdf/get-url-list']);
	const [collapsed, setCollapsed] = useState(false);
	function clickMenuHandler(info: any) {
		const { key } = info;
		setSelectedKeys([key]);
	}
	function openChangeHandler(openKeys: string[]) {
		setOpenKeys(openKeys);
	}
	useEffect(() => {
		setSelectedKeys([location.pathname]);
	}, [location.pathname]);
	return (
		<ConfigProvider locale={zhCN}>
			<Layout style={{ height: '100%' }}>
				<Layout.Sider collapsed={collapsed} collapsible onCollapse={() => setCollapsed(!collapsed)}>
					<Menu
						openKeys={openKeys}
						selectedKeys={selectedKeys}
						items={menuItems(router)}
						mode="inline"
						onClick={clickMenuHandler}
						onOpenChange={openChangeHandler}
					/>
				</Layout.Sider>
				<Layout.Content
					id="main"
					style={{
						scrollBehavior: 'smooth',
						padding: 12,
						backgroundColor: 'white',
						overflow: 'auto',
					}}
				>
					<Routes>
						{rooterViews(router)}
						<Route path="*" element={<Navigate to="/pdf/get-url-list" />} />
					</Routes>
				</Layout.Content>
			</Layout>
			<FloatButton.BackTop target={() => window.document.getElementById('main')} />
		</ConfigProvider>
	);
}

export default App;
function menuItems(routerItems?: RouteType[]): any {
	if (routerItems && routerItems.length) {
		return routerItems.map((r) => {
			return {
				key: r.path,
				label: <Link to={r.path}>{r.name}</Link>,
				children: menuItems(r.children),
				icon: <AppstoreOutlined />,
			};
		});
	}
}
function rooterViews(routerItems?: RouteType[]) {
	if (routerItems && routerItems.length) {
		return routerItems.map(({ path, children, Component }) => {
			return (
				<Route
					path={path}
					key={path}
					element={
						Component && (
							<Suspense fallback={<Spin />}>
								<Component />
							</Suspense>
						)
					}
				>
					{rooterViews(children)}
				</Route>
			);
		});
	}
}
