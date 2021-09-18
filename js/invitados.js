window.onload = function () {

    consultarAutenticacion();
    getInfoPublicaciones();
}

const db = firebase.firestore();
const sectionInvitados = document.querySelector('#elemetos');
let numeroPubliActual = 0;
let likesPubliActual = 0;
let modoRecientes = false;
let currentUserId = '';

function getInfoPublicaciones() {
    db.collection('invitados').doc('nroPublicacionesInvitados').get()
        .then(resp => {
            let data = resp.data();
            numeroPubliActual = data['actual'] + 1;
            likesPubliActual = data['mayor_likes'] + 1;
            mostrarSegun(0);
        }).catch(err => {
            console.log(err);
        })
}

function getInvitados() {

    db.collection('invitados').where('nro_publicacion', '<', numeroPubliActual).orderBy('nro_publicacion', 'desc').limit(3).get()
        .then(resp => {

            firebase.auth().onAuthStateChanged(user => {
                if (user != null) {
                    currentUserId = firebase.auth().currentUser.uid;
                    resp.forEach(element => {
                        crearDivInvitado(element.data(), element.id, 1);
                    });
                } else {
                    resp.forEach(element => {
                        crearDivInvitado(element.data(), element.id, 0);
                    });
                }
            });
            

        }).catch(err => {
            console.log(err);
        });

}

function getInvitadosPorLikes() {
    db.collection('invitados').where('likes', '<', likesPubliActual).orderBy('likes', 'desc').limit(3).get()
        .then(resp => {

            firebase.auth().onAuthStateChanged(user => {
                if (user != null) {
                    currentUserId = firebase.auth().currentUser.uid;
                    resp.forEach(element => {
                        crearDivInvitado(element.data(), element.id, 1);
                    });
                } else {
                    resp.forEach(element => {
                        crearDivInvitado(element.data(), element.id, 0);
                    });
                }
            });

        }).catch(err => {
            console.log(err);
        });
}


function crearDivInvitado(element, id, user) {

    if (user === 1) {
        
        db.collection("likes_por_usuario").doc("user_" + currentUserId).get()
            .then(resp => {
                let data = resp.data();
                if (data[id] != null) {
                    if (data[id] === 1) {
                        crearElementoInvitado(element, id, 1);
                    } else if (data[id] === 0) {
                        crearElementoInvitado(element, id, 0);
                    } else {
                        crearElementoInvitado(element, id);
                    }

                } else {
                    crearElementoInvitado(element, id);
                }
            });

    } else if (user === 0) {
        crearElementoInvitado(element, id);
    }


}

function crearElementoInvitado(element, id, like) {

    db.collection("usuarios").doc(element['usuario']).get()
        .then(doc => {

            let creador = 'Desconocido';
            if (doc.exists) {
                data = doc.data();
                creador = data['nombre'];
            }
            numeroPubliActual = element['nro_publicacion'];
            likesPubliActual = element['likes'];

            let classLike = '';
            let classDislike = '';
            if (like == 0) {
                classDislike = 'dislike';
            } else if (like == 1) {
                classLike = 'like';
            }
            let div = document.createElement('div');
            div.innerHTML = `<div>
            <p class="nombre">` + element['nombre'] + `</p>
            <p>` + element['descripcion'] + `</p>
            <p class="creador">Creado por `+ creador + `</p>
            <div class="div__botones">
            <div class="boton `+ classLike + `" id="like_`+id+`" onclick="reaccionar(1,'`+id+`')">
            <p style="margin: 0;"><i class="far fa-thumbs-up mr-5"></i>`+ element['likes'] + `</p>
            </div>
            <div class="boton ` + classDislike + `" id="dislike_`+id+`" onclick="reaccionar(0,'`+id+`')">
            <p style="margin: 0;"><i class="far fa-thumbs-down mr-5"></i>`+ element['dislikes'] + `</p></div>
            </div>
            <div class="separador"></div>`;
            sectionInvitados.appendChild(div);
        });

        
}
const btnCrear = document.querySelector('#btn-nuevoInv');

