const dropzone = document.querySelector(".dropzone");
const fileInput = document.getElementById("fileInput");
const imagesContainer = document.querySelector(".imagesContainer");
const placeholder = document.querySelector(".images-placeholder");

let files = [];

// click to open file picker
dropzone.addEventListener("click", () => {
    fileInput.click();
});

// file input change
fileInput.addEventListener("change", (event) => {
    handleFiles(event.target.files);
    fileInput.value = "";
});

// drag over
dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("active");
});

// drag leave
dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("active");
});

// drop
dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("active");
    handleFiles(e.dataTransfer.files);
});

// handle files
function handleFiles(newFiles) {
    files.push(...Array.from(newFiles));

    if (placeholder) {
        placeholder.style.display = "none";
    }

    renderImages();
}

// render images
function renderImages() {
    imagesContainer.innerHTML = "";

    files.forEach(file => {
        const img = document.createElement("img");
        img.className = "images";
        img.src = URL.createObjectURL(file);

        imagesContainer.appendChild(img);
    });
}