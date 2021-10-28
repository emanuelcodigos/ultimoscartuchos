var firebaseConfig = {
    apiKey: "AIzaSyA31W964FMakRJNZYyP_QR2Ouw9SR5cARM",
    authDomain: "ultimos-cartuchos.firebaseapp.com",
    projectId: "ultimos-cartuchos",
    storageBucket: "ultimos-cartuchos.appspot.com",
    messagingSenderId: "40414595127",
    appId: "1:40414595127:web:1efe983bc6410e36bf57b2",
    measurementId: "G-H4EB9YS0Z7"
  };

  if( navigator.serviceWorker){
    navigator.serviceWorker.register('ultimoscartuchos/sw.js');
  } 


  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


  function cerrarSesion(){
    firebase.auth().signOut()
    .then(res => {
       document.location.href = "../";
    }).catch(err=>{
       alert('No se pudo cerrar la sesion');
    });
  }

  function consultarAutenticacion(){
    
    firebase.auth().onAuthStateChanged(res=>{

        if(res != null){
            
          let child = document.createElement('li');
          child.setAttribute('class', 'sidebar-nav-item');

          child.innerHTML = '<a id="btnCerrarSesion" onclick="cerrarSesion()">Cerrar sesion</a>'
          let childTwo = document.createElement('li');
          childTwo.setAttribute('class', 'sidebar-nav-item');
          childTwo.innerHTML = '<a href="../html/perfil" class="nav-link">Configuracion</a>'

          let node = document.querySelector('#nav-bar');
          

          node.appendChild(child);
          node.appendChild(childTwo);
          let itemRegister = document.querySelector('#itemIniciarSesion');
          node.removeChild(itemRegister);

          if(document.querySelector('#btnIndexLogin')){
            let btnLogin = document.querySelector('#btnIndexLogin');
            btnLogin.innerHTML = 'Mi perfil';
            btnLogin.href = 'html/perfil';
          }

        }
        
    });
      
  }

function calcualarPorcentajeCorrectas(preg, resp){
  let porcentaje = (resp * 100) / preg;
  let resto = 100 - porcentaje;
  return 'grid-template-columns: '+porcentaje+'% '+resto+'%;';
}

function finalizar(puntaje, cantPreguntas, cantRespCorrectas){
    
    if(puntaje == null){
      puntaje = 0;
    }
    if(puntaje > 5000){
      puntaje = 0;
    }
    
    
    divContenidoPrincipal.innerHTML = '';
    divContenidoPrincipal.classList.add('notblock');
    loading.style.display = 'flex';
    const divResultado = document.querySelector('#resultado');

    firebase.auth().onAuthStateChanged(res=>{
       if(res != null){

        let user = firebase.auth().currentUser;
            
        db.collection('usuarios').doc(user.uid).get()
        .then( resp =>{
            data = resp.data();
            puntosAcumulados = data['puntaje'] + puntaje;
            
            divResultado.innerHTML = `<div class="div__resultado">
            <img src="`+data['photoURL']+`" class="img__user" alt="imagen de usuario">
            <p class="nombre__user">`+data['nombre']+`</p>
            <div class="puntacion">
               <div class="puntos">
                   <img src="../assets/img/coin.svg" alt="" width="40px">
                   <p>`+puntaje+`</p>
                </div>   
            </div>
            </div>
            <div class="fondo__barra">
                <div class="barra__puntuacion" style="`+calcualarPorcentajeCorrectas(cantPreguntas, cantRespCorrectas)+`">
                   <div class="mis__puntos"></div>
                   <div class="puntos__totales"></div>
                </div>
                <p class="txt__barra">`+cantRespCorrectas+` de `+cantPreguntas+`</p>
            </div> 
            <div id="ranking" class="div__ranking">`;
        
            db.collection('usuarios').doc(user.uid).update({ 
                puntaje:puntosAcumulados
            }).then(res =>{
                loading.style.display = 'none';
            }).catch(err =>{
                alert('No pudimos guardar tu puntaje');
                loading.style.display = 'none';
            });

            rankingDeOtrosJugadores();
        });

       }else{

            divResultado.innerHTML = `<div class="div__resultado">
            <img src="../assets/img/user.png" class="img__user" alt="imagen de usuario">
            <div class="puntacion">
               <div class="puntos">
                   <img src="../assets/img/coin.svg" alt="" width="40px">
                   <p>`+puntaje+`</p>
                </div> 
                <a href="../html/registro.html" class="btn btn-secondary btn-guardar-puntaje">Guardar puntaje</a>  
            </div>
            </div>
            <div class="fondo__barra">
                <div class="barra__puntuacion" style="`+calcualarPorcentajeCorrectas(cantPreguntas, cantRespCorrectas)+`">
                   <div class="mis__puntos"></div>
                   <div class="puntos__totales"></div>
                </div>
                <p class="txt__barra">`+cantRespCorrectas+` de `+cantPreguntas+`</p>
            </div> 
            <div id="ranking" class="div__ranking">`;
        rankingDeOtrosJugadores();
        loading.style.display = 'none';
       }

    });

}

function rankingDeOtrosJugadores(){

  const divJugadores = document.querySelector('#ranking');
  let divJugadoresForEach = `<h2>RANKING GENERAL</h2>`;

  db.collection('usuarios').orderBy("puntaje", "desc").limit(3).get()
  .then(resp => {
      return resp; 
  }).then(snap=>{
      let copa = 1;
      snap.forEach(doc =>{
      
          let img =  doc.data()['photoURL'];;
          if(doc.data()['photoURL'] === null){
              img = '../assets/img/user.png';
          }
          divJugadoresForEach += `
          <div id="div_ranking_usuario" class="ranking__usuario">
              <img src="`+img+`" class="br100" alt="icono de usuario">
              <p>`+doc.data()['nombre']+`</p>
              <img src="../assets/img/top`+copa+`.svg" alt="icono trofeo">
              <p>`+doc.data()['puntaje']+`</p>
            </div>`;
            copa++;
      });
      divJugadoresForEach += 
     
      `<div class="div__play_again">
      <button class="btn btn-outline-light onclick="irAlInicio()"><i class="fas fa-home"></i></button>
      <button class="btn btn-outline-light" onclick="volverAJugar()">Volver a Jugar</button>
      <button class="btn btn-outline-light" onclick="irAConfiguracion()"><i class="fas fa-user-cog"></i></button>
      </div>`;
      divJugadores.innerHTML = divJugadoresForEach; 
      
  }).catch(err =>{
     alert('No pudimos obtener el record de otros usuarios');
  });

}
function irAlInicio(){
  location.href = '/';
}
function irAConfiguracion(){
  location.href = '../html/perfil';
}
function volverAJugar(){
  location.href = location.href;
}