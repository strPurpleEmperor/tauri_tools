import { atom } from 'jotai';

import { PDFTYPE } from '../../types';

export const loadingVal = atom<boolean>(false);
export const pdfVal = atom<PDFTYPE | null>(null);
