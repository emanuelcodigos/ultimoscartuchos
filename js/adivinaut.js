window.onload = function(){

    consultarAutenticacion();
    getPreguntas();
}


const db = firebase.firestore();
const audio = document.querySelector('#cancionActual');
const txtCancion = document.querySelector('#txtCancion');
const btnAceptar = document.querySelector('#btn-aceptar');
const divCancionCorrecta = document.querySelector('#cancion-correcta');

let tiempoTranscurrido = 180;
let arrCanciones;
let cancionActual = 0;
let puntaje = 0;

var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple'
});

function timer(){
    const timer = document.querySelector('#timer');

    let contador = setInterval(function(){
       timer.innerHTML = tiempoTranscurrido;
       tiempoTranscurrido--;

       if(tiempoTranscurrido < 0){
           clearInterval(contador);
           alert('juego finalizado');
           finalizar();
       }
    }, 1000);
}

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
            if(arrData['img']){
                arrActual.push(arrData['img']);
            }

            arrPreguntas.push(arrActual);
             
         });
         
          arrCanciones = desordenar(arrPreguntas);
          console.log('listo');
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
    reproducir();
    }else{
       finalizar();
    }
    
}

const siguiente = document.querySelector('#siguiente');
siguiente.addEventListener('click', function(){
    siguienteCancion();
});

const play = document.querySelector('#btn-play');
play.addEventListener('click', function(){
    
    reproducir();
});

function reproducir(){
    const reproductor = document.querySelector('#reproductor');
    if(reproductor.paused || reproductor.ended){
        reproductor.play();
    }else{
        reproductor.pause();
    }
}

function finalizar(){
    console.log('juego finalizado');
}

btnAceptar.addEventListener('click', function(){
    
    if(txtCancion.value != ''){
      reproducir();
      let textoIngresado = txtCancion.value;
      let cancion = arrCanciones[cancionActual - 1][1];
      let artista = arrCanciones[cancionActual - 1][2];
      //console.log(arrCanciones[cancionActual - 1]);

      if(textoIngresado.toLowerCase() == cancion.toLowerCase()){
          console.log('cancion correcta');
          
      }else if(textoIngresado.toLowerCase() == artista.toLowerCase()){
        console.log('artista correcto');
      }else{
          console.log('error');
      }

      divCancionCorrecta.innerHTML = '<div class="cancion__correcta">'+cancion+' - '+artista+'</div>';
 
      let tiempo = setTimeout(function(){
        
        divCancionCorrecta.innerHTML = '';
        siguienteCancion();

      }, 4000);

    }

});










