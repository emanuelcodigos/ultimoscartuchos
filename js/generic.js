var firebaseConfig = {
    apiKey: "AIzaSyA31W964FMakRJNZYyP_QR2Ouw9SR5cARM",
    authDomain: "ultimos-cartuchos.firebaseapp.com",
    projectId: "ultimos-cartuchos",
    storageBucket: "ultimos-cartuchos.appspot.com",
    messagingSenderId: "40414595127",
    appId: "1:40414595127:web:1efe983bc6410e36bf57b2",
    measurementId: "G-H4EB9YS0Z7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();


  function cerrarSesion(){
    firebase.auth().signOut()
    .then(res => {
       document.location.href = "/ultimoscartuchos";
    }).catch(err=>{

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
          childTwo.innerHTML = '<a class="nav-link">Configuracion</a>'

          let node = document.querySelector('#nav-bar');
          

          node.appendChild(child);
          node.appendChild(childTwo);
          let itemRegister = document.querySelector('#itemIniciarSesion');
          node.removeChild(itemRegister);

          

        }else{
          
        }
        
    });
      
  }

  function finalizar(puntaje){

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
            
            divResultado.innerHTML = `<div class="contenido__resultado"><div class="contenido__resultado--puntuacion">
            <img src="`+data['photoURL']+`" alt="icono de usuario" width="90px">
            <p class="felicidades">Felicitaciones</p>
            <p>Tu puntaje fue</p>
            <p class="txt__puntaje">`+puntaje+`</p>
            </div>
            <div id="rankig-jugadores"></div>
            </div>`;
        
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

        divResultado.innerHTML = `<br><br><br><div class="contenido__resultado"><div class="contenido__resultado--puntuacion">
        <img src="../assets/img/user.png" alt="icono de usuario" width="90px">
        <p class="felicidades">Felicitaciones</p>
        <p>Tu puntaje fue</p>
        <p class="txt__puntaje">`+puntosTotales+`</p>
        </div>
        <div id="rankig-jugadores"></div>
        </div>`;
        rankingDeOtrosJugadores();
        loading.style.display = 'none';
       }

    });

}

function rankingDeOtrosJugadores(){

  const divJugadores = document.querySelector('#rankig-jugadores');
  let divJugadoresForEach = `<h4 class="rankig__jugadores--titulo">RANKING GENERAL</h4>`;

  db.collection('usuarios').orderBy("puntaje", "desc").limit(3).get()
  .then(resp => {
      return resp; 
  }).then(snap=>{
      
      snap.forEach(doc =>{

          let img =  doc.data()['photoURL'];;
          if(doc.data()['photoURL'] === null){
              img = '../assets/img/user.png';
          }
          divJugadoresForEach += `
          <div class="div__puesto-jugador">
          <div class="jugador__ranking">
          <img src="`+img+`" alt="icono de usuario">
          <p>`+doc.data()['nombre']+`</p>
          </div>
          <p class="puntaje__jugador-ranking">`+doc.data()['puntaje']+` puntos</p>
          </div>
          `
      });
      divJugadoresForEach += `<button class="btn btn-primary btn__nuevo-juego">VOLVER A JUGAR</button>`;
      divJugadores.innerHTML = divJugadoresForEach; 
      
  }).catch(err =>{
     //alert('No pudimos obtener el record de otros usuarios');
     console.log(err);
  });
 
}