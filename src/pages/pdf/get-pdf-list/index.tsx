// @ts-nocheck

import { CaretRightOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Image, message, Modal, Space, Spin, Table, Upload } from 'antd';
import { useAtom } from 'jotai';
import JSZip from 'jszip';
import React, { useCallback, useEffect } from 'react';

import { dialog, fs, invoke } from '@tauri-apps/api';
import { getUrlListVal } from '../../../atom/PDF';
import { fileListValue, isPrinting, pdfListValue, PDFStack, statusValue, urlStack } from '../../../atom/PDF/getPDFList';
import { buffer2Url } from '../../../tools';
import { PDFTYPE } from '../../../types';

function GetPDFList() {
	const [urlQue, setUrlQue] = useAtom(urlStack);
	const [pdfQue, setPDFQue] = useAtom(PDFStack);
	const [pdfList, setPdfList] = useAtom(pdfListValue);
	const [fileList, setFileList] = useAtom(fileListValue);
	const [loading, setLoading] = useAtom(isPrinting);
	const [urlList, setUrlList] = useAtom(getUrlListVal);
	const setStatus = (val: any) => {
		statusValue.value = val;
		statusValue.subscribe();
	};
	const getPDFList = useCallback(async () => {
		if (loading || statusValue.value !== 2) return;
		setLoading(true);
		const _urlQue = [...urlQue];
		if (_urlQue.length || pdfQue.length) {
			const url = _urlQue.shift();
			setUrlQue(_urlQue);
			setUrlList(_urlQue);
			invoke<PDFTYPE>('get_one_pdf', { url }).then((res) => {
				if (statusValue.value === 2) {
					const arr = [];
					if (pdfQue.length) {
						pdfQue.forEach((p) => {
							arr.push(p);
						});
						setPDFQue([]);
					}
					arr.push(res);
					setPdfList(pdfList.concat(arr));
				} else {
					setPDFQue(pdfQue.concat(res));
				}
				setLoading(false);
			});
		} else {
			if (urlList.length < 1) {
				setStatus(4);
			}
			setLoading(false);
		}
	}, [loading, pdfList, pdfQue, urlList, urlQue]);
	useEffect(() => {
		if (urlList.length && pdfList.length) {
			Modal.confirm({
				title: '提示',
				content: '有进行中的任务是否覆盖',
				onOk: () => {
					setPdfList([]);
					setStatus(2);
					setUrlQue(urlList);
				},
			});
		}
		return () => {
			setUrlList([]);
		};
	}, []);
	useEffect(() => {
		getPDFList();
	}, [urlQue, loading, pdfQue]);
	function toStart() {
		const reader = new FileReader();
		reader.readAsText(fileList[0].originFileObj);
		reader.onload = async function f(e) {
			try {
				const urls = JSON.parse(e?.target?.result as string);
				setStatus(2);
				setUrlQue(urls);
				setUrlList(urls);
			} catch (e) {
				message.error('文件格式不正确');
			}
		};
	}
	function fileChange(e: any) {
		if (e.fileList.length) {
			if (pdfList.length) {
				Modal.confirm({
					content: '有没有保存的任务，是否覆盖？',
					onOk: () => {
						toStop();
						setPdfList([]);
						setStatus(1);
						setFileList(e.fileList);
					},
				});
			} else {
				setStatus(1);
				setFileList(e.fileList);
			}
		} else {
			setStatus(0);
			setFileList([]);
		}
	}
	function saveAllPDF() {
		const zip = new JSZip();
		const promises: Promise<any>[] = [];
		pdfList
			.filter((p) => p.status)
			.forEach((p) => {
				const file: any = zip.file(`${p.title}.pdf`, p.pdf, { binary: true });
				promises.push(Promise.resolve(file));
			});
		const rename = new Date().toString();
		Promise.all(promises)
			.then(() => {
				zip.generateAsync({ type: 'arraybuffer' }).then((content) => {
					// 生成二进制流
					dialog.save({ defaultPath: `${rename}.zip` }).then((res) => {
						if (res) {
							fs
								.writeBinaryFile(res, content)
								.then(() => {
									message.success('保存成功');
								})
								.catch(() => {
									message.error('保存失败请联系开发者');
								});
						}
					});
				});
			})
			.catch(() => {
				message.error('保存失败请联系开发者');
			});
	}
	function toPause() {
		setStatus(3);
		setUrlQue([]);
	}
	function toStop() {
		setUrlQue([]);
		setPDFQue([]);
		setStatus(4);
	}
	function toContinue() {
		setStatus(2);
		setUrlQue(urlList);
	}
	function toRetry(item: PDFTYPE, index: number) {
		invoke('get_one_pdf', { url: item.url }).then((res: PDFTYPE) => {
			pdfList[index] = res;
			setPdfList([...pdfList]);
		});
		pdfList[index].loading = true;
		setPdfList([...pdfList]);
	}
	return (
		<>
			<div style={{ width: 200 }}>
				<Upload fileList={fileList} maxCount={1} beforeUpload={() => false} onChange={fileChange}>
					<Button type="primary">上传URL文件</Button>
				</Upload>
			</div>
			<div
				style={{
					marginTop: 20,
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ marginRight: 20 }}>
						{statusValue.value === 1 && (
							<Button type="primary" icon={<CaretRightOutlined />} onClick={toStart}>
								开始
							</Button>
						)}
						{statusValue.value === 2 && (
							<Space>
								<Button icon={<PauseOutlined />} danger onClick={toPause}>
									暂停
								</Button>
								<Button icon={<StopOutlined />} danger onClick={toStop}>
									停止
								</Button>
							</Space>
						)}
						{statusValue.value === 3 && (
							<Button icon={<CaretRightOutlined />} type="primary" onClick={toContinue}>
								继续
							</Button>
						)}
					</div>
					{statusValue.value === 2 && (
						<div>
							PDF 生成中，请稍后……
							<Spin />
						</div>
					)}
				</div>
				{!statusValue.value && <div />}
				<Button disabled={statusValue.value !== 4 || !pdfList.length} onClick={saveAllPDF}>
					保存全部
				</Button>
			</div>
			<Table
				style={{ marginTop: 10 }}
				pagination={false}
				rowKey={(item: PDFTYPE) => item.title + Math.random()}
				dataSource={pdfList as any[]}
				columns={[
					{
						title: '名称',
						dataIndex: 'title',
						key: 'title',
						render: (title: string) => title || '解析失败',
					},
					{
						title: '预览',
						dataIndex: 'img',
						key: 'img',
						ellipsis: true,
						render: (img: number[], { status, url }) => {
							if (status) return <Image width={100} height={100} src={buffer2Url(img)} />;
							return (
								<a href={url} target="_blank" rel="noreferrer">
									{url}
								</a>
							);
						},
					},
					{
						title: '操作',
						dataIndex: 'pdf',
						key: 'pdf',
						width: 180,
						render: (pdf: number[], item: PDFTYPE, index: number) => {
							return (
								<Button loading={!!item.loading} onClick={() => toRetry(item, index)}>
									重试
								</Button>
							);
						},
					},
				]}
			/>
		</>
	);
}
export default GetPDFList;
