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
       document.location.href = "/";
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