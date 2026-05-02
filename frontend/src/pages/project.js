import { DELETE, GET, POST, UPDATE } from "../api/crud.js";

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

    const url = "http://localhost:80/JavaScriptTrainingGround/backend/src/index.php/save-project"

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
<<<<<<< HEAD:frontend/src/pages/project.js

        fetctProjects();

=======
>>>>>>> 8e6bbdc04c867fcc9a46a161505a72b997a608c9:project.js
    } else if(result.status === 401) {
        document.querySelector(".authModal").classList.add("show");
    }

}


(() => {

    fetctProjects();

}) ();

const alreadyExistProjectId = [];

async function fetctProjects() {
    const url = "http://localhost:80/JavaScriptTrainingGround/backend/src/index.php/get-projects"

    const result = await GET(url);
    const projects = result.data;

    const projectsContainer = document.querySelector(".projectsContainer");

    const images = projects.map(img =>
        ({ id: img.project_id, images: img.images })
    );

    console.log(images);

    projects.forEach((project, index) => {

        if(alreadyExistProjectId.includes(project.project_id)) {
            return;
        }

        const projectBox = `
            <div class="project-box" data-projectbox-id=${project.project_id}>
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

        alreadyExistProjectId.push(project.project_id);

        projectsContainer.insertAdjacentHTML("beforeend", projectBox);

        const box = projectsContainer.lastElementChild;

        box.style.animationDelay = `${0.2 + index * 0.15}s`;

    });

    projectsContainer.addEventListener("click", (event) => {

        if (event.target.closest(".edit-btn")) {
            return;
        }

        if (event.target.closest(".delete-btn")) {
            return;
        }

        if (event.target.closest(".project-box")) {
            document.querySelector(".floatingImagesSlider").innerHTML = "";
            const project_id = event.target.closest(".project-box").dataset.projectboxId;

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
}

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
async function updateProject (projectId) {

    const titleEl = document.getElementById("editTitle");
    const dateEl = document.getElementById("editDate");
    const descriptionEl = document.getElementById("editDescription");

    const title = titleEl.value.trim();
    const date = dateEl.value.trim();
    const description = descriptionEl.value.trim();

    const url = `http://localhost:80/JavaScriptTrainingGround/backend/src/index.php/edit-project`;
    const body = {
        project_id: projectId,
        date: date,
        title: title,
        description: description
    };

    const result = await UPDATE(url, body);
   
    if(result.status === 204) {
        const projectBox = document.querySelector(`[data-projectbox-id="${projectId}"]`);
       
        projectBox.querySelector(".projectName").innerText = title;
        projectBox.querySelector("p").innerText = description;
        projectBox.querySelector(".projectDate").innerText = date;
    } else if(result.status === 401) {
        const message = document.getElementById("toast");
        message.innerText = "You do not have permission to edit this.";
        message.classList.add("show");

        setTimeout(() => {
            message.classList.remove("show");
        }, 3000);
    }

}

(() => {

    document.querySelector(".projectsContainer").addEventListener("click", async (event) => {
        if (event.target.closest(".edit-btn")) {
            event.stopPropagation();

            const projectId = event.target.closest(".project-box").dataset.projectboxId;

            const url = `http://localhost:80/JavaScriptTrainingGround/backend/src/index.php/get-project?id=${projectId}`;

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

    document.addEventListener("click", (event) => {

        if (event.target.closest(".editPanel")) {
            return;
        }

        document.querySelector(".editPanel").classList.remove("show");

    });

    document.getElementById("saveEdit").addEventListener("click", (event) => {

        const projectId = event.target.dataset.projectId;

        updateProject(projectId);
        
    });

}) ();

// authentication
(() => {
     
    const authModal = document.querySelector(".authModal");
    const confirmBtn = document.getElementById("confirmAuth");
    const cancelBtn = document.getElementById("cancelAuth");
    const errorText = document.querySelector(".authError");

    cancelBtn.addEventListener("click", () => {
        authModal.classList.remove("show");
    });

<<<<<<< HEAD:frontend/src/pages/project.js
    confirmBtn.addEventListener("click", () => login());

}) ();

// show login modal
(() => {
    
    const login = document.querySelector(".login");
    const authModal = document.querySelector(".authModal");

    login.addEventListener("click", () => {
        authModal.classList.add("show");
    });

}) ();

async function login() {
    const password = document.getElementById("adminPassword").value;
    const authModal = document.querySelector(".authModal");

    const url = "http://localhost:80/JavaScriptTrainingGround/backend/src/index.php/auth";
    const body = {
        password: password
    }

    const result = await POST(url, JSON.stringify(body));

    if (result.authenticated) {
        authModal.classList.remove("show");
        document.querySelector(".popUp").classList.add("show");
        document.querySelector(".overlay").classList.add("show");
    } else {
        errorText.classList.add("show");
    }
}

(() => {
    
    const deleteModal = document.getElementById("deleteModal");
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");

    let targetProjectId = null;

    let projectBox;

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            projectBox = e.target.closest(".project-box");
            targetProjectId = projectBox.dataset.projectboxId; 
            
            deleteModal.classList.add("show");
        }
    });

    cancelDelete.addEventListener("click", () => {
        deleteModal.classList.remove("show");
        targetProjectId = null;
    });

    confirmDelete.addEventListener("click", async () => {
        if (!targetProjectId) return;

        const url = "http://localhost:80/JavaScriptTrainingGround/backend/src/index.php/delete-project";
        const body = {
            project_id: targetProjectId
        }

        const result = await DELETE(url, body);

        const message = document.getElementById("toast");

        if(result.status === 200) {
            message.innerText = result.message;
            message.classList.add("show");

            setTimeout(() => {
                message.classList.remove("show");
            }, 3000);

            projectBox.remove();
        } else if(result.status === 401) {
            message.innerText = "You do not have permission to delete this.";
            message.classList.add("show");

            setTimeout(() => {
                message.classList.remove("show");
            }, 3000);
        }

        deleteModal.classList.remove("show");
        targetProjectId = null;

    });

}) ();
=======
    confirmBtn.addEventListener("click", async () => {
        const password = document.getElementById("adminPassword").value;

        const url = "http://localhost:80/index.php/auth";
        const body = {
            password: password
        }

        const result = await POST(url, JSON.stringify(body));

        if (result.authenticated) {
            authModal.classList.remove("show");
            document.querySelector(".popUp").classList.add("show");
            document.querySelector(".overlay").classList.add("show");
        } else {    
            errorText.classList.add("show");
            window.isAuthenticated = result.authenticated;
        }
    });

}) ();
>>>>>>> 8e6bbdc04c867fcc9a46a161505a72b997a608c9:project.js
