const checkoutBtn = document.querySelector(".order-btn");
const defaultText = checkoutBtn.innerHTML;
let processing = false;
const stripe = Stripe("pk_test_5GXdnM53LpTCqVtWiwhiqiLv00io8p3LcC");

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

checkoutBtn.addEventListener("click", checkout);

function checkout() {
	if (processing) return;
	processing = true;
	checkoutBtn.innerHTML = "Processing...";
	fetch("/checkout")
		.then((res) => res.json())
		.then((data) => {
			if (data.session) {
				console.log(data.session);
				stripe
					.redirectToCheckout({
						sessionId: data.session.id,
					})
					.then(function (result) {
						console.log(result);
					});
			} else {
				alert(data.message + " try again!");
				window.location.reload();
			}
		})
		.catch((err) => {
			console.log(err);
			alert(err);
			window.location.reload();
			window.location.reload();
		});
}