btnCrear.addEventListener('click', function () {

    let loading = document.querySelector('#loadingNuevo');
    loading.style.display = 'flex';
    firebase.auth().onAuthStateChanged(res => {
        if (res != null) {

            let user = firebase.auth().currentUser;
            let form = document.querySelector('#formNuevoInvitado');

            let descr = form.descripcion.value;
            let nombre = form.nombre.value;

            if (nombre != '' && descr != '') {
                descr = limpiador(descr);
                nombre = limpiador(nombre);

                db.collection('invitados').doc('nroPublicacionesInvitados').get()
                    .then(resp0 => {

                        resp0 = resp0.data();
                        let publiActual = resp0['actual'] + 1;
                        db.collection('invitados').add({

                            nombre: nombre,
                            descripcion: descr,
                            dislikes: 0,
                            likes: 0,
                            usuario: user.uid,
                            nro_publicacion: resp0['actual']


                        }).then(resp => {
                            db.collection('invitados').doc('nroPublicacionesInvitados').update({
                                actual: publiActual
                            }).then(resp1 => {
                                loading.style.display = 'none';

                                form.reset();
                                location.href = location.href;
                            });

                        });

                    }).catch(err => {
                        alert('no se pudo guardar');
                    });

            } else {
                let incompleto = document.querySelector('#faltan-datos');
                incompleto.innerHTML = `<p class="campos__incompletos">TODOS LOS CAMPOS SON OBLIGATORIOS</p>`;
                loading.style.display = 'none';
            }

        } else {
            console.log('tienes que logearte');
            loading.style.display = 'none';
        }
    });




});


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


function mostrarSegun(opcion) {

    if (opcion == 0) {
        if (!modoRecientes) {
            sectionInvitados.innerHTML = '';
            let recientes = document.querySelector('#btn-recientes');
            let masVotos = document.querySelector('#btn-masVotos');
            recientes.classList.add('seleccionado');
            masVotos.classList.remove('seleccionado');

            db.collection('invitados').doc('nroPublicacionesInvitados').get()
                .then(resp => {
                    let data = resp.data();
                    numeroPubliActual = data['actual'] + 1;
                    likesPubliActual = data['mayor_likes'] + 1;
                    getInvitados();
                    modoRecientes = true;

                }).catch(err => {
                    console.log(err);
                });

        }

    } else if (opcion == 1) {

        if (modoRecientes) {
            sectionInvitados.innerHTML = '';
            let recientes = document.querySelector('#btn-recientes');
            let masVotos = document.querySelector('#btn-masVotos');
            masVotos.classList.add('seleccionado');
            recientes.classList.remove('seleccionado');
            db.collection('invitados').doc('nroPublicacionesInvitados').get()
                .then(resp => {
                    let data = resp.data();
                    numeroPubliActual = data['actual'] + 1;
                    likesPubliActual = data['mayor_likes'] + 1;
                    getInvitadosPorLikes();
                    modoRecientes = false;

                }).catch(err => {
                    console.log(err);
                });

        }

    }
}

function cargarMas() {
    if (modoRecientes) {
        getInvitados();
    } else {
        getInvitadosPorLikes();
    }
}




function reaccionar(op, id) {

    if (op === 1 /*like*/) {
        
        if (currentUserId != '') {
            db.collection('likes_por_usuario').doc('user_' + currentUserId).get()
                .then(resp => {

                    if (resp.exists) {
                        let data = resp.data();
                        if (data[id] != null) {
                            console.log(data[id]);
                            if (data[id] === 1) {
                                data[id] = 2
                                db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);
                                

                            } else if (data[id] === 0) {
                                data[id] = 1
                                db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);

                            } else if (data[id] === 2) {
                                data[id] = 1;
                                db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);
                            }

                        } else {
                            data[id] = 1;
                            db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);

                        }


                    } else {
                        console.log('el usuario no tiene likes');
                    }
                });

        } else {
            console.log('tines que inicar sesion');
        }

    } else if (op === 0) {

        if (currentUserId != '') {
            db.collection('likes_por_usuario').doc('user_' + currentUserId).get()
                .then(resp => {

                    if (resp.exists) {
                        let data = resp.data();
                        if (data[id] != null) {
                            if (data[id] === 0) {
                                data[id] = 2;
                                db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);

                            } else if (data[id] === 1) {
                                data[id] = 0;
                                db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);

                            } else if (data[id] === 2) {
                                data[id] = 0;
                                db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);
                            }


                        } else {
                            data[id] = 0;
                            db.collection('likes_por_usuario').doc('user_' + currentUserId).update(data);
                        }


                    } else {
                        console.log('el usuario no tiene likes');
                    }
                });

        } else {
            console.log('tines que inicar sesion');
        }

    }





}
