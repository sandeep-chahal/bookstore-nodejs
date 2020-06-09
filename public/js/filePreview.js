const file = document.querySelector(".file");
const filePreview = document.querySelector(".img-preview");

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			filePreview.style.backgroundImage = `url(${e.target.result})`;
			filePreview.style.backgroundPosition = "center";
			filePreview.style.backgroudSize = "contain";
			filePreview.style.backgroudRepeat = "no-repeat";
		};

		reader.readAsDataURL(input.files[0]);
	}
}

file.addEventListener("change", function () {
	readURL(file);
});
