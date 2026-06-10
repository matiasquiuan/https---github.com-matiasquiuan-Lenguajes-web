import songs from './canciones.js'; //importamos todas las canciones desde el arhivo

let ytPlayer;
let playerListo = false;

window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player("yt-player", {
      height: '0',
      width: '0',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0
      },
      events: {
        onReady: () => {
            playerListo = true;
            console.log("✅ YouTube Player listo");
        }
      }
    });
}

const script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(script);


function juegoInicio(){
    let btn = document.getElementById("btn");
    btn.addEventListener("click", function() {
        console.log("Reproducir fragmento");
        const randomSong = songs[Math.floor(Math.random() * songs.length)];//obtengo una canción aleatoria
        console.log("Canción seleccionada:", randomSong.videoId);
        if (!ytPlayer || !playerListo) { // verifico que el player este listo
            console.warn("player no listo");
            return;
        }
        ytPlayer.loadVideoById({ //si lo esta cargo la cancion
            videoId: randomSong.videoId,
            startSeconds: 0      
        });
        ytPlayer.playVideo();
        btn.disabled = true;
        btn.textContent = "🎵 Escuchando...";
        // Parar después de DURACION_CLIP segundos
        stopTimer = setTimeout(() => {
            ytPlayer.stopVideo();
            btn.disabled = false;
            btn.textContent = "▶ Reproducir fragmento";
        }, DURACION_CLIP * 1000);
        });   
    
}


// Arrancar al cargar
juegoInicio();
