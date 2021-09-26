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

const btnSetNick = document.querySelector('#id-cambiar-nombre');
btnSetNick.addEventListener('click', function(){
     modificarNombre();
});