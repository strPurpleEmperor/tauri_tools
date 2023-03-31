export interface PDFTYPE {
	title: string;
	pdf: number[];
	img: number[];
	status: boolean;
	url: string;
	loading?: boolean;
}
export interface Rule {
	rule: (arg: any) => any;
	ruleName: string;
}

export interface VrSyncStore {
	value: any;
	listeners: Set<any>;
	subscribe: () => void;
}
