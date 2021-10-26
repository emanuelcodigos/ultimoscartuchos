window.onload = function(){

    consultarAutenticacion();
    getPreguntas();
}

const db = firebase.firestore();
const loading = document.querySelector('#pantalla-loading');
const btnComenzar = document.querySelector('#btn-comenzar');
const divContenidoPrincipal = document.querySelector('#pantalla-juego');
const divPantallaJuego = document.querySelector('#div-pantalla-juego');
const divComoJugar = document.querySelector('#div-comoJugar');
const divInfoPelicula = document.querySelector('#info-pelicula');
const divPortadaPelicula = document.querySelector('#portada');
const divInputRespuesta = document.querySelector('#div-input');
const divResultadoRespuesta = document.querySelector('#resultado-respuesta');
let titulo = document.querySelector('#titulo-pelicula');

const imgPelicula = document.querySelector('#img-pelicula');

let reloj = document.querySelector('#reloj');
let arrPrincipalPelis = new Array();
let audio = new Audio();
let peliculaActual = 0;
let timer;



function getPreguntas(){

    let array = new Array();
    db.collection('batalla_peliculas').get()
    .then(resp => {
       return resp;
    }).then(snapShot => {
        snapShot.forEach(element => {
           arrPrincipalPelis.push(element.data());
       });

       loading.style.display = 'none';
       btnComenzar.classList.add('jello');
    
    }).catch(err =>{
        alert('Ups, No se pudo inicair el juego. Recarga la pagina');
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

btnComenzar.addEventListener('click', function(){
   
    arrPrincipalPelis =  desordenar(arrPrincipalPelis);
    divContenidoPrincipal.classList.remove('notblock');
    divComoJugar.classList.add('notblock');
    principal();
});
let respuestasCorrectas = 0;
let puntaje = 0;
function principal(){
    if(peliculaActual <= 4){
    reloj.style.backgroundColor = '#e0e0e0';
    reloj.style.color = '#161616';
    imgPelicula.src = arrPrincipalPelis[peliculaActual]['portada_blur'];
    reiniciarCampos();
    divPortadaPelicula.style.backgroundColor = arrPrincipalPelis[peliculaActual]['color_potada'];
    let tiempoActual = parseInt(arrPrincipalPelis[peliculaActual]['duracion']) + 15;
    reloj.innerHTML = tiempoActual;
    audio.controls = true;
    audio.autoplay = true;
    audio.src = arrPrincipalPelis[peliculaActual]['audio'];
    
    timer = setInterval(function(){
   
    if(tiempoActual < 0){
        clearInterval(timer);
        divInputRespuesta.classList.add('notblock');
        respuesta();
    }else{
        reloj.innerHTML = tiempoActual;
        tiempoActual--;
    } 
    if(tiempoActual == 14){
        reloj.style.backgroundColor = '#ee4747';
        reloj.style.color = '#ffffff';
    }
    },1000);
    }else{
        finalizar(puntaje, 5, respuestasCorrectas);
    }
}

let btnResponder = document.querySelector('#btn-aceptar');
btnResponder.addEventListener('click', function(){
    clearInterval(timer); 
    divInputRespuesta.classList.add('notblock');
    respuesta();
   
});

function respuesta(){
    audio.pause();
    let input = document.querySelector('#txtPelicula');
    resp = input.value;
    if(resp != ''){
        if(quitarAcentos(resp).toUpperCase() == arrPrincipalPelis[peliculaActual]['pelicula'].toUpperCase()
           || quitarAcentos(resp).toUpperCase() == arrPrincipalPelis[peliculaActual]['pelicula_original'].toUpperCase()){
            mostrarCorrecta(0);
            puntaje += 500;
            respuestasCorrectas++;
        }else{
            mostrarCorrecta(1);
        }
    }else{
        mostrarCorrecta(1);
    }
    peliculaActual++;
    input.value = '';
}

function mostrarCorrecta(result){

    imgPelicula.src = arrPrincipalPelis[peliculaActual]['portada'];
    titulo.innerHTML = arrPrincipalPelis[peliculaActual]['pelicula'].toUpperCase();
    divInfoPelicula.innerHTML = `
    <div class="div__info_peli__dato"><i class="fas fa-film"></i><p>Genero: `+arrPrincipalPelis[peliculaActual]['genero']+`</p></div>
    <div class="div__info_peli__dato"><i class="fas fa-video"></i><p>Director: `+arrPrincipalPelis[peliculaActual]['director']+`</p></div>
    <div class="div__info_peli__dato"><i class="far fa-calendar-alt"></i><p>Fecha de estreno: `+arrPrincipalPelis[peliculaActual]['fecha']+`</p></div>
    `;

    divPantallaJuego.classList.add('jello');
    divResultadoRespuesta.classList.remove('correcto', 'incorrecto');
    if(result == 0){
        divResultadoRespuesta.innerHTML = 'CORRECTO';
        divResultadoRespuesta.classList.add('correcto');
    }else if(result == 1){
        divResultadoRespuesta.innerHTML = 'INCORRECTO';
        divResultadoRespuesta.classList.add('incorrecto');
    }

    divResultadoRespuesta.classList.add('tada');

    let reiniciar = setTimeout(function(){

        reiniciarCampos();
        principal();
    },5000);
     
}


function quitarAcentos(cadena){
	const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
	return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
}

let btnSiguiente = document.querySelector('#divBtnSig');
function botonSiguiente(){
    
    btnSiguiente.innerHTML = '<button class="btn btn-primary" onclick="principal()">Siguiente pelicula</button>';

}

function reiniciarCampos(){

    divLoading = document.querySelector('#loading-secundario');
    imgPelicula.style.display = 'none';
    divLoading.style.display = 'flex';
    
    divInputRespuesta.classList.remove('notblock');
    titulo.innerHTML = 'Pelicula: Desconocida';
    divInfoPelicula.innerHTML = `
    <div class="div__info_peli__dato"><i class="fas fa-film"></i><p>Genero: Desconocido</p></div>
    <div class="div__info_peli__dato"><i class="fas fa-video"></i><p>Director: Desconocido</p></div>
    <div class="div__info_peli__dato"><i class="far fa-calendar-alt"></i><p>Fecha de estreno: Desconocido</p></div>
    `;
    btnSiguiente.innerHTML = '';
    divResultadoRespuesta.innerHTML = '';
    divResultadoRespuesta.classList.remove('tada');
    divPantallaJuego.classList.remove('jello');

    let timer = setTimeout(function(){

        divLoading.style.display = 'none';
        imgPelicula.style.display = 'flex';
    }, 2000);
    
}



