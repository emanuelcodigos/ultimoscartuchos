
btnAceptar = document.querySelector('#btn-aceptar');

btnAceptar.addEventListener('click', function(){

     let pelicula = document.querySelector('#txtPeli').value;
     let peliculaOrg = document.querySelector('#txtPeliOrg').value;
     let direc = document.querySelector('#txtDirector').value;
     let genero = document.querySelector('#txtGenero').value;
     let fecha = document.querySelector('#txtFecha').value;
     let modo = document.querySelector('#txtModoJuego').value;
     let colorPort = document.querySelector('#txtColorPortada').value;
     let duracion = document.querySelector('#txtDuracion').value;

     guardarDatos(pelicula, peliculaOrg, direc, genero,fecha,modo,colorPort,duracion);


});

function guardarDatos(pelicula, peliOrg, direc, genero, fecha, modo, colorPort,duracion){

    const db = firebase.firestore();
    let id = '';
    
    db.collection('batalla_peliculas').add({
        pelicula: pelicula,
        pelicula_original: peliOrg,
        director: direc,
        genero: genero,
        fecha: fecha,
        modo_juego: modo,
        color_potada: colorPort,
        duracion: duracion
    
    }).then(resp => {
        id = resp.id;
        let imgPort = document.querySelector('#imgPortada');
        let ref = firebase.storage().ref("batalla_peliculas/portada/"+ imgPort.files[0].name);
        let imagenPortada = imgPort.files[0];

        let refImagen = ref.put(imagenPortada);

        refImagen.on("state_changed", ()=>{},(err)=>{alert(err)},()=>{

            refImagen.snapshot.ref.getDownloadURL().then(url=>{

                db.collection("batalla_peliculas").doc(id).update({
                     portada: url
                }).then(resp =>{

                  console.log('imagen guardada correctamente');
                  let imgPortBlur = document.querySelector('#imgPortadaBlur');
                  let ref = firebase.storage().ref("batalla_peliculas/portada_blur/"+ imgPortBlur.files[0].name);
                  let imgPortadaBlur = imgPortBlur.files[0];

                  let refImagen = ref.put(imgPortadaBlur);

                  refImagen.on("state_changed", ()=>{},(err)=>{alert(err)},()=>{

                  refImagen.snapshot.ref.getDownloadURL().then(url=>{

                  db.collection("batalla_peliculas").doc(id).update({
                     portada_blur: url
                    }).then(resp =>{
                     console.log('imagen guardada correctamente');

                
                     let audio = document.querySelector('#srcPeli');
                     let ref = firebase.storage().ref("batalla_peliculas/audio/"+ audio.files[0].name);
                     let audioPeli = audio.files[0];
   
                     let refImagen = ref.put(audioPeli);
   
                     refImagen.on("state_changed", ()=>{},(err)=>{alert(err)},()=>{
   
                     refImagen.snapshot.ref.getDownloadURL().then(url=>{
   
                     db.collection("batalla_peliculas").doc(id).update({
                        audio: url
                       }).then(resp =>{
                        console.log('audio guardado correctamente');
                       }).catch(err=>{
                       alert(err);
                       });
                   });
               });
                    }).catch(err=>{
                    alert(err);
                    });
                });
            });
                }).catch(err=>{
                alert(err);
                });
            });
        });

    });


}

function culi(){
    let audio = document.querySelector('#srcPeli');
    console.log(audio.files);
}