import { Vnode } from "./Vnode";

const diffProps = (oldProps: Record<string, any>, newProps: Record<string, any>) => {
	for (const key in newProps) {
		if (newProps[key] !== oldProps[key]) {
			oldProps[key] = newProps[key];
		}
	}
	for (const key in oldProps) {
		if (!(key in newProps)) {
			delete oldProps[key];
		}
	}
};

const diffChildren = (oldChildren: Vnode[], newChildren: Vnode[]) => {
	const maxLength = Math.max(oldChildren.length, newChildren.length);
	for (let i = 0; i < maxLength; i++) {
		if (i < oldChildren.length && i < newChildren.length) {
			diff(oldChildren[i] as Vnode, newChildren[i] as Vnode);
		} else if (i < oldChildren.length) {
			oldChildren.splice(i, 1);
		} else {
			oldChildren.push(newChildren[i]);
		}
	}
};

export default function diff(oldVnode: Vnode, newVnode: Vnode): Vnode {
	if (newVnode === null || newVnode === undefined) {
		return oldVnode;
	}

	if (oldVnode.tag === newVnode.tag) {
		diffProps(oldVnode.props, newVnode.props);
		if (oldVnode.children && newVnode.children) {
			diffChildren(oldVnode.children as Vnode[], newVnode.children as Vnode[]);
		} else if (oldVnode.children && !newVnode.children) {
			oldVnode.children = [];
		} else if (!oldVnode.children && newVnode.children) {
			oldVnode.children = newVnode.children;
		}
	}
	else if (oldVnode.tag !== newVnode.tag) {
		// Si les balises sont différentes, on remplace l'ancien Vnode par le nouveau
		oldVnode.tag = newVnode.tag;
		oldVnode.props = newVnode.props;
		oldVnode.children = newVnode.children;
	}
	return oldVnode;
}
