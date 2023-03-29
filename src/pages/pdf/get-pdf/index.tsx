// @ts-nocheck
import { Button, Card, Image, Input, Space, Spin } from 'antd';
import { useAtom } from 'jotai';
import React from 'react';

import { invoke } from '@tauri-apps/api';
import { loadingVal, pdfVal } from '../../../atom/PDF/getPDF';
import { buffer2Url, downLoadPDF } from '../../../tools';
import { PDFTYPE } from '../../../types';

function GetPDF() {
	const [loading, setLoading] = useAtom(loadingVal);
	const [pdf, setPDF] = useAtom(pdfVal);
	function toGetPDF(val: string) {
		if (!val) return;
		setLoading(true);
		invoke<PDFTYPE>('get_one_pdf', { url: val })
			.then((res) => {
				setPDF(res);
			})
			.finally(() => {
				setLoading(false);
			});
	}
	function toDown() {
		downLoadPDF(pdf);
	}
	return (
		<div>
			<div style={{ width: 500 }}>
				<Input.Search allowClear enterButton="确认" onSearch={toGetPDF} />
			</div>
			{loading && (
				<div style={{ marginTop: 10 }}>
					PDF 生成中，请稍后……
					<Spin />
				</div>
			)}
			<Card
				title="解析内容"
				style={{ marginTop: 20 }}
				extra={
					pdf && (
						<Space>
							<Button danger onClick={() => setPDF(null)}>
								清空
							</Button>
							{pdf?.status && (
								<Button type="primary" onClick={toDown}>
									下载
								</Button>
							)}
						</Space>
					)
				}
			>
				<Space direction="vertical">
					<div>标题：{pdf?.title || (pdf?.status === 0 && '"解析失败"')}</div>
					<div>
						预览：
						<Image src={buffer2Url(pdf?.img)} />
					</div>
				</Space>
			</Card>
		</div>
	);
}
export default GetPDF;
