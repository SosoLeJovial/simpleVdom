import { Vnode } from "./Vnode";

// Mise à jour pour accepter différents types d'enfants
export default function createElement(
	type: string,
	props: Record<string, any> = {},
	...children: (Vnode | string | number | boolean | null | undefined)[]
): Vnode {
	// Traiter les enfants pour convertir les textes en Vnodes
	const processedChildren = children.map(child => {
		// Convertir les chaînes en nœuds texte
		if (typeof child === "string") {
			return {
				tag: "text",
				props: { textContent: child },
				children: []
			};
		}
		// Convertir les nombres et booléens en chaînes puis en nœuds texte
		if (typeof child === "number" || typeof child === "boolean") {
			return {
				tag: "text",
				props: { textContent: String(child) },
				children: []
			};
		}
		// Ignorer null et undefined
		if (child === null || child === undefined) {
			return null;
		}
		// Retourner le Vnode tel quel
		return child;
	}).filter(Boolean) as Vnode[]; // Enlever les nulls

	return {
		tag: type,
		props: props,
		children: processedChildren
	};
}