import songs from './canciones.js'; //importamos todas las canciones desde el arhivo

let randomSong; // variable global para almacenar la cancion 
let ytPlayer;
let playerListo = false;
const DURACION_CLIP = 10; // duración del fragmento en segundos

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
    let form = document.getElementById("respuesta");
    
    btn.addEventListener("click", function() {
        console.log("Reproducir fragmento");
        randomSong = songs[Math.floor(Math.random() * songs.length)];//obtengo una canción aleatoria
        console.log("Canción seleccionada:", randomSong);
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
        // parar despues de DURACION_CLIP segundos
        let stopTimer = setTimeout(() => {
            ytPlayer.stopVideo();
            btn.disabled = false; //desactivamos el boton
            btn.textContent = "▶ Reproducir fragmento";
        }, DURACION_CLIP * 1000);
        });  
        
    form.addEventListener("keyup", function(evento) {
        console.log("Tecla presionada antes de:", evento.key);
        evento.preventDefault(); // evita que el formulario se envie
        console.log("Tecla presionada despues de:", evento.key);
        if (evento.key === "Enter") {
            console.log("Tecla presionada es enter:", evento.key);
            verificarRespuesta(); // llama a la funcion para verificar la respuesta
        }
    });

    
}

function verificarRespuesta() { //funcion para verificar la respuesta del usuario
    let respuesta = document.querySelector(".respuesta").value;
    let puntos = document.getElementById("puntos");
    console.log("Respuesta del usuario:", respuesta);

    if(respuesta.toLowerCase() === randomSong.name.toLowerCase()){
        // respuesta correcta
        console.log("Respuesta correcta");
        puntos.textContent = parseInt(puntos.textContent) + 1; // sumo un punto
        btn.textContent = "▶ Volver a jugar";
        btn.addEventListener("click", function() {
            juegoInicio();
        });
    }else{
        // respuesta incorrecta
        console.log("Respuesta incorrecta"); 
        btn.textContent = "▶ Volver a jugar";
        puntos.textContent = "0"; // reseteo los puntos
        btn.addEventListener("click", function() {
            juegoInicio();
        });
    }
}

// Arrancar al cargar
juegoInicio();
