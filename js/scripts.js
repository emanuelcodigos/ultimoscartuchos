
window.onload = function(){
 
    consultarAutenticacion();
}
window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-times');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-times');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-times');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};


function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

if(document.querySelector('#img-logo')){
    const audioIntroUc = new Audio('assets/intro.mp3');
    
    let logo = document.querySelector('#img-logo');
    let i = 0;
    let timerLogo = setTimeout(function(){

        logo.classList.add('animated', 'bounceInDown');
        
        let timerLoop = setInterval(function(){
            if(logo.classList.contains('bounceInDown')){
                logo.classList.remove('bounceInDown');
            }
            logo.classList.remove('rubberBand');
            setTimeout(function(){
                logo.classList.add('rubberBand');
            },1000);
    
        }, 3000);

    }, 1000);

    let timerBtn = setTimeout(function(){

        let btns = document.querySelector('#btn-animated');
        btns.classList.add('animated', 'jello');

    }, 2500);

    function pausarIntro(){
        let btnAudio = document.querySelector('#btn-audio-intro');
         if(audioIntroUc.paused || audioIntroUc.ended){
            audioIntroUc.play();
            btnAudio.innerHTML = 'Pausar musica';
         }else{
           audioIntroUc.pause();
           btnAudio.innerHTML = 'Reanudar musica';
         }
    }
   
}

if(document.querySelector('#icon-coffee')){
    
    let botonMostrado = false;
    let btnCoffee = document.querySelector('#boton-coffee');
    
    btnCoffee.addEventListener('click', function(){
        let descripCoffee = document.querySelector('.descripcion-icon-coffee');
        descripCoffee.classList.toggle('notblock');
    });
    window.addEventListener('scroll', function(){
        if(!botonMostrado){
            
            mostrarBtnCoffee();

        }
    
    });

    function mostrarBtnCoffee(){
        const btnCoffee = document.querySelector('#icon-coffee');
        btnCoffee.classList.remove('notblock');
        botonMostrado = true;
    }
}


