
const WIDTH = 750;
const HEIGH = 375;

let getDistancia = (e, target) => {
    let difX = e.offsetX - target.x;
    let difY = e.offsetY - target.y;

    return Math.sqrt((difX * difX) + (difY * difY));
}

let getDistanciaPista = distancia => {
    if(distancia < 20){
        return 'Estas muy cerca';
    }else if(distancia < 70){
        return 'Estas cerca';
    }
    else if(distancia < 150){
        return 'Estas lejos';
    }else if(distancia < 300){
        return 'Estas bastante lejos';
    }else if(distancia > 300){
        return 'Estas muy lejos';
    }
}

let target = {
    x: 171,
    y: 142
}

let img = document.querySelector('#map');

img.addEventListener('click', function(e){

    let distancia = getDistancia(e, target);
    /*console.log(distancia);
    console.log(e.offsetX);
    console.log(e.offsetY);*/

    if(distancia < 15){
        console.log('encotraste el tesoro');
        let resp = document.querySelector('#respuesta');
        resp.innerHTML = 'ENCONTRASTE EL TESORO';
    }

    //let pista = getDistanciaPista(distancia);
    

});

