window.onload = function(){
  consultarAutenticacion();
  getPublicaciones();
  getUsuario();
}


const public = document.querySelector('#public-descripcion');
const db = firebase.firestore();
const divPublicaciones = document.querySelector('#div-publicaciones');
let currentUserId;
function getUsuario(){
  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
        currentUserId = firebase.auth().currentUser.uid;
    }else{
      currentUserId = null;
    }
  });
}

function categoriaClickeada(value){
  divPublicaciones.innerHTML = '';
  publicacionActual = 0;
  categoriaSeleccionada = value;
  getPublicacionPorCategoria();
}

function getPublicaciones(){
  db.collection('cosas_que_no_sabias').limit(10).get()
  .then(resp=>{
      resp.forEach(element => {
       crearElementoPublicacion(element.data(), element.id);
     });

  }).catch(err=>{
    alert('No pudimos cargar la informacion');
  })
}

function crearElementoPublicacion(data, id){
  let divNuevo = document.createElement('div');

  divNuevo.innerHTML = `
   <div class="div__publicacion">
     <p><i class="far fa-question-circle">  </i>  `+data['categoria']+`</p>
     <p class="titulo">`+data['titulo']+`</p>
     <button class="btn btn-secondary" onclick="getPublicacion('`+id+`')">ver publicacion</button>
   </div>
   `;
   divPublicaciones.appendChild(divNuevo);
}

function getPublicacion(id){
  public.style.display = 'flex';
   public.innerHTML = '<img src="../assets/three-dots.svg" class="svg__load">';
   db.collection('cosas_que_no_sabias').doc(id).get()
   .then(resp =>{
       let data = resp.data();
       public.innerHTML = `
       
       <div class="publicacion__descripcion">
           <p>Cosas que no sabias sobre</p>
           <img src="`+data['imagen']+`" alt="cosas que no sabias sobre`+data['titulo']+`">
           <div class="separador__horizontal"></div>
           <div class="txt__descripcion">
              <h4>`+data['titulo']+`</h4>
              <p>`+data['descripcion']+`</p>
            </div>
            <div class="div__acciones-publicacion">
              <p id="btn-like"><i class="far fa-thumbs-up"></i> `+data['likes']+`</p>
              <button class="btn btn-secondary" id="cerrar-publicacion">Cerrar</button>
            </div>
       </div>`;
       
       let btnCerrar = document.querySelector('#cerrar-publicacion');
       btnCerrar.addEventListener('click', function(){
          public.innerHTML = '';
          public.style.display = 'none';
       });
       let btnLike = document.querySelector('#btn-like');
       btnLike.addEventListener('click', function(){
         likearPublicacion(resp.id); 
       });

       db.collection('likes_por_usuario').doc('user_'+currentUserId).get()
       .then(resp1=>{
         if(resp1.exists){
           if(resp1.data()[resp.id] != null){
             if(resp1.data()[resp.id] === 1){
                btnLike.style.color = 'green';
             }
           }
          }
        });
       

   })
   .catch(err =>{
     alert('No pudimos cargar la publicacion');
   });
}

function likearPublicacion(id){
  let btnLike = document.querySelector('#btn-like');
  btnLike.style.display = 'none';
  db.collection('likes_por_usuario').doc('user_'+currentUserId).get()
  .then(resp=>{
    if(resp.exists){
      let data = resp.data();
      let like = false;
      if(data[id] != null){
         if(data[id] == 1){
           data[id] = 0;
         }else{
           data[id] = 1;
           like = true;
         }
      }else{
        data[id] = 1;
        like = true;
      }      

      db.collection('likes_por_usuario').doc('user_'+currentUserId).set(data);
      
      db.collection('cosas_que_no_sabias').doc(id).get()
      .then(resp1=>{
        let info = resp1.data();
        if(like){
          db.collection('cosas_que_no_sabias').doc(id).update({
            likes: info['likes'] + 1
         }).then(resp2=>{
          btnLike.innerHTML = '<i class="far fa-thumbs-up"></i>'+(info['likes'] + 1);
          btnLike.style.color = 'green';
          btnLike.style.display = 'flex';
          
         });
        }else{
          db.collection('cosas_que_no_sabias').doc(id).update({
            likes: info['likes'] - 1
         }).then(resp2=>{
          btnLike.innerHTML = '<i class="far fa-thumbs-up"></i>'+(info['likes'] - 1);
          btnLike.style.color = 'darkgoldenrod';
          btnLike.style.display = 'flex';
          
         });

        }

      });
     
    }

  }).catch(err=>{
    alert('No pudimos guardar tu like');
  })
}

