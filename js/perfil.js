window.onload = function(){

    firebase.auth().onAuthStateChanged(res=>{

    if(res != null){
        user = firebase.auth().currentUser.uid;
        mostrarMisDatos(user); 
    }else{
        location.href = '../html/registro';
    }
    });
    consultarAutenticacion();
}
const db = firebase.firestore();
let user;
const divLoading = document.querySelector('#loading2');
let imgUser = document.querySelector('#img-user');
let txtNickUser = document.querySelector('#txtNick');
let txtEmailUser = document.querySelector('#txtEmail');
function mostrarMisDatos(user){
    
    db.collection('usuarios').doc(user).get()
    .then(resp =>{
        divLoading.style.display = 'none';
        let data = resp.data();
        imgUser.src = data['photoURL'];
        txtNickUser.value = data['nombre'];
        txtEmailUser.value = data['email'];
        
        let puntos = document.querySelector('#txtPuntaje').innerHTML = data['puntaje'];
        
    }).catch(err =>{
        console.log(err);
    });

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
function modificarNombre(){
    
    let nombre = txtNickUser.value;
    nombre = limpiador(nombre);

    if(nombre.length <= 20){
        db.collection('usuarios').doc(user).update({
            nombre: nombre
         }).catch(err=>{
             console.log(err);
         });     
    }
}

const btnSetImagen = document.querySelector('#btn-setImagen');
btnSetImagen.addEventListener('click', () => {
    modificarImagen();
});

const btnSetNick = document.querySelector('#id-cambiar-nombre');
btnSetNick.addEventListener('click', function(){
     modificarNombre();
});

const modificarImagen = () => {

    const img =  document.querySelector('#imagen-importada');
    if(img.files[0] != null){

        if(img.files[0].type == 'image/jpeg' || img.files[0].type == 'image/png'){
            
            divLoading.style.display = 'flex';
            let ref = firebase.storage().ref("imgProfile/img-profile-"+ user);

            let refImg = ref.put(img.files[0]);
            refImg.on("state_changed", ()=>{},(err)=>{alert(err)},()=>{

                refImg.snapshot.ref.getDownloadURL().then(url=>{
        
                    db.collection("usuarios").doc(user).update({
                        photoURL: url
                    }).then(resp =>{
                        imgUser.src = url;
                        divLoading.style.display = 'none';
                    }).catch(err=>{
                        divLoading.style.display = 'none';
                    });
                });     
               });
        }else{
            alert('Archivo no permitido');
        }
    }else{
       alert('Selecciona una imagen');
    }

};