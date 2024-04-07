let menu = document.querySelector('.navbar-toggler'); 
let navbar = document.querySelector('.navbar-links'); 
console.log("hello");

menu.onclick = () => {
    navbar.classList.toggle('active');
    console.log('clicked');
};


window.onscroll = () => {
    navbar.classList.remove('active');
};