let btnCrearPublicacion = document.querySelector('#btn-crearPubli');
btnCrearPublicacion.addEventListener('click', function(){

  creaPublicacion();
});

function creaPublicacion(){
  getUsuario();
  if(currentUserId != null){ 

  
  let form = document.querySelector('#formNuevaPublicacion');
  
  let titulo = form.nombre.value;
  let descripcion = form.descripcion.value;
  let categoria = switchCategoria(form.categoria.value);
  
  if(titulo != '' && descripcion != '' && categoria != ''){
    if(descripcion.length <= 800){

      db.collection('cosas_que_no_sabias').orderBy('nroPublicacion','desc').limit(1).get()
      .then(resp =>{
        let nroUltimaPublicacion; 
       resp.forEach(element=>{
        nroUltimaPublicacion = element.data()['nroPublicacion'] + 1;
       });
      db.collection('cosas_que_no_sabias').add({
        titulo: limpiador(titulo),
        descripcion: limpiador(descripcion),
        categoria: categoria,
        nroPublicacion: nroUltimaPublicacion,
        creador: currentUserId
      }).then(resp1=>{
        let id = resp1.id;
        img = form.imagen;
        if(img.files[0] != null && img.files[0]['size'] < 90000){
          
          let ref = firebase.storage().ref("cosas_que_no_sabias/"+currentUserId+img.files[0].name);
          let imgImport = img.files[0];
          let refImagen = ref.put(imgImport);

          refImagen.on("state_changed", ()=>{},(err)=>{alert(err)},()=>{

            refImagen.snapshot.ref.getDownloadURL().then(url=>{

              db.collection("cosas_que_no_sabias").doc(id).update({
                   imagen: url
              })
            });     
          });
          form.reset();
          alert('Publicacion creada correctamente');
        }else{
          form.reset();
        }

      });
    })
      .catch(err=>{
        alert('Ocurrio un error');
        console.log(err);
      });


    }else{
      alert('Maximo 800 caracteres');
    }
  }else{
    alert('Completa todos los campos');
  }

  }else{
    alert('Tenes que iniciar sesion');
  }
} 

function limpiador(cadena) {
  cadena = cadena.split('');
  let cadenaFinal = '';

  for (let i = 0; i < cadena.length; i++) {

      let char = cadena[i];
      if (char == "'" || char == "<" || char == ">" || char == "{" || char == "}" || char == "=" || char == "*") {
          char = '|';
      }
      cadenaFinal += char;
  }

  return cadenaFinal;
}


let publicacionActual = 0;
let categoriaSeleccionada;

function getPublicacionPorCategoria(){
  console.log('entroo');
  let categoria = switchCategoria(categoriaSeleccionada);
  if(categoria != null){
    db.collection('cosas_que_no_sabias')
    .where('categoria','==',categoria).where('nroPublicacion', '>', publicacionActual)
    .orderBy('nroPublicacion','desc').limit(10).get()
    .then(resp=>{
        resp.forEach(element=>{
          let data = element.data();
          crearElementoPublicacion(data, element.id);
          publicacionActual = data['nroPublicacion'];
        });
    })
    .catch(err=>{
      alert('No pudimos cargar las publicaciones');
      console.log(err);
    });
    

  }else{
   
    db.collection('cosas_que_no_sabias')
    .where('nroPublicacion', '>', publicacionActual)
    .orderBy('nroPublicacion','desc').limit(10).get()
    .then(resp=>{
        resp.forEach(element=>{
          let data = element.data();
          crearElementoPublicacion(data, element.id);
          publicacionActual = data['nroPublicacion'];
        });
    })
    .catch(err=>{
      alert('No pudimos cargar las publicaciones');
    });

  }
  
}

let btnCargarMasPublicaciones = document.querySelector('#btn-cargarMas');
btnCargarMasPublicaciones.addEventListener('click', function(){
  getPublicacionPorCategoria();
});

function switchCategoria(categoria){
  switch (parseInt(categoria)) {
    case 1:
      categoria = 'historia';
      break;
    case 2:
      categoria = 'geografia';
    break;
    case 3:
      categoria = 'arte';
      break;
      case 4:
        categoria = 'ciencia';
        break;
      case 5:
        categoria = 'deportes';
        break;
      case 6:
      categoria = 'random';
      break;
    default:
      categoria = null;
      break;
  }

  return categoria;
}