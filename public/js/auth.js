const name = document.querySelector(".form-name");
const email = document.querySelector(".form-email");
const password = document.querySelector(".form-password");
const confirmPassword = document.querySelector(".form-confirm-password");
const btn = document.querySelector(".form-btn");
const errorWrapper = document.querySelector(".error-wrapper");
const url = window.location.href;
let inProgress = false;

function submit(body) {
	fetch(url, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body,
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.error) {
				inProgress = false;
				showErrors(data.errors);
				btn.classList.remove("disabled");
			} else window.location.replace(window.location.origin);
		})
		.catch((err) => {
			inProgress = false;
			btn.classList.remove("disabled");
			if (err.error) showErrors(err.errors);
			else {
				errorWrapper.innerHTML = "";
				const div = `<div class="error">Something went wrong!</div>`;
				errorWrapper.innerHTML += div;
			}
		});
}

btn.addEventListener("click", () => {
	if (inProgress) return;
	inProgress = true;
	errorWrapper.innerHTML = "";
	btn.classList.add("disabled");
	let body = null;
	if (btn.dataset.type === "login")
		body = JSON.stringify({
			email: email.value,
			password: password.value,
		});
	else if (btn.dataset.type === "signup")
		body = JSON.stringify({
			email: email.value,
			password: password.value,
			confirmPassword: confirmPassword.value,
			name: name.value,
		});
	submit(body);
});

function showErrors(errors) {
	errorWrapper.innerHTML = "";
	errors.forEach((err) => {
		const div = `<div class="error">${err}</div>`;
		errorWrapper.innerHTML += div;
	});
}
