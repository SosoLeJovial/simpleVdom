export default function mount(vnode: Node, container: HTMLElement): Node {
	if (!(container instanceof Node)) {
		throw new Error("Le conteneur doit être un nœud valide.");
	}
	container.innerHTML = "";
	container.appendChild(vnode);
	return vnode;
}
