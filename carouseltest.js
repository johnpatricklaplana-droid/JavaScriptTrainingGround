const carouselContainer = document.querySelector(".carousel-container");
const carouselSlider = document.querySelector(".carousel-slider");
const carouselItems = document.querySelectorAll(".carousel-item");

const next = document.getElementById("next");
const prev = document.getElementById("prev");

let currrentImage = 0;

reset();

next.addEventListener("click", () => {

    currrentImage++;

    carouselItems.forEach((car, i) => {
        if(i === currrentImage) {
            car.classList.add("active");
        } else {
            car.classList.remove("active");
        }
    });

    if(currrentImage >= carouselItems.length) {
        carouselSlider.style.transform = `translateX(0)`;
        currrentImage = 0;
        reset();
        return;
    }

    carouselSlider.style.transform = `translateX(-${currrentImage * 100}%)`;
});

function reset () {
    carouselItems[0].classList.add("active");
}