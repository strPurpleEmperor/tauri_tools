import { VrSyncStore } from '../types';

export function initStore(value: any = 0) {
	const store: VrSyncStore = {
		value,
		listeners: new Set(),
		subscribe: () => {
			store.listeners.forEach((listener: any) => listener());
		},
	};
	return store;
}
