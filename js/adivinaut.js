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
const divContenidoPrincipal = document.querySelector('#pantalla-juego');
const divTimer = document.querySelector('#timer');
let arrCanciones = new Array();
let cancionActual = 0;
let respuestasCorrectas = 0;
let puntaje = 0;
let temporizador;
const btnComenzar = document.querySelector('#btn-comenzar');
btnComenzar.addEventListener('click', function(){

    document.querySelector('#div-comoJugar').style.display = 'none';
    document.querySelector('#music-container').classList.remove('notblock');
    principal();
   document.querySelector('#pregCancion').classList.add('animated', 'tada');

});


function getPreguntas(){

    return db.collection('adivina_adivina_ut').get()
    .then(resp=>{
        return resp;
    }).then(spanShot =>{
        spanShot.forEach(doc => {
            arrCanciones.push(doc.data());  
         });
          arrCanciones = desordenar(arrCanciones);
          loading.style.display = 'none'; 
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


function principal(){
    if(cancionActual < 7){
        txtCancion.value = '';
        cancionDesconocida();
        let cancion = arrCanciones[cancionActual]['cancion'];
        let duracion = arrCanciones[cancionActual]['duracion'] + 15;
        audio.innerHTML = '<audio controls id="reproductor"><source id="urlCancion" src="'+cancion+'" type="audio/mpeg"></audio>';
     
        temporizador = setInterval(function(){
            duracion--;
            divTimer.innerHTML = duracion;
            if(duracion == 15){
                divTimer.style.color = '#ffffff';
                divTimer.style.backgroundColor = '#e84949';
            }
            if(duracion == 0){
               clearInterval(temporizador);
               verificarRespuesta(0,'falsa');
            }
        }, 1000);
        divContainerAyuda.innerHTML = '';
        divInputRespuesta.style.display = 'flex';
        reproducir(true);
        setTimeout(function(){
            setCancionActualJugador();
         }, 3000);
        
    }else{
        finalizar(puntaje, 7, respuestasCorrectas);
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
        arrCanciones[cancionActual]['correcta'],
        arrCanciones[cancionActual]['incorrecta1'],
        arrCanciones[cancionActual]['incorrecta2']
    ];
    respuestasRandom.sort(() => Math.random() - 0.5);

    divInputRespuesta.style.display = 'none';
    divContainerAyuda.classList.add('jello');
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
    clearInterval(temporizador);
    let cancion = arrCanciones[cancionActual]['correcta'];
    let artista = arrCanciones[cancionActual]['artista'];
    let correcta = false;
    let divResultado = document.querySelector('#div-reproductor');

    if(opcion === 1){
 
        cancion = quitarAcentos(cancion);
        artista = quitarAcentos(artista);
        
        if(cancion.toLowerCase() == respuesta){
            puntuar(500);
            respuestasCorrectas++;
            correcta = true;
        }else if(artista.toLowerCase() == respuesta){
            puntuar(250);
            respuestasCorrectas++;
            correcta = true;
        }

    }else if (opcion === 2){
       if(cancion.toLowerCase() == respuesta){
           puntuar(100);
           respuestasCorrectas++;
           correcta = true;
       }
    }

    if(correcta){
        divResultado.innerHTML = '<p class="correcto animated swing">CORRECTO!</p>';
    }else{
        divResultado.innerHTML = '<p class="incorrecto animated swing">INCORRECTO!</p>';
    }

    divCancionCorrecta.innerHTML = '<div class="cancion__correcta animated jello"><i class="fas fa-compact-disc"></i>'+cancion+' - '+artista+'</div>';
    divContainerAyuda.classList.remove('jello');
    cancionActual++;
      let tiempo = setTimeout(function(){
        
        divCancionCorrecta.innerHTML = '';
        principal();

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
    divTimer.style.color = '#161616';
    divTimer.style.backgroundColor = '#e0e0e0';
    let play = document.querySelector('#btn-play');
    play.addEventListener('click', function(){
    reproducir(true);
   
});

}

function setCancionActualJugador(){
    divAyudaInfo.classList.remove('notblock');
    divAyudaInfo.classList.add('animated','shakeX');

    let infoActual = document.querySelector('#numero-actual');
    infoActual.innerHTML = `<i class="fas fa-music"></i><p>`+ (cancionActual + 1)+`/7</p>`; 

}















