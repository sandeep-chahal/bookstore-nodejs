const name = document.querySelector(".form-name");
const email = document.querySelector(".form-email");
const password = document.querySelector(".form-password");
const confirmPassword = document.querySelector(".form-confirm-password");
const signupBtn = document.querySelector(".form-btn");
const error = document.querySelector(".error");
const url = window.location.href;

let loading = false;

function validateEmail(value) {
	var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(value);
}
function validatePassword(value) {
	return value.length >= 8;
}
function validateConfirmPassword(value1, value2) {
	return value1 === value2;
}

function validate() {
	const emailValid = validateEmail(email.value);
	const passwordValid = validatePassword(password.value);
	const confirmPasswordValid = validateConfirmPassword(
		password.value,
		confirmPassword.value
	);
	if (!(emailValid && passwordValid && confirmPasswordValid && name)) {
		signupBtn.classList.remove("disabled");
		loading = false;
		signupBtn.innerText = "Let's Go";
		error.innerText = "Fill all the feilds correctly!";
		error.style.opacity = 1;
	}
	return emailValid && passwordValid && confirmPasswordValid && name;
}

function signup() {
	fetch(url, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			name: name.value,
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
			signupBtn.classList.remove("disabled");
			loading = false;
			signupBtn.innerText = "Let's Go";
			error.innerText = "Something went wrong! try again.";
			error.style.opacity = 1;
		});
}

signupBtn.addEventListener("click", () => {
	if (loading) return;
	signupBtn.classList.add("disabled");
	loading = true;
	signupBtn.innerText = "Hold on...";
	error.style.opacity = 0;
	validate() && signup();
});
