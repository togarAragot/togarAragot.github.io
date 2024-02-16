const hamburger = document.querySelector(".hamburger");
const navUl = document.getElementById("navlist");

hamburger.addEventListener("click", () =>{
    hamburger.classList.toggle("active");
    navUl.classList.toggle("active");
});