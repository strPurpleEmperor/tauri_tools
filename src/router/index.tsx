import React from 'react';

import Merge from '../pages/file/merge';
import Rename from '../pages/file/rename';
import GetPDF from '../pages/pdf/get-pdf';
import GetPDFList from '../pages/pdf/get-pdf-list';
import GetUrlList from '../pages/pdf/get-url-list';

export interface RouteType {
	path: string;
	Component?: React.ElementType;
	name: string;
	children?: RouteType[];
	redirect?: string;
	icon?: React.ReactNode;
}
export const router: RouteType[] = [
	{
		path: '/pdf',
		name: '生成PDF',
		children: [
			{
				path: '/pdf/get-url-list',
				Component: GetUrlList,
				name: '链接批量保存',
			},
			{
				path: '/pdf/get-pdf-list',
				Component: GetPDFList,
				name: '链接批量读取',
			},
			{
				path: '/pdf/get-pdf',
				Component: GetPDF,
				name: '单页生成PDF',
			},
		],
	},
	{
		path: '/file',
		name: '文件操作',
		children: [
			{
				path: '/file/rename',
				Component: Rename,
				name: '批量重命名',
			},
			{
				path: '/file/merge',
				Component: Merge,
				name: '批量生成Word',
			},
		],
	},
];
