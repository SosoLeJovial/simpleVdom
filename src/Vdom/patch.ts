import { Vnode } from "./Vnode";
import render from "./render";

/**
 * Applique les changements découverts lors du diff au DOM réel
 * @param oldNode Le nœud DOM à mettre à jour
 * @param vnode Le Vnode représentant le nouvel état
 * @param parent Le nœud parent dans le DOM (optionnel)
 * @returns Le nœud DOM mis à jour
 */
export default function patch(oldNode: Node, vnode: Vnode, parent?: Node): Node {
	// Si pas de nœud à patcher, on crée simplement le nouveau
	if (!oldNode) {
		const newNode = render(vnode);
		if (parent) {
			parent.appendChild(newNode);
		}
		return newNode;
	}

	// Si le vnode est un nœud texte
	if (vnode.tag === "text") {
		if (oldNode.nodeType === Node.TEXT_NODE) {
			// Mettre à jour le contenu si nécessaire
			if (oldNode.textContent !== vnode.props.textContent) {
				oldNode.textContent = vnode.props.textContent;
			}
			return oldNode;
		} else {
			const newNode = render(vnode);
			if (parent) {
				parent.replaceChild(newNode, oldNode);
			}
			return newNode;
		}
	}

	if (oldNode.nodeName.toLowerCase() !== vnode.tag.toLowerCase()) {
		const newNode = render(vnode);
		if (parent) {
			parent.replaceChild(newNode, oldNode);
		}
		return newNode;
	}

	if (oldNode instanceof HTMLElement) {
		for (const [key, value] of Object.entries(vnode.props)) {
			if (key.startsWith("on")) {
				const eventName = key.slice(2).toLowerCase();
				oldNode.addEventListener(eventName, value);
			} else if (key === "content" || key === "textContent") {
				oldNode.textContent = String(value);
			} else {
				oldNode.setAttribute(key, String(value));
			}
		}

		// Supprimer les attributs qui ne sont plus présents
		for (let i = 0; i < oldNode.attributes.length; i++) {
			const attrName = oldNode.attributes[i].name;
			if (!(attrName in vnode.props) && attrName !== "key") {
				oldNode.removeAttribute(attrName);
			}
		}
	}

	// Mise à jour des enfants
	if (vnode.children) {
		const childNodes = Array.from(oldNode.childNodes);

		// Patcher les enfants existants
		for (let i = 0; i < vnode.children.length; i++) {
			const childVNode = vnode.children[i];

			// Ignorer les enfants null ou undefined
			if (childVNode === null || childVNode === undefined) {
				continue;
			}

			// Convertir les primitives en objets Vnode
			let childToProcess;
			if (typeof childVNode === "string" || typeof childVNode === "number" || typeof childVNode === "boolean") {
				childToProcess = {
					tag: "text",
					props: { textContent: String(childVNode) },
					children: []
				};
			} else {
				childToProcess = childVNode as Vnode;
			}

			// Patcher ou créer l'enfant
			if (i < childNodes.length) {
				patch(childNodes[i], childToProcess, oldNode);
			} else {
				const newChildNode = render(childToProcess);
				oldNode.appendChild(newChildNode);
			}
		}

		// Supprimer les enfants en trop
		while (oldNode.childNodes.length > vnode.children.length) {
			oldNode.removeChild(oldNode.lastChild!);
		}
	} else {
		// Si le nouveau vnode n'a pas d'enfants, on vide le nœud
		oldNode.textContent = "";
	}

	return oldNode;
}