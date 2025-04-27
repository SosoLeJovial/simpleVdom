import { Vnode } from "./Vnode";

type PatchType = "TEXT" | "PROPS" | "REPLACE" | "INSERT" | "REMOVE";

interface Patch {
	type: PatchType;
	newVnode?: Vnode;
	props?: { [key: string]: any };
	text?: string;
}


const diffProps = (oldProps: Record<string, any>, newProps: Record<string, any>): Record<string, any> => {
	const patches: Record<string, any> = {};

	for (const key in newProps) {
		if (newProps[key] !== oldProps[key]) {
			patches[key] = newProps[key];
		}
	}
	for (const key in oldProps) {
		if (!(key in newProps)) {
			patches[key] = undefined;
		}
	}
	return patches;
}

const diffChildren = (oldVnode: Vnode, newVnode: Vnode): Patch[] => {
	let patches: Patch[] = [];

	const oldChildren = oldVnode.children;
	const newChildren = newVnode.children;

	if ((!oldChildren && !newChildren))
		return patches;
	else if (oldVnode.children === newVnode.children)
		return patches;
	else if (newChildren) {
		for (let i = 0; i < newChildren.length; i++) {
			// Check if oldChildren[i] exists and is a Vnode
			if (oldChildren && oldChildren[i] && typeof oldChildren[i] === 'object' && 'tag' in oldChildren[i]) {
				if (oldChildren[i].tag !== newChildren[i].tag) {
					patches.push({ type: "REPLACE", newVnode: newChildren[i] });
				}
				else if (oldChildren[i].tag === newChildren[i].tag) {
					patches.push(...diff(oldChildren[i], newChildren[i]));
				}
			}
			// add the patch to the patches array
			if (oldChildren && oldChildren[i]) {

			}
		}
	}
	else if (oldChildren) {
		for (let i = 0; i < oldChildren.length; i++) {
			patches.push({ type: "REMOVE" });
		}
	}

	return patches;
}


export default function diff(oldVnode: Vnode, newVnode: Vnode): Patch[] {
	const patches: Patch[] = [];

	if (!oldVnode) {
		// Si pas d'ancien, on insère
		patches.push({ type: "INSERT", newVnode });
	} else if (!newVnode) {
		// Si pas de nouveau, on supprime
		patches.push({ type: "REMOVE", });
	} else if (oldVnode.tag !== newVnode.tag) {
		// Si le type d'élément change (ex: <div> → <span>), on remplace
		patches.push({ type: "REPLACE", newVnode });
	} else {
		// Vérifier les props si même type
		const propPatches = diffProps(oldVnode.props, newVnode.props);
		if (Object.keys(propPatches).length > 0) {
			patches.push({ type: "PROPS", props: propPatches });
		}
		// Vérifier les enfants
		patches.push(...diffChildren(oldVnode, newVnode));
	}

	return patches;
}

