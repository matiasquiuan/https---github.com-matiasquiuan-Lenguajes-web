import songs from './adivina-cancion/canciones.js';

let cancionActual;
let ytPlayer;
let playerListo = false;

// cargar api
const script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(script);


window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player("player", {
        height: "390",
        width: "640",
        playerVars: { autoplay: 0, rel: 0, playsinline: 1 },
        events: {
            onReady: () => {
                playerListo = true;
                console.log(" player listo ");
            }
        }
    });
};


document.getElementById("random-btn").addEventListener("click", function() {
    if (!playerListo) {
        console.warn("player no esta listo");
        return;
    }

    // leer cancion random
    cancionActual = songs[Math.floor(Math.random() * songs.length)];
    console.log("cancion seleccionada:", cancionActual);

    // mostrar nombre
    document.getElementById("nombre-cancion").textContent = cancionActual.name;

    // cargar y reproducir en el iframe
    ytPlayer.loadVideoById({
        videoId: cancionActual.videoId,
        startSeconds: 0
    });
    ytPlayer.playVideo();
});