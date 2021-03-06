window.onload = function(){
    
  firebase.auth().onAuthStateChanged(res=>{

    if(res != null){
      //location.href = '../';
    }else{
      const divLoading = document.querySelector('#loading2');
      divLoading.style.display = 'none';
    }
    });
    consultarAutenticacion();
}

const divLogin = document.querySelector('#login');
const divSignUp = document.querySelector('#signUp');
const divRigisIngresar = document.querySelector('#registraseAqui');
const txtOpcionesIngreso = document.querySelector('#txtOpcionesIngreso');
const divAlert = document.querySelector('#alertas-err');
let ingresar = true;

divRigisIngresar.addEventListener('click', function(){
    if(ingresar === true){
      divLogin.classList.add('notblock');
      divSignUp.classList.remove('notblock');
      divRigisIngresar.innerHTML = `<p>Tengo una cuenta</p><p class="text-bold">inciar sesion</p>`;
      txtOpcionesIngreso.innerHTML = 'o registrate con';
      ingresar = false;
    }else{
        divSignUp.classList.add('notblock');
        divLogin.classList.remove('notblock');
        divRigisIngresar.innerHTML = `<p>No tenes cuenta?</p><p class="text-bold">Registrate aquí</p>`;
        txtOpcionesIngreso.innerHTML = 'o ingresa con';
        ingresar = true;

    }

});

if(document.querySelector('#btnRegistrame')){
    let btnSignUp = document.querySelector('#btnRegistrame');
    btnSignUp.addEventListener('click', e=> {

        signUpWithEmail(); 
    });
}

if(document.querySelector('#btnIngresar')){
    let btnLogin = document.querySelector('#btnIngresar');
    btnLogin.addEventListener('click', e=> {

        inciarSesion(); 
    });
}

if(document.querySelector('#loginGoogle')){
    let btnGoogle = document.querySelector('#loginGoogle');
    btnGoogle.addEventListener('click', e =>{
        loginWithGoogle();
    });
  }



function signUpWithEmail(){

    let email = document.querySelector('#emailSignUp').value;
    let password = document.querySelector('#passwordSignUp').value;
    let passwordConfirm = document.querySelector('#passwordConfirmSignUp').value;
    let nickName = document.querySelector('#nickSignUp').value;

    if(email != '' && password != '' && passwordConfirm != '' && nickName != ''){

        if(password === passwordConfirm){

            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res =>{
            let user = res.user;
            return firebase.firestore().collection("usuarios").doc(user.uid).set({
 
                nombre: nickName,
                apellido: "",
                email: email,
                photoURL:user.photoURL,
                provider:res.additionalUserInfo.providerId,
                telefono:user.phoneNumber==null ? "" : user.phoneNumber,
                puntaje: 0,

            }).then(respuesta =>{
            
              firebase.firestore().collection("likes_por_usuario").doc('user_'+user.uid).set({
               publcacion0: 0
              })
              .then(respLike =>{
                document.location.href = "../";
              });
            }).catch(error=>{
               alert('Ocurrio un error al registrase');
            });

           }).catch(error =>{
           console.log('Ups! Hubo un error '+ error);
           });

        }else{
            divAlert.innerHTML = '<div class="alert_error">Las contraseñas son distintas</div>';
        }
    }else{
        divAlert.innerHTML = '<div class="alert_error">Todos los campos son obligatorios</div>';
    }

    let timer = setTimeout(function(){

      divAlert.innerHTML = '';
    },5000);
}

function inciarSesion(){

    let email  = document.querySelector('#emailLogIn').value;
    let pass  = document.querySelector('#passwordLogin').value;

    if(email != '' && pass != ''){

        firebase.auth().signInWithEmailAndPassword(email,pass)
        .then(resp =>{
    
          document.location.href = "/index.html";
    
        }).catch(err=>{
           
        });

    }else{
        divAlert.innerHTML = '<div class="alert_error">Completa todos los campos</div>'
    }

    let timer = setTimeout(function(){

        divAlert.innerHTML = '';
      },5000);

   
}

function loginWithGoogle(){

    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(res => {

      let user = res.user;

      return firebase.firestore().collection("usuarios").doc(user.uid)
      .get().then(el => {

          let info = el.data();
          if(info == null || info == undefined){

            return firebase.firestore().collection("usuarios").doc(user.uid).set({
 
                nombre: res.additionalUserInfo.profile.given_name,
                apellido: res.additionalUserInfo.profile.family_name,
                email: user.email,
                photoURL:user.photoURL,
                provider:res.additionalUserInfo.providerId,
                telefono:user.phoneNumber==null ? "" : user.phoneNumber,
                puntaje: 0,

            }).then(respuesta =>{

                firebase.firestore().collection("likes_por_usuario").doc('user_'+user.uid).set({
                    publcacion0: 0
                   })
                   .then(respLike =>{
                     document.location.href = "../";
                   });
                
            }).catch(error=>{
               alert('Ocurrio un error al registrase');
            });

          }else{
            document.location.href = "../";
          }
      });
      

    }).catch(error=>{
        console.log(error);
    });
  }