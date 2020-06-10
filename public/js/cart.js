function removeFromCart(bookId) {
	fetch("/cart/remove", {
		method: "delete",
		body: JSON.stringify({
			bookId,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((data) => {
			if ((data.message = "success")) {
				window.location.reload();
			}
		});
}
