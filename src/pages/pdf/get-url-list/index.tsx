// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message, Space, Spin, Table } from 'antd';
import FileSaver from 'file-saver';
import './index.css';
import { invoke } from '@tauri-apps/api';
import { useAtom, useSetAtom } from 'jotai';
import { loadingValue, pageSizeValue, selectUrlValue, urlListValue, urlValue } from '../../../atom/PDF/getUrlList';
import { getUrlListVal } from '../../../atom/PDF';

function Index() {
	const navigator = useNavigate();
	const [selectAll, setSelectAll] = useState(false);
	const [loading, setLoading] = useAtom(loadingValue);
	const [urlList, setUrlList] = useAtom(urlListValue);
	const [selectUrl, setSelectUrl] = useAtom(selectUrlValue);
	const [pageSize, setPageSize] = useAtom(pageSizeValue);
	const [url, setUrl] = useAtom(urlValue);
	const setUrlListVal = useSetAtom(getUrlListVal);
	useEffect(() => {
		setSelectAll(urlList.length > 0 && selectUrl.length === urlList.length);
	}, [selectUrl, urlList.length]);
	function getURL(url: string) {
		setUrl(url);
		if (!url) return;
		setLoading(true);
		invoke('get_url_list', { url })
			.then((res: any[]) => {
				const val = res.filter((d: any) => /^http/.test(d.url)).map((name: any, index) => ({ ...name, index }));
				if (!val.length) message.info('没有找到URL链接');
				setUrlList(val);
			})
			.finally(() => {
				setLoading(false);
			});
	}
	function getUrl(o: any[], s: number[]) {
		const res = [];
		for (let i = 0; i < s.length; i++) {
			res.push(o[s[i]]?.url || '');
		}
		return res;
	}
	function saveURL() {
		if (!selectUrl.length) return message.info('没有选择的URL');
		const blob = new Blob([JSON.stringify(getUrl(urlList, selectUrl))], {
			type: 'text/plain;charset=utf-8',
		});
		FileSaver.saveAs(blob, 'url-list.txt');
	}
	function toSelectAll() {
		if (!selectAll) {
			setSelectUrl(new Array(urlList.length).fill(0).map((_, i) => i));
		} else {
			setSelectUrl([]);
		}
	}
	function toGetAllPDF() {
		setUrlListVal(getUrl(urlList, selectUrl));
		navigator('/pdf/get-pdf-list');
	}
	return (
		<div className="content">
			<Input.Search
				className="input"
				placeholder="输入网页地址"
				onSearch={getURL}
				enterButton="确认"
				allowClear
				value={url}
				onInput={(v: any) => setUrl(v.target.value)}
			/>
			{loading && (
				<div>
					URL 获取中，请稍后……
					<Spin />
				</div>
			)}
			<div style={{ marginTop: 10 }} />
			{urlList.length > 0 && (
				<Space direction="vertical">
					<div>
						<Button onClick={toSelectAll} danger={selectAll}>
							{selectAll ? '取消' : '选择'}全部
						</Button>
						<span style={{ marginLeft: 10 }}>提示：选择所有URL</span>
					</div>
					<Table
						scroll={{ y: 550 }}
						rowSelection={{
							type: 'checkbox',
							selectedRowKeys: selectUrl,
							onChange(selectedRowKeys: any) {
								setSelectUrl(selectedRowKeys);
							},
						}}
						rowKey={(item) => item.index}
						columns={[
							{
								title: '←选择当前页全部',
								dataIndex: 'name',
								key: 'name',
								ellipsis: true,
							},
							{
								title: 'URL',
								dataIndex: 'url',
								key: 'url',
								ellipsis: true,
								render: (url: string) => (
									<a href={url} target="_blank" rel="noreferrer">
										{url}
									</a>
								),
							},
						]}
						dataSource={urlList}
						pagination={{
							pageSize,
							onChange: (_: any, size) => {
								setPageSize(size);
							},
						}}
					/>
				</Space>
			)}
			{urlList.length > 0 && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						paddingBottom: 20,
					}}
				>
					<Space>
						<Button danger onClick={() => setUrlList([])}>
							清空
						</Button>
						<Button onClick={saveURL}>保存URL文件</Button>
						<Button onClick={toGetAllPDF} type="primary">
							将所选页面保存为 PDF
						</Button>
					</Space>
				</div>
			)}
		</div>
	);
}
export default Index;
