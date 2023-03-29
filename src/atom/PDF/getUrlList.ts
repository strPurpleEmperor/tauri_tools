import { atom } from 'jotai';

export const loadingValue = atom<boolean>(false);
export const urlListValue = atom<any[]>([]);
export const selectUrlValue = atom<number[]>([]);
export const pageSizeValue = atom<number>(10);
export const urlValue = atom<string>('');
