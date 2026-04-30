import { GET, POST, UPDATE } from "./api/crud.js";

(() => {

    const popUp = document.querySelector(".popUp");
    const addProject = document.getElementById("addProject");

    addProject.addEventListener("click", (event) => {
        popUp.classList.add("show");
        document.querySelector(".overlay").classList.add("show");
    });

    const cancel = document.getElementById("dont-save-button");

    cancel.addEventListener("click", () => {
        popUp.classList.remove("show");
        document.querySelector(".overlay").classList.remove("show");
    })

    // close pop using overlay
    document.querySelector(".overlay").addEventListener("click", (event) => {
        event.stopPropagation();
        popUp.classList.remove("show");
        document.querySelector(".overlay").classList.remove("show");
    });

}) ();

//TODO:
// (() => {
    
//     document.querySelector(".project-box").addEventListener("click", () => {
//         document.querySelector(".project-box").classList.add("active");
//     });

// }) ();

// images preview
(() => {

    const files = [];
    
    const fileInput = document.getElementById("fileInput");
    const dropAndDrag = document.querySelector(".drop-and-drag");

    dropAndDrag.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    dropAndDrag.addEventListener("drop", (e) => {
        e.preventDefault();
        files.push(...e.dataTransfer.files);
        renderImages(files);
    });

    fileInput.addEventListener("change", (event) => {

        const placeholder = document.querySelector(".images-placeholder");

        if(placeholder) {
            placeholder.style.display = "none";
        }

        const newFile = Array.from(event.target.files);

        files.push(...newFile);

        console.log(files);

        renderImages(files);

    });

    document.getElementById("saveProject").addEventListener("click", () => {
        addProject(files);
    });

}) ();

function renderImages (images) {

    const imagesContainer = document.querySelector(".imagesContainer");

    imagesContainer.innerHTML = "";

    images.forEach(img => {

        const image = `
                <img 
                    class="images" 
                    src="${URL.createObjectURL(img)}">
            `;

        imagesContainer.insertAdjacentHTML("beforeend", image);

    });

    const imagePreviewBigOne = document.querySelector(".imagePreviewBigOne");

    imagePreviewBigOne.src = URL.createObjectURL(images[images.length - 1]);
}

async function addProject (images) {
    
    const titleEl = document.getElementById("title");
    const descriptionEl = document.getElementById("description");
    const dateEl = document.getElementById("date");

    const halfBody = {
        title: titleEl.value.trim(),
        description: descriptionEl.value.trim(),
        date: dateEl.value.trim()
    };

    const url = "http://localhost:80/index.php/save-project"

    const body = new FormData();

    body.append("project_data", JSON.stringify(halfBody));

    images.forEach(img => {
        body.append("images[]", img);
    });


    const result = await POST(url, body);

    if(result.status === 201) {
        document.querySelector(".projectSaveSuccessPopupMessage").classList.add("show");
        document.querySelector(".popUp").classList.remove("show");
        document.querySelector(".overlay").classList.remove("show");
        titleEl.value = "";
        descriptionEl.value = "";
        dateEl.value = "";
        const imagesContainer = document.querySelector(".imagesContainer");

        imagesContainer.innerHTML = "";
        setTimeout(() => {
            document.querySelector(".projectSaveSuccessPopupMessage").classList.remove("show");
        }, 3000);
    } else {
        //TODO
    }

}


(async () => {

    const url = "http://localhost:80/index.php/get-projects"

    const result = await GET(url);
    const projects = result.data;

    const projectsContainer = document.querySelector(".projectsContainer");

    const images = projects.map(img => 
        ({id: img.project_id, images: img.images})
    );

    console.log(images);

    projects.forEach((project, index) => {
        
        const projectBox = `
            <div class="project-box" data-project-id=${project.project_id}>
                <div class="project-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
                <img class="images" src="http://localhost:80/${project.images[0]}">
                <h1 class="projectName">${project.title}</h1>
                <h1 class="projectDate">${project.date}</h1>
                <p style="max-width: 80%; text-align: center;" class="par">${project.description}</p>
            </div>
        `;

        projectsContainer.insertAdjacentHTML("beforeend", projectBox);

        const box = projectsContainer.lastElementChild;

        box.style.animationDelay = `${0.2 + index * 0.15}s`;

    });

    projectsContainer.addEventListener("click", (event) => {

        if(event.target.closest(".edit-btn")) {
            return;
        }

        if (event.target.closest(".project-box")) {
            document.querySelector(".floatingImagesSlider").innerHTML = "";
            const project_id = event.target.closest(".project-box").dataset.projectId;

            const imgs = images.find(img => Number(img.id) === Number(project_id));
          
            imgs.images.forEach(img => {
                const floatingImages = `
                    <img src="http://localhost:80/${img}">
                `;

                document.querySelector(".floatingImagesSlider").insertAdjacentHTML("beforeend", floatingImages);
            });

            document.querySelector(".overlayForFloatingImages").classList.add("show");
      
            showFloatingImages(imgs.images.length);
        }
    });

}) ();

// images slider power 
function showFloatingImages (imagesLength) {
    const floatingImagesContainer = document.querySelector(".floatingImagesContainer");

    const floatingImagesSlider = document.querySelector(".floatingImagesSlider");

    floatingImagesSlider.style.transform = `translateX(0)`;

    const nextButton = document.querySelector(".nextButton");
    const prevButton = document.querySelector(".prevButton");

    const totalSlides = imagesLength;

    if (!nextButton) {
        return;
    }

    if (!prevButton) {
        return;
    }

    let currentSlide = 0;

    nextButton.addEventListener("click", (event) => {
        event.stopPropagation();
        currentSlide += 1;
        if (currentSlide > totalSlides - 1) {
            currentSlide = 0;
        }
        floatingImagesSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
    });

    prevButton.addEventListener("click", (event) => {
        event.stopPropagation();
        currentSlide -= 1;
        if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }
        floatingImagesSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
    });
}

(() => { 
    
    const overlayForFloatingImages = document.querySelector(".overlayForFloatingImages");

    document.querySelector(".floatingImagesSlider").addEventListener("click", (event) => {
        event.stopPropagation();
    })

    overlayForFloatingImages.addEventListener("click", () => {
        overlayForFloatingImages.classList.remove("show");
    });

}) ();

// TODO: 
function updateProject () {

    const url = `http://localhost:80/index.php/edit-project`;
    const body = {
        project_id: "",
        date: "",
        title: "",
        description: ""
    };

    UPDATE(url, body);

}

(() => {

    document.querySelector(".projectsContainer").addEventListener("click", async (event) => {
        if (event.target.closest(".edit-btn")) {
            event.stopPropagation();

            const projectId = event.target.closest(".project-box").dataset.projectId;

            const url = `http://localhost/index.php/get-project?id=${projectId}`;

            const result = await GET(url);

            const title = result.data.title;
            const date = result.data.date;
            const description = result.data.description;

            document.getElementById("editTitle").value = title;
            document.getElementById("editDate").value = date;
            document.getElementById("editDescription").value = description;

            document.querySelector(".editPanel").classList.add("show");

            // store ID
            document.getElementById("saveEdit").dataset.projectId = result.data.id;
        }
    });

    document.getElementById("closeEdit").onclick = () => {
        document.querySelector(".editPanel").classList.remove("show");
    };

    document.getElementById("cancelEdit").onclick = () => {
        document.querySelector(".editPanel").classList.remove("show");
    };

}) ();