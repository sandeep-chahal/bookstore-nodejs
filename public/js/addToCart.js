function addToCart(bookId) {
	console.log(bookId);
	fetch("/cart/add", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.message === "success") window.location.href = "/cart";
		});
}
