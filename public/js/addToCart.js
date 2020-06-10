function addToCart(bookId) {
	console.log(bookId);
	fetch("/cart/add", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId }),
	});
}
