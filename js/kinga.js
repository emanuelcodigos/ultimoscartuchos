window.onload = function(){
    consultarAutenticacion();
}
const WIDTH = 750;
const HEIGH = 375;
const divMap = document.querySelector('#map');
const divPregunta = document.querySelector('#pregunta');
const divCorrecta = document.querySelector('#div-respuesta');
const loading = document.querySelector('#pantalla-loading');
const divContenidoPrincipal  = document.querySelector('#pantalla-juego');
const divResultado = document.querySelector('#resultado');
const arrPuntos = new Array();
const img = document.querySelector('#map-img');
let preguntaActual = 0;
let respuestasCorrectas = 0;
let puntaje = 0;
let reloj = document.querySelector('#reloj');
let intento = 0;
let divElegirMapa = document.querySelector('#comenzarJuego');

let getDistancia = (e, target) => {
    
    let difX = e.offsetX - target['x'];
    let difY = e.offsetY - target['y'];

    return Math.sqrt((difX * difX) + (difY * difY));
}

img.addEventListener('click', function(e){

    /*console.log(e.offsetX);
    console.log(e.offsetY);*/
    respuesta(e);   
});


const db = firebase.firestore();

const cardMapaUno = document.querySelector('#cardMapaUno');
cardMapaUno.addEventListener('click', function(){
    elegirMapa(cardMapaUno.getAttribute('value'));
});
const cardMapaDos = document.querySelector('#cardMapaDos');
cardMapaDos.addEventListener('click', function(){
    elegirMapa(cardMapaDos.getAttribute('value'));
});
function elegirMapa(mapa){
     getPreguntas(mapa);
}


function getPreguntas(mapa){
loading.style.display = 'flex';  
img.src = `../assets/img/kinga`+mapa+`.jpg`;
db.collection('encontra_al_kinga').where('mapa','==', parseInt(mapa)).get()
.then(resp => {

    resp.forEach(element =>{
    arrPuntos.push(element.data());

    });
    arrPuntos.sort(() => Math.random() - 0.5);
    
    loading.style.display = 'none';
    divElegirMapa.innerHTML = '';
    divContenidoPrincipal.classList.remove('notblock');
    principal();
    
});
}

let timer;
function principal(){
    
    if(preguntaActual < 3){
       divPregunta.innerHTML = 
       `<p class="pregunta-fijo">TENES QUE ENCONTRAR</p>
       <p class="div__pregunta-pregunta animated tada">`+arrPuntos[preguntaActual]['pregunta']+`</p>`;
       let temporizador = 16;
       timer = setInterval(function(){
            temporizador--;
            reloj.innerHTML = temporizador;

            if(temporizador === 0){
                mostrarCorrecta(0);
                preguntaActual++;
            }
        }, 1000);
        
   }else{
       finalizar(puntaje, 10,respuestasCorrectas);
   }
}


function respuesta(e){
    if(intento === 1){
       let distancia = getDistancia(e, arrPuntos[preguntaActual]);
        if(distancia < 20){ 
            mostrarCorrecta(1);
            preguntaActual++;
        }else{
            mostrarCorrecta(0);
            preguntaActual++;
        }
    }else if(intento === 0){
        let distancia = getDistancia(e, arrPuntos[preguntaActual]);
        if(distancia < 20){ 
            mostrarCorrecta(1);
            preguntaActual++;
        }  
        intento++;
    }else{
        mostrarCorrecta(0);
        preguntaActual++;
    }
}

function mostrarCorrecta(valor){
    clearInterval(timer);
    if(valor === 1){
       clase = 'correcto';
       divCorrecta.style.background = 'linear-gradient(0deg, rgba(57,142,39,1) 0%, rgba(101,176,85,1) 47%, rgba(58,97,48,1) 100%)';
       puntaje += 100;
    }else{
        clase = 'incorrecto'; 
        divCorrecta.style.background = 'linear-gradient(0deg, rgb(142 39 39) 0%, rgb(176 85 85) 47%, rgb(97 48 48) 100%)';
    }

    divCorrecta.classList.remove('notblock');
    divCorrecta.innerHTML = 
    `<div class="respueta-correcta">
    <p class="`+clase+` animated rubberBand">`+clase.toUpperCase()+`</p>
    </div>`;


   let time = setTimeout(function(){
     limpiar();
     let intento = document.querySelector('#intento-actual');
     intento.innerHTML = (preguntaActual + 1) +'/10';
     principal();
   }, 5000);
}

function limpiar(){
    divCorrecta.innerHTML = '';
    divCorrecta.classList.add('notblock');
    intento = 0;
}






