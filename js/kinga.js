window.onload = function(){
    consultarAutenticacion();
    img.src = 'https://firebasestorage.googleapis.com/v0/b/ultimos-cartuchos.appspot.com/o/encontra_al_kinga%2Fkinga1.jpg?alt=media&token=01bb3911-f43b-48ab-98df-a263233f2c1a';
    getPreguntas();
}
const WIDTH = 750;
const HEIGH = 375;
const divMap = document.querySelector('#map');
const divPregunta = document.querySelector('#pregunta');
const divCorrecta = document.querySelector('#div-respuesta');
const arrPuntos = new Array();
const img = document.querySelector('#map-img');
let preguntaActual = 0;
let reloj = document.querySelector('#reloj');
let intento = 0;

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

function getPreguntas(){

db.collection('encontra_al_kinga').where('mapa','==', 1).get()
.then(resp => {

    resp.forEach(element =>{
    arrPuntos.push(element.data());

    });
    arrPuntos.sort(() => Math.random() - 0.5);
    principal();
});
}

let timer;
function principal(){
    
    if(preguntaActual < 10){
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
       finalizar();
   }
}


function respuesta(e){
    if(intento < 2){

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


function finalizar(){
    console.log('finalizado');
}





