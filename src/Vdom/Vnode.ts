export type VnodeChild = Vnode | string | number | boolean | null | undefined;

export interface Vnode {
	tag: string;
	props: Record<string, any>;
	children?: (Vnode | string | number | boolean)[];
	key?: string | number;
}