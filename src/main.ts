import createElement from "./Vdom/createElement";
import render from "./Vdom/render";
import mount from "./Vdom/mount";
import diff from "./Vdom/diff";


const container = document.getElementById("root");


let count = 0;
const interval = setInterval(() => {
	count++;
	const node = createElement(
		"div",
		{ id: "app", class: "container text-center" },
		createElement("h1", { class: "title", content: "Toz!" }),
		createElement("img", { src: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHdqcGxxZTBnZWlpYWJ6cWlyZzlycWR4azRncmkxbmt6bjdyeWJ6cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tHIRLHtNwxpjIFqPdV/giphy.gif", alt: "Example Image" }),
		createElement("input", { type: "text" }));

	console.log(node);

	const Vapp = render(node);

	if (container) {
		mount(Vapp, container);
		console.log("Rendered");
	}
	return;
}, 1000);
