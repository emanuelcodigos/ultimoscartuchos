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

    console.log(e.offsetX);
    console.log(e.offsetY);
    respuesta(e);
    
});

const db = firebase.firestore();

function getPreguntas(){

db.collection('encontra_al_kinga').get()
.then(resp => {

    resp.forEach(element =>{
    arrPuntos.push(element.data());

    });

    principal();
});
}

let timer;
function principal(){
    
    if(preguntaActual < 10){
       divPregunta.innerHTML = arrPuntos[preguntaActual]['pregunta'];
       let temporizador = 16;
       timer = setInterval(function(){
            temporizador--;
            reloj.innerHTML = temporizador;

            if(temporizador == 0){
                preguntaActual++;
                mostrarCorrecta(0);
            }
        }, 1000);
        //preguntaActual++;
   }else{
       finalizar();
   }
}


function respuesta(e){
    if(intento < 2){

       let distancia = getDistancia(e, arrPuntos[preguntaActual]);
       if(distancia < 20){
           console.log('acertaste');  
           mostrarCorrecta(1);
           preguntaActual++;
       }
       intento++;
    }else{
     console.log('superaste tus intentos');
     mostrarCorrecta(0);
     preguntaActual++;
    }

}

let imagen = 'https://firebasestorage.googleapis.com/v0/b/ultimos-cartuchos.appspot.com/o/encontra_al_kinga%2Frespuestas%2Fmartin.jpg?alt=media&token=e5117693-343a-4f74-9585-00c375d2aad2';
function mostrarCorrecta(valor){
    clearInterval(timer);
    if(valor === 1){
       clase = 'correcto';
    }else{
        clase = 'incorrecto'; 
    }
    divCorrecta.classList.remove('notblock');
    divCorrecta.innerHTML = `<div class="respueta-correcta">
    <p class="`+clase+` animated">`+clase.toUpperCase()+`</p>
    <img src="`+imagen+`" alt="respueta correcta">
    </div>`;


   let time = setTimeout(function(){
     limpiar();
     principal();
   }, 5000);
}

function limpiar(){
    divCorrecta.innerHTML = '';
    divCorrecta.classList.add('notblock');
    intento = 0;
}





