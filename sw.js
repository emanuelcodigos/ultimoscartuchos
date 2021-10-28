self.addEventListener('install', e => {

    const cachesPromise =  caches.open('cache-v01')
    .then( cache => {

        return cache.addAll([
        '/',
        '/index.html',
        '/html/no-encontrado.html',
        '/css/no-encontrado.css',
        '/css/styles-min.css',
        '/css/animate.css',
        '/assets/favicon.ico',
        '/assets/img/portadas/adivina-ut.jpg',
        '/assets/img/portadas/batalla-peliculas.jpg',
        '/assets/img/portadas/invitados.jpg',
        '/assets/img/portadas/cosas-no-sabias.jpg',
        '/assets/img/portadas/kinga-portada.jpg',
        '/assets/img/portadas/trivia.jpg',
        '/assets/img/trivia-logo.svg',
        '/assets/intro.mp3',
        '/assets/three-dots.svg',
        '/minjs/script.min.js',
        'https://use.fontawesome.com/releases/v5.15.3/js/all.js',
        'https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/css/simple-line-icons.min.css',
        'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic',
        'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700;900&display=swap',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
        'https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7lujVj9w.woff2',
        'https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3ig4vwlxdu3cOWxw.woff2',
        'https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/fonts/Simple-Line-Icons.woff2?v=2.4.0',
        'https://fonts.gstatic.com/s/raleway/v22/1Ptug8zYS_SKggPNyC0IT4ttDfA.woff2',
        'https://fonts.gstatic.com/s/sourcesanspro/v14/6xK1dSBYKcSV-LCoeQqfX1RYOo3qPZ7nsDJB9cme.woff2',
        'https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/fonts/Simple-Line-Icons.ttf?v=2.4.0',
        'https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/fonts/Simple-Line-Icons.woff?v=2.4.0',
        'https://cdn.cafecito.app/imgs/buttons/button_2_2x.png' 

        ]);
    });

    e.waitUntil(cachesPromise);

    
});

self.addEventListener('fetch', e => {

    const respCache = caches.match(e.request)
    .then( resp => {
        if(resp) return resp;

        return fetch( e.request ).then( newResp => {
           return newResp;
        });
    });

    
    e.respondWith(respCache);

});