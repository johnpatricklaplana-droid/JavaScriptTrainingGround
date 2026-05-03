(() => {

    let isOpen = false;

    const swipeButtonToOpenNav = document.querySelector(".swipeButtonToOpenNav");
    const navMobileVersion = document.querySelector(".navMobileVersion");
    const rightOne = document.querySelector(".rightOne");
    const leftOne = document.querySelector(".leftOne");

    swipeButtonToOpenNav.addEventListener("click", () => {
        if(isOpen) {
            swipeButtonToOpenNav.classList.remove("hide");
            navMobileVersion.classList.remove("show");
            rightOne.classList.remove("show");
            leftOne.classList.remove("hide");
            swipeButtonToOpenNav.classList.remove("hide");
            isOpen = false;
        } else {
            swipeButtonToOpenNav.classList.add("hide");
            navMobileVersion.classList.add("show");
            rightOne.classList.add("show");
            leftOne.classList.add("hide");
            isOpen = true;
        }
    });

}) ();