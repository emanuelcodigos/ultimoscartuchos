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

let puntosTotales = 0;
let preguntActual = 1; 
let arrPrincipal;
let click = false;

resp1.addEventListener('click', function(){
    
    resp = resp1.value;
    if(click === false){
        click = true;
        contarPuntaje(resp);
    }
});

resp2.addEventListener('click', function(){
    resp = resp2.value;
    
    if(click === false){
        click = true;
        contarPuntaje(resp);
    }
});

resp3.addEventListener('click', function(){
    resp = resp3.value;
    if(click === false){
        click = true;
        contarPuntaje(resp);
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
            let arrActual = new Array();
            arrActual.push(arrData['pregunta']);
            arrActual.push(arrData['correcta']);
            arrActual.push(arrData['falsa1']);
            arrActual.push(arrData['falsa2']);
            if(arrData['imagen']){
                arrActual.push(arrData['imagen']);
            }

            arrPreguntas.push(arrActual);
             
         });
         
          arrPrincipal = desordenar(arrPreguntas);
          loading.style.display = 'none';
          btnComenzar.classList.add('jello');
          //principal();


    }).catch(err =>{
        console.log(err);
    });

}

btnComenzar.addEventListener('click', function(){
    divComoJugar.classList.add('notblock');
    divContenidoPrincipal.classList.remove('notblock');
    principal();
});

function contarPuntaje(respuesta){
     if(respuesta === arrPrincipal[preguntaNumeroActual][1]){
        
         puntosTotales += 500;
         divResultado.innerHTML = '<div class="correcto animated tada">CORRECTO!</div>';
     }else{
        divResultado.innerHTML = '<div class="incorrecto animated tada">INCORRECTO!</div>';
     }
}


let preguntaNumeroActual = 0;

function llenarCampos(){

    respuestasRandom = [
        arrPrincipal[preguntaNumeroActual][1],
        arrPrincipal[preguntaNumeroActual][2],
        arrPrincipal[preguntaNumeroActual][3]

    ];
    respuestasRandom.sort(() => Math.random() - 0.5);

    preg.innerHTML = arrPrincipal[preguntaNumeroActual][0];
    preg.classList.add('headShake');
    if(arrPrincipal[preguntaNumeroActual][4]){ 
    imgPregunta.src = arrPrincipal[preguntaNumeroActual][4];
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
    let inc = 'respuesta incorrecta';
    reloj.style.color = 'black'; 
    let contador = setInterval(function(){
    
        reloj.innerHTML = temporizador;
        temporizador--;

        if(temporizador == 4){
           reloj.style.color = 'red'; 
        }

        if(temporizador < 0){
           clearInterval(contador);
           contarPuntaje(inc);
           preguntaNumeroActual++;
           mostrarCorrecta();
           
        }
        if(click === true){
            clearInterval(contador);
            preguntaNumeroActual++;
            mostrarCorrecta();
        }
        if(preguntaNumeroActual >= 10){
            clearInterval(contador);
        }

    }, 1000);

    if(preguntaNumeroActual < 2){
        llenarCampos();
    }else{
        clearInterval(contador);
        finalizar(puntosTotales);
    }
    
}


function mostrarCorrecta(){

    resp1.style.background = '#da4646'; 
    resp2.style.background = '#da4646'; 
    resp3.style.background = '#da4646';
    divPosResp.classList.add('jello');

    if(resp1.value === arrPrincipal[preguntaNumeroActual - 1][1]){
      resp1.style.background = '#68da73';
    }else if (resp2.value === arrPrincipal[preguntaNumeroActual - 1][1]){
      resp2.style.background = '#68da73';
    }else{
        resp3.style.background = '#68da73';
    }
    
    time = setTimeout(function(){
        resp1.style.background = '#e4e4ef'; 
        resp2.style.background = '#e4e4ef'; 
        resp3.style.background = '#e4e4ef';
        imgPregunta.src = '';
        click = false;
        divPosResp.classList.remove('jello');
        preg.classList.remove('headShake');
        divResultado.innerHTML = '';
        principal();

    }, 3000);
}


