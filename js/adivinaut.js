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
const divAyudaInfo = document.querySelector('#info-help');
const loading = document.querySelector('#pantalla-loading');
let arrCanciones = new Array();
let cancionActual = 0;
let puntaje = 0;


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
   document.querySelector('#pregCancion').classList.add('animated', 'tada');

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
  
    array = array.slice(0,7);
    return array;
}


function siguienteCancion(){
    
    
    if(cancionActual < 7){
    cancionDesconocida();
    txtCancion.value = '';
    let cancion = arrCanciones[cancionActual][0];
    
    audio.innerHTML = '<audio controls id="reproductor"><source id="urlCancion" src="'+cancion+'" type="audio/mpeg"></audio>'
    
    cancionActual++;
   
    divContainerAyuda.innerHTML = '';
    divInputRespuesta.style.display = 'flex';
    setTimeout(function(){
       divAyudaInfo.classList.remove('notblock');
       divAyudaInfo.classList.add('animated','shakeX');
    }, 3000);
    
    reproducir(true);
    }else{
       finalizar();
    }
}


function reproducir(status){
    let play = document.querySelector('#btn-play');
    const reproductor = document.querySelector('#reproductor');
    if(reproductor.paused || reproductor.ended){
        if(status){ 
            reproductor.play();
            play.innerHTML = '<i class="fas fa-step-forward"></i>';
        }
    }else{
         
        reproductor.pause();
        play.innerHTML = '<i class="fas fa-play">';
            
    }
}


btnAceptar.addEventListener('click', function(){
    
    if(txtCancion.value != ''){
      reproducir(false);
      let textoIngresado = txtCancion.value;
      textoIngresado = quitarAcentos(textoIngresado);

      verificarRespuesta(1, textoIngresado.toLowerCase());
    }

});

function quitarAcentos(cadena){
	const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
	return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
}

function puntuar(puntos){

    puntaje += puntos;
}

ayuda.addEventListener('click', function(){

    divAyudaInfo.classList.add('notblock');
    divAyudaInfo.classList.remove('shakeX');

    respuestasRandom = [
        arrCanciones[cancionActual - 1][1],
        arrCanciones[cancionActual - 1][3],
        arrCanciones[cancionActual - 1][4]

    ];
    respuestasRandom.sort(() => Math.random() - 0.5);

    divInputRespuesta.style.display = 'none';
    divContainerAyuda.classList.add('animated', 'jello');
    divContainerAyuda.innerHTML = `<button class="posibles_respuesta btn btn-secondary" id="posibleResp0" onClick="respuestaConAyuda('`+respuestasRandom[0]+`')">`+respuestasRandom[0]+`</button>` + 
    `<button class="posibles_respuesta btn btn-secondary" id="posibleResp1" onClick="respuestaConAyuda('`+respuestasRandom[1]+`')">`+respuestasRandom[1]+`</button>` +
    `<button class="posibles_respuesta btn btn-secondary" id="posibleResp2" onClick="respuestaConAyuda('`+respuestasRandom[2]+`')">`+respuestasRandom[2]+`</button>`+
    `<div></div>`;

    

});


function respuestaConAyuda(respuesta){

    reproducir(false);
    verificarRespuesta(2, respuesta.toLowerCase());
    

}

function verificarRespuesta(opcion, respuesta){

    let cancion = arrCanciones[cancionActual - 1][1];
    let artista = arrCanciones[cancionActual - 1][2];
    let correcta = false;
    let divResultado = document.querySelector('#div-reproductor');

    if(opcion === 1){
 
        cancion = quitarAcentos(cancion);
        artista = quitarAcentos(artista);
        
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
        divResultado.innerHTML = '<p class="correcto animated swing">CORRECTO!</p>';
    }else{
        divResultado.innerHTML = '<p class="incorrecto animated swing">INCORRECTO!</p>';
    }

    divCancionCorrecta.innerHTML = '<div class="cancion__correcta animated jello"><i class="fas fa-compact-disc"></i>'+cancion+' - '+artista+'</div>';
    console.log(puntaje);
      let tiempo = setTimeout(function(){
        
        divCancionCorrecta.innerHTML = '';
        siguienteCancion();

      }, 4000);

}


function cancionDesconocida(){

    let divResultado = document.querySelector('#div-reproductor');
    divResultado.innerHTML = `<div class="div__music--div">
    
    <div class="music__grid--circle animated headShake" id="btn-play"><i class="fas fa-play"></i></div>
    
    <div class="div__music--text">
        <p class="principal">Adivina Adivina UT</p>
        <p>Cancion desconocida</p>
        <p>Artista desconocido</p>
    </div>
    </div>`;

    let play = document.querySelector('#btn-play');
    play.addEventListener('click', function(){
    reproducir(true);
   
});

}

function finalizar(){
    console.log('juego finalizado');

    let global = document.querySelector('#music-container');
    global.innerHTML = `<div class="card text-center">
    <div class="card-header">
      Featured
    </div>
    <div class="card-body">
      <h5 class="card-title">Special title treatment</h5>
      <p class="card-text">Tu puntaje fue `+ puntaje+`.</p>
      <a href="#" class="btn btn-primary">Volver a jugar</a>
    </div>
    <div class="card-footer text-muted">
      Jue
    </div>
  </div>`
}














