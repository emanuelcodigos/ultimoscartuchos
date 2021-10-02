window.onload = function(){
 
    consultarAutenticacion();
    getPreguntas();
}

const db = firebase.firestore();
//const loading = document.querySelector('#divLoading');
const reloj = document.querySelector('#reloj');
const preg = document.querySelector('#pregunta');
const resp1 = document.querySelector('#resp1');
const resp2 = document.querySelector('#resp2');
const resp3 = document.querySelector('#resp3');
const imgPregunta = document.querySelector('#imgPregunta');

const loading = document.querySelector('#pantalla-loading');
const btnComenzar = document.querySelector('#btn-comenzar');
const divComoJugar = document.querySelector('#div-comoJugar');
const divContenidoPrincipal = document.querySelector('#pantalla-juego');
const divPosResp = document.querySelector('#div-posResp');
const divResultado = document.querySelector('#resultado');

let preguntasAcertadas = 0;
let puntosTotales = 0;
let preguntActual = 1; 
let arrPrincipal = new Array();
let click = false;
let contador;

resp1.addEventListener('click', function(){
    
    resp = resp1.value;
    if(click === false){
        click = true;
        contarPuntaje(resp, 1);
    }
});

resp2.addEventListener('click', function(){
    resp = resp2.value;
    
    if(click === false){
        click = true;
        contarPuntaje(resp, 2);
    }
});

resp3.addEventListener('click', function(){
    resp = resp3.value;
    if(click === false){
        click = true;
        contarPuntaje(resp, 3);
    }
});


function desordenar(array) {
    var currentIndex = array.length; 
    var temporaryValue;
    var randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    array = array.slice(0,10);
    return array;
}

function getPreguntas(){

    let arrPreguntas = new Array();
    return db.collection('trivia').get()
    .then(resp=>{
        return resp;
    }).then(spanShot =>{
        spanShot.forEach(doc => {
            arrData = doc.data();
            arrPrincipal.push(arrData);
         });
         
          arrPrincipal = desordenar(arrPrincipal);
          loading.style.display = 'none';
          btnComenzar.classList.add('jello');

    }).catch(err =>{
        console.log(err);
    });

}

btnComenzar.addEventListener('click', function(){
    divComoJugar.classList.add('notblock');
    divContenidoPrincipal.classList.remove('notblock');
    principal();
});

function contarPuntaje(respuesta, opcion){
    clearInterval(contador);
    if(respuesta == arrPrincipal[preguntaNumeroActual]['correcta']){
         puntosTotales += 500;
         preguntasAcertadas++;
         mostrarCorrecta(true, opcion);
         divResultado.innerHTML = '<div class="correcto animated tada">CORRECTO!</div>';
     }else{
        mostrarCorrecta(false, opcion);
        divResultado.innerHTML = '<div class="incorrecto animated tada">INCORRECTO!</div>';  
     }
}


let preguntaNumeroActual = 0;

function llenarCampos(){
    let respuestasRandom = new Array();
    respuestasRandom[0] = arrPrincipal[preguntaNumeroActual]['correcta'];
    respuestasRandom[1] = arrPrincipal[preguntaNumeroActual]['falsa1'];
    respuestasRandom[2] = arrPrincipal[preguntaNumeroActual]['falsa2'];
    
    respuestasRandom.sort(() => Math.random() - 0.5);
    
    preg.innerHTML = arrPrincipal[preguntaNumeroActual]['pregunta'];
    preg.classList.add('headShake');
    if(arrPrincipal[preguntaNumeroActual]['imagen']){ 
    imgPregunta.src = arrPrincipal[preguntaNumeroActual]['imagen'];
    }
    resp1.innerHTML = respuestasRandom[0];
    resp2.innerHTML = respuestasRandom[1];
    resp3.innerHTML = respuestasRandom[2];
    resp1.value = respuestasRandom[0];
    resp2.value = respuestasRandom[1];
    resp3.value = respuestasRandom[2];
}

function principal(){

    let temporizador = 15;
    reloj.style.color = 'black'; 

    if(preguntaNumeroActual < 10){

        llenarCampos();
        contador = setInterval(function(){
           
            reloj.innerHTML = temporizador;
            if(temporizador == 5){
               reloj.style.color = 'red'; 
            }
            if(temporizador === 0){
                contarPuntaje('respuesta incorrecta'); 
             }
             temporizador--;

        },1000);
        
    }else{
        clearInterval(contador);
        finalizar(puntosTotales, 10,preguntasAcertadas);
    }
}


function mostrarCorrecta(acierto, opcion){

    resp1.style.background = '#da4646'; 
    resp2.style.background = '#da4646'; 
    resp3.style.background = '#da4646';
    divPosResp.classList.add('jello');

    if(acierto){
        if(parseInt(opcion) === 1){
            resp1.style.background = '#68da73';
        }else if(parseInt(opcion) === 2){
            resp2.style.background = '#68da73';
        }else{
            resp3.style.background = '#68da73';
        }
        
    }else{
        if(resp1.value == arrPrincipal[preguntaNumeroActual]['correcta']){
            resp1.style.background = '#68da73';
        }else if(resp2.value == arrPrincipal[preguntaNumeroActual]['correcta']){
            resp2.style.background = '#68da73'; 
        }else{
            resp3.style.background = '#68da73';
        }
        
    }
    preguntaNumeroActual++;

    let timeLoading = setTimeout(function(){
        
        resp1.style.background = '#dddca5'; 
        resp2.style.background = '#dddca5'; 
        resp3.style.background = '#dddca5';
        imgPregunta.src = '';
        click = false;
        divPosResp.classList.remove('jello');
        preg.classList.remove('headShake');
        divResultado.innerHTML = '';
        principal();

    }, 3000);
}


