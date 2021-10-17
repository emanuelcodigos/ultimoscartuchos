window.onload = function () {
    consultarAutenticacion();
    getInfoPublicaciones();
}

const db = firebase.firestore();
const sectionInvitados = document.querySelector('#elemetos');
let loading = document.querySelector('#loadingNuevo');
let btnCargarMasPublicaciones = document.querySelector('#cargarMas');
let numeroPubliActual = 0;
let likesPubliActual = 100000;
let mostrarPorRecientes = true;
let currentUserId;

const btnMostrarPorRecientes = document.querySelector('#btn-recientes');
const btnMostrarPorVotos = document.querySelector('#btn-masVotos');
btnMostrarPorRecientes.addEventListener('click', function(){
      mostrarPorRecientes = true;
      numeroPubliActual = 
      btnMostrarPorRecientes.style.backgroundColor = '#72649a';
      btnMostrarPorVotos.style.backgroundColor = '#635883';
      sectionInvitados.innerHTML = '';
      getInfoPublicaciones();
});
btnMostrarPorVotos.addEventListener('click', function(){
    mostrarPorRecientes = false;
    btnMostrarPorVotos.style.backgroundColor = '#72649a';
    btnMostrarPorRecientes.style.backgroundColor = '#635883';
    sectionInvitados.innerHTML = '';
    getInfoPublicaciones();
});

function getInfoPublicaciones(){
    loading.style.display = 'flex';
    db.collection('invitados').doc('nroPublicacionesInvitados').get()
    .then(resp => {
        let data = resp.data();
        numeroPubliActual = data['actual'];  
        firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
                currentUserId = firebase.auth().currentUser.uid;
            }
            if(mostrarPorRecientes){
                getPublicacionesPorRecientes();
            }else{
                likesPubliActual = 5000;
                getPublicacionesPorLikes();
            }
        });      
        
    }).catch(err => {
        console.log(err);
    });
}

function mostrarSegun(opcion){
    sectionInvitados.innerHTML = '';
    if(opcion == 1){
       getPublicacionesPorRecientes();
    }else{
      getPublicacionesPorLikes();
    }
}

function getPublicacionesPorLikes(){
    db.collection('invitados').where('likes', '<', likesPubliActual).orderBy('likes', 'desc').limit(10).get()
    .then(resp=>{
        resp.forEach(element=>{
             let data = element.data();
             likesPubliActual = data['likes'];
             infoParaCrearElementos(element.id, data);
        });
        btnCargarMasPublicaciones.classList.remove('notblock');
        loading.style.display = 'none';
    })
    .catch(err=>{
        console.log(err);
    })
}

function getPublicacionesPorRecientes(){
    
    db.collection('invitados').where('nro_publicacion', '<', numeroPubliActual).orderBy('nro_publicacion','desc').limit(10).get()
    .then(resp =>{
        resp.forEach(element =>{
    
         let data = element.data();
         numeroPubliActual = data['nro_publicacion'];
           
         infoParaCrearElementos(element.id, data);
       });
       btnCargarMasPublicaciones.classList.remove('notblock');
       loading.style.display = 'none';
    }).catch(err=>{
        console.log(err);
    });
}

function infoParaCrearElementos(id, element){
    if(currentUserId != null){
        
        db.collection("likes_por_usuario").doc("user_"+currentUserId).get()
        .then(resp => {
           if(resp.exists){
             let data = resp.data();

             if(data[id] != null){
                 if(data[id] === 1){
                     crearElemento(1, id, element);
                 }else{
                     crearElemento(0,id,element);
                 }
             }else{
                crearElemento(0, id, element);
             }
           }else{
            crearElemento(0, id, element);
           }
        });
  
    }else{
      crearElemento(0, id, element);
    }
}

function crearElemento(opcion, id, element){
    let colorBoton = '';
    if(opcion == 1){
      colorBoton = 'style="color:green"';
    }
    let div = document.createElement('div');
    div.innerHTML = `
    <p class="nombre">` + element['nombre'] + `</p>
    <p>` + element['descripcion'] + `</p>
    
    <div class="div__botones">
    <div id="`+id+`" class="boton" `+colorBoton+`>
    <p style="margin: 0;"><i class="far fa-thumbs-up mr-5"></i>`+ element['likes'] + `</p>
    </div>
    <div class="boton"><p style="margin: 0;"><i class="fas fa-share-square"></i></p></div>
    
    </div>
    <div class="separador">`;

    let btnLike = div.childNodes[5].childNodes[1];
    btnLike.addEventListener('click',function(){
       reaccionarAPublicacion(btnLike);
    });

    sectionInvitados.appendChild(div);
}

function reaccionarAPublicacion(elementHtml){
   let publicId = elementHtml.id;
   
   if(currentUserId != null){
    elementHtml.style.display = 'none';
    db.collection("likes_por_usuario").doc("user_"+currentUserId).get()
    .then(resp =>{
        if(resp.exists){
            let data = resp.data();
            let opcionReaccion;
            if(data[publicId] != null){
                if(data[publicId] == 1){
                  elementHtml.style.color = '#4c4c4c';
                  data[publicId] = 0;
                  opcionReaccion = 0;
                }else{
                  elementHtml.style.color = 'green';
                  data[publicId] = 1;
                  opcionReaccion = 1;
                }
            }else{
                elementHtml.style.color = 'green';
                data[publicId] = 1;
                opcionReaccion = 1;
            }

            db.collection("likes_por_usuario").doc("user_"+currentUserId).set(data);
            db.collection("invitados").doc(publicId).get()
            .then(resp =>{
                 let likes = resp.data()['likes'];
                 if(opcionReaccion == 1){
                    elementHtml.innerHTML = `<p style="margin: 0;"><i class="far fa-thumbs-up mr-5"></i>`+(likes+1)+ `</p>`
                    db.collection("invitados").doc(publicId).update({
                      likes: likes+1
                    });
                 }else{
                    elementHtml.innerHTML = `<p style="margin: 0;"><i class="far fa-thumbs-up mr-5"></i>`+(likes-1)+ `</p>`
                    db.collection("invitados").doc(publicId).update({
                      likes: likes-1
                    });
                 }

                 elementHtml.style.display = 'flex';
            })
            .catch(err=>{
                console.log(err);
            });
        }
    })
    .catch(err=>{
        console.log(err);
    });
   }else{
       alert('Tenes que iniciar sesion');
   }

}

function cargarMas(){

    if(mostrarPorRecientes){
        getPublicacionesPorRecientes();
    }else{
        getPublicacionesPorLikes();
    }
}


function crearNuevoInvitado(){
    loading.style.display = 'flex';
    let formulario = document.querySelector('#formNuevoInvitado');
    let txtNombre = formulario.nombre.value;
    let txtDescripcion = formulario.descripcion.value;
    
    firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
            currentUserId = firebase.auth().currentUser.uid;

            db.collection("invitados").doc("nroPublicacionesInvitados").get()
            .then(resp=>{
                let nroPublicaciones = resp.data()['actual'];
                
                db.collection("invitados").add({
                  nombre: txtNombre,
                  descripcion: txtDescripcion,
                  usuario: currentUserId,
                  nro_publicacion: nroPublicaciones,
                  likes: 0
                });

                db.collection("invitados").doc("nroPublicacionesInvitados").update({
                  actual: nroPublicaciones + 1
                })
                .then(resp=>{
                    formulario.reset();
                    loading.style.display = 'none';
                });
                
            })
            .catch(err=>{
                console.log(err);
            })
            
        }else{
            alert('debes estar registrado');
        }
        
    }); 

    
}