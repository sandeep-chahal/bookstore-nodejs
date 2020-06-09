const url = window.location.origin + "/remove/book";
let deleting = false;

function removeBook(bookId, el) {
	if (deleting) return;
	deleting = true;
	el.innerText = "removing...";
	fetch(`${url}?bookId=${bookId}`, { method: "delete" })
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			if (data.message === "success") {
				document.getElementById(bookId).remove();
			}
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {
			deleting = false;
			el.innerText = "remove";
		});
}
