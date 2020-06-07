const email = document.querySelector(".login-email");
const password = document.querySelector(".login-password");
const loginBtn = document.querySelector(".login-btn");
const error = document.querySelector(".error");
const url = window.location.href;

function validateEmail(value) {
	var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(value);
}
function validatePassword(value) {
	return value.length >= 8;
}

function validate() {
	const emailValid = validateEmail(email.value);
	const passwordValid = validatePassword(password.value);
	if (!(emailValid && passwordValid)) {
		error.style.opacity = 1;
	}
	return emailValid && passwordValid;
}

function login() {
	fetch(url, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			email: email.value,
			password: password.value,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.error) {
				error.innerText = data.message;
				error.style.opacity = 1;
			} else {
				window.location.replace(window.location.origin);
			}
		})
		.catch((err) => {
			error.innerText = "Something went wrong! try again.";
			error.style.opacity = 1;
		});
}

loginBtn.addEventListener("click", () => {
	validate() && login();
});
