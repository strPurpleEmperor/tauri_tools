import { atom } from 'jotai';
import { PDFTYPE } from '../../types';
import { initStore } from '../index';

export const pdfListValue = atom<PDFTYPE[]>([]);
export const fileListValue = atom<any[]>([]);
// export const statusValue = atom<0 | 1 | 2 | 3 | 4>(0);
export const statusValue = initStore(0);
export const urlStack = atom<string[]>([]);
export const PDFStack = atom<PDFTYPE[]>([]);
export const isPrinting = atom<boolean>(false);
