window.onload = function(){

    consultarAutenticacion();
    getPreguntas();
}


const db = firebase.firestore();
const audio = document.querySelector('#cancionActual');
const txtCancion = document.querySelector('#txtCancion');
const btnAceptar = document.querySelector('#btn-aceptar');
const divCancionCorrecta = document.querySelector('#cancion-correcta');
const divInputRespuesta = document.querySelector('#div-input');
const divContainerAyuda = document.querySelector('#ayuda__container');
const ayuda = document.querySelector('#btn-ayuda');
const loading = document.querySelector('#pantalla-loading');
let arrCanciones = new Array();
let cancionActual = 0;
let puntaje = 0;

var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple'
});
const timerDiv = document.querySelector('#timer');

function timer(){
    let tiempoTranscurrido = 200;
    let contador = setInterval(function(){

       timerDiv.innerHTML = tiempoTranscurrido;
       tiempoTranscurrido = tiempoTranscurrido - 5;

       if(tiempoTranscurrido < 0){
           clearInterval(contador);
           finalizar();
       }
    }, 5000);
}

const btnComenzar = document.querySelector('#btn-comenzar');
btnComenzar.addEventListener('click', function(){

    document.querySelector('#div-comoJugar').style.display = 'none';
    document.querySelector('#music-container').classList.remove('notblock');
    timer();
    siguienteCancion();
});


function getPreguntas(){

    let arrPreguntas = new Array();
    return db.collection('adivina_ut').get()
    .then(resp=>{
        return resp;
    }).then(spanShot =>{
        spanShot.forEach(doc => {

            arrData = doc.data();
            let arrActual = new Array();
            arrActual.push(arrData['cancion']);
            arrActual.push(arrData['correcta']);
            arrActual.push(arrData['artista']);
            arrActual.push(arrData['incorrecta1']);
            arrActual.push(arrData['incorrecta2']);
            if(arrData['img']){
                arrActual.push(arrData['img']);
            }

            arrPreguntas.push(arrActual);
             
         });
         
          
          arrCanciones = desordenar(arrPreguntas);
          //dameTodo(arrPreguntas);
          loading.style.display = 'none';
          timer();
        
    }).catch(err =>{
        console.log(err);
    });

}

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
  
    array = array.slice(0,5);
    return array;
}


function siguienteCancion(){
    
    if(cancionActual < 5){
    txtCancion.value = '';
    let cancion = arrCanciones[cancionActual][0];
    
    audio.innerHTML = '<audio controls id="reproductor"><source id="urlCancion" src="'+cancion+'" type="audio/mpeg"></audio>'
    let prueba = document.querySelector('#audioPrueba').getAttribute('src');
    wavesurfer.load(prueba);
    /*wavesurfer.on('ready', function () {
        wavesurfer.play();
    });*/
    cancionActual++;
    //reproductor.play();
    divContainerAyuda.innerHTML = '';
    divInputRespuesta.style.display = 'flex';
    setTimeout(function(){
       ayuda.classList.remove('notblock');
    }, 3000);
    reproducir();
    }else{
       finalizar();
    }
    
}

const play = document.querySelector('#btn-play');
play.addEventListener('click', function(){
    reproducir();
});

function reproducir(){
    const reproductor = document.querySelector('#reproductor');
    if(reproductor.paused || reproductor.ended){
        reproductor.play();
        play.innerHTML = '<i class="fas fa-step-forward"></i>' 
    }else{
        reproductor.pause();
        play.innerHTML = '<i class="fas fa-play">';
    }
}

function finalizar(){
    console.log('juego finalizado');
}

btnAceptar.addEventListener('click', function(){
    
    if(txtCancion.value != ''){
      reproducir();
      let textoIngresado = txtCancion.value;
      
      verificarRespuesta(1, textoIngresado.toLowerCase());
    }

});


function puntuar(puntos){

    puntaje += puntos;
}

ayuda.addEventListener('click', function(){

    respuestasRandom = [
        arrCanciones[cancionActual - 1][1],
        arrCanciones[cancionActual - 1][3],
        arrCanciones[cancionActual - 1][4]

    ];
    respuestasRandom.sort(() => Math.random() - 0.5);

    divInputRespuesta.style.display = 'none';

    divContainerAyuda.innerHTML = `<button class="posibles_respuesta btn btn-secondary" id="posibleResp0" onClick="respuestaConAyuda('`+respuestasRandom[0]+`')">`+respuestasRandom[0]+`</button>` + 
    `<button class="posibles_respuesta btn btn-secondary" id="posibleResp1" onClick="respuestaConAyuda('`+respuestasRandom[1]+`')">`+respuestasRandom[1]+`</button>` +
    `<button class="posibles_respuesta btn btn-secondary" id="posibleResp2" onClick="respuestaConAyuda('`+respuestasRandom[2]+`')">`+respuestasRandom[2]+`</button>`+
    `<div></div>`;

    ayuda.classList.add('notblock');
    

});


function respuestaConAyuda(respuesta){

    verificarRespuesta(2, respuesta.toLowerCase());
    reproducir();

}


function verificarRespuesta(opcion, respuesta){

    let cancion = arrCanciones[cancionActual - 1][1];
    let artista = arrCanciones[cancionActual - 1][2];
    let correcta = false;

    if(opcion === 1){
 
        
        if(cancion.toLowerCase() == respuesta){
            puntuar(500);
            correcta = true;
        }else if(artista.toLowerCase() == respuesta){
            puntuar(150);
            correcta = true;
        }


    }else if (opcion === 2){
       if(cancion.toLowerCase() == respuesta){
           puntuar(50);
           correcta = true;
       }
    }

    if(correcta){
        divCancionCorrecta.innerHTML = '<p class="correcto">CORRECTO!</p><div class="cancion__correcta"><i class="fas fa-compact-disc"></i>'+cancion+' - '+artista+'</div>';
    }else{
        divCancionCorrecta.innerHTML = '<p class="incorrecto">INCORRECTO!</p><div class="cancion__correcta"><i class="fas fa-compact-disc"></i>'+cancion+' - '+artista+'</div>';
    }
   
 
      let tiempo = setTimeout(function(){
        
        divCancionCorrecta.innerHTML = '';
        siguienteCancion();

      }, 4000);

}


function dameTodo(array){

    for(let i = 0; i < array.length; i++){
        console.log(array[i][1]);
    }

    console.log('--------------------');
    
    for(i = 0; i < arrCanciones.length; i++){
        console.log(arrCanciones[i][1]);
    }
    
}













