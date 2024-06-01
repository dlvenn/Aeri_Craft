// navbar
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-icon').onclick = () => {
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
}

let header = document.querySelector('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('shadow', window.scrollY > 0);
});


// login
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    const loginBackground = document.querySelector('.login-background');
    
    const btnLoginPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');
  
    btnLoginPopup.addEventListener('click', () => {
      wrapper.classList.add('active-popup');
      loginBackground.style.display = 'block';
    });
  
    iconClose.addEventListener('click', () => {
      wrapper.classList.remove('active-popup');
      loginBackground.style.display = 'none';
    });
  
    const loginSection = document.getElementById('login');
    loginSection.addEventListener('click', function(event) {
      if (event.target === loginSection) {
        wrapper.classList.remove('active-popup');
        loginBackground.style.display = 'none';
      }
    });
});

