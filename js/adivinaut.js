window.onload = function(){

    consultarAutenticacion();
    getPreguntas();
}

const db = firebase.firestore();
const audio = document.querySelector('#cancionActual');
let tiempoTranscurrido = 180;
let arrCanciones;
let cancionActual = 0;
let puntaje = 0;

var wavesurfer = WaveSurfer.create({
    container: '#waveform'
});

function timer(){
    const timer = document.querySelector('#timer');

    let contador = setInterval(function(){
       timer.innerHTML = tiempoTranscurrido;
       tiempoTranscurrido--;

       if(tiempoTranscurrido < 0){
           clearInterval(contador);
           alert('juego finalizado');
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
            if(arrData['img']){
                arrActual.push(arrData['img']);
            }

            arrPreguntas.push(arrActual);
             
         });
         
          arrCanciones = desordenar(arrPreguntas);
          console.log('listo');
        
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

function reproducirCancion(){
    
    let cancion = arrCanciones[cancionActual][0];
    console.log(cancionActual);
    console.log(arrCanciones);
    audio.innerHTML = '<audio controls><source src="'+cancion+'" type="audio/mpeg"></audio>'
    wavesurfer.load(cancion);
    wavesurfer.on('ready', function () {
        wavesurfer.play();
    });
    cancionActual++;
}

const ayuda = document.querySelector('#ayuda');
ayuda.addEventListener('click', function(){


    reproducirCancion();
});

