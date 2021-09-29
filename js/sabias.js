window.onload = function(){
  getUsuario();
  consultarAutenticacion();
  getPublicaciones();
}
const public = document.querySelector('#public-descripcion');
const db = firebase.firestore();
const divPublicaciones = document.querySelector('#div-publicaciones');
let currentUserId;

function getUsuario(){
  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
        currentUserId = firebase.auth().currentUser.uid;
    } 
});
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
  let form = document.querySelector('#formNuevaPublicacion');

  let titulo = form.nombre.value;
  let descripcion = form.descripcion.value;
  let categoria = form.categoria.value;
 
  if(titulo != '' && descripcion != '' && categoria != ''){
    if(descripcion.length <= 800){

      img = form.imagen.value;
      if(img != null){
        
      }

    }else{
      alert('Maximo 800 caracteres');
    }
  }else{
    alert('Completa todos los campos');
  }

  


}

