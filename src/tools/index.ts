import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { PDFTYPE, Rule } from '../types';

export function buffer2Url(buffer?: number[]) {
	if (!buffer) return '';
	return `data:image/png;base64,${window.btoa(
		new Uint8Array(buffer).reduce((res, byte) => {
			return res + String.fromCharCode(byte);
		}, '')
	)}`;
}

export function downLoadPDF(pdf: PDFTYPE | null) {
	if (!pdf) return;
	const file = new Blob([new Uint8Array(pdf.pdf)], {
		type: 'application/pdf',
	});
	FileSaver.saveAs(file, `${pdf.title}.pdf`);
}

export function getFileType(v?: string): [string, string] {
	if (!v) return ['', ''];
	const arr = v.split('.');

	if (arr.length > 1) {
		const suffix = arr[arr.length - 1] || '';
		arr.pop();
		return [arr.join('.'), `.${suffix}`];
	}
	return [v, ''];
}

export const RULES: Rule[] = [
	{
		ruleName: '保留整数',
		rule: (val: number) => {
			if (val) return val.toFixed(0);
			return val;
		},
	},
	{
		ruleName: '保留一位小数',
		rule: (val: number) => {
			if (val) return val.toFixed(1);
			return val;
		},
	},
	{
		ruleName: '保留两位小数',
		rule: (val: number) => {
			if (val) return val.toFixed(2);
			return val;
		},
	},
	{
		ruleName: '日期：2023/03/01',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY/MM/DD');
			return val;
		},
	},
	{
		ruleName: '日期：2023-03-01',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY-MM-DD');
			return val;
		},
	},
	{
		ruleName: '日期：2023/03/01 13:30',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY/MM/DD HH:mm');
			return val;
		},
	},
	{
		ruleName: '日期：2023-03-01 13:30',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY-MM-DD HH:mm');
			return val;
		},
	},
];

export function isNotVoidObj(obj: Record<string, any>): boolean {
	const keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
		if (obj[keys[i]] !== void 0) return true;
	}
	return false;
}

export function void2empty(obj: Record<string, any>): Record<string, any> {
	Object.keys(obj).forEach((key) => {
		if (obj[key] === void 0) {
			obj[key] = '';
		}
	});
	return obj;
}
