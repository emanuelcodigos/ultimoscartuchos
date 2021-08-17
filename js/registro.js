window.onload = function(){
 
    consultarAutenticacion();
}

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

if(document.querySelector('#registraseAqui')){
    let registrar = document.querySelector('#registraseAqui');
    registrar.addEventListener('click', function(){

        document.querySelector('#signUp').style.display = 'block'; 
        document.querySelector('#login').style.display = 'none'; 
    });
}


function signUpWithEmail(){

    let email = document.querySelector('#emailSignUp').value;
    let password = document.querySelector('#passwordSignUp').value;
    let passwordConfirm = document.querySelector('#passwordConfirmSignUp').value;

    if(email != '' && password != '' && passwordConfirm != ''){

        if(password === passwordConfirm){

            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res =>{
            let user = res.user;
            //document.location.href = '/';
            return firebase.firestore().collection("usuarios").doc(user.uid).set({
 
                nombre: "",
                apellido: "",
                email: email,
                photoURL:user.photoURL,
                provider:res.additionalUserInfo.providerId,
                telefono:user.phoneNumber==null ? "" : user.phoneNumber,
                puntaje: 0,

            }).then(respuesta =>{

              document.location.href = "/";
                
            }).catch(error=>{
               alert('Ocurrio un error al registrase');
            });

           }).catch(error =>{
           console.log('Ups! Hubo un error '+ error);
           });

        }else{
            alert('las contraseñas son distintas');
        }
    }else{
        alert('rellena los campos');
    }
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
        alert('completa todos los campos');
    }

   
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

              document.location.href = "/ultimoscartuchos";
                
            }).catch(error=>{
               alert('Ocurrio un error al registrase');
            });

          }else{
            document.location.href = "/ultimoscartuchos";
          }
      });
      

    }).catch(error=>{
        console.log(error);
    });
  }