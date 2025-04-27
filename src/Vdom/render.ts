import { Vnode } from "./Vnode";

export default function render(vnode: Vnode): Node {
	// Handle text nodes
	if (vnode.tag === "text") {
		const textContent = vnode.props.textContent || "";
		return document.createTextNode(textContent);
	}

	// Pour les éléments HTML normaux
	const element = document.createElement(vnode.tag);

	for (const [key, value] of Object.entries(vnode.props)) {
		if (key.startsWith("on")) {
			const eventName = key.slice(2).toLowerCase();
			element.addEventListener(eventName, value);
		} else if (key === "content") {
			element.textContent = value;
		} else {
			element.setAttribute(key, String(value));
		}
	}

	// Ajouter les enfants
	if (vnode.children && vnode.children.length > 0) {
		for (const child of vnode.children) {
			if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
				// Convertir en texte
				element.appendChild(document.createTextNode(String(child)));
			} else if (child) {
				// S'assurer que child est bien un Vnode
				element.appendChild(render(child as Vnode));
			}
		}
	}

	return element;
}