let inProgress = false;
const removeUrl = window.location.origin + "/remove/book";
const restockUrl = window.location.origin + "/restock/book";

function removeBook(bookId, el) {
	if (inProgress) return;
	inProgress = true;
	el.innerText = "removing...";
	fetch(`${removeUrl}?bookId=${bookId}`, { method: "delete" })
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
			inProgress = false;
			el.innerText = "remove";
		});
}

function restock(bookId) {
	if (inProgress) return;
	inProgress = true;
	const quantity = parseInt(prompt("enter quantity!"));
	if (quantity < 0 || isNaN(quantity)) {
		return alert("quantity can't be less then 0");
	}

	fetch(`${restockUrl}?bookId=${bookId}&quantity=${quantity}`)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			if (data.message === "success") {
				window.location.reload(true);
			}
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {
			inProgress = false;
		});
}
