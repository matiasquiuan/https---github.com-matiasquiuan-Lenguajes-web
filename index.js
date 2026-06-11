import songs from './canciones.js';

const PLAYLIST = songs;

let playerIndex  = 0;
let ytPlayer;
let playerListo  = false;
let reproduciendo = false;
let progressInterval;

// ── Cargar API de YouTube ──────────────────────────────────────
const ytScript = document.createElement("script");
ytScript.src   = "https://www.youtube.com/iframe_api";
document.head.appendChild(ytScript);

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player("yt-player-index", {
    height: "1", width: "1",
    playerVars: { autoplay: 0, controls: 0, rel: 0 },
    events: {
      onReady: () => {
        playerListo = true;
        cargarCancion(0, false); // muestra info sin reproducir
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) siguiente();
      }
    }
  });
};

// ── Cargar canción ─────────────────────────────────────────────
function cargarCancion(idx, autoplay) {
  const song = PLAYLIST[idx];

  document.getElementById("player-song").textContent = song.name;
  document.getElementById("player-num").textContent  = `${idx + 1} / ${PLAYLIST.length}`;
  document.getElementById("player-thumb").src = `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`;
  document.getElementById("player-bar").style.width  = "0%";

  if (!playerListo) return;

  if (autoplay) {
    ytPlayer.loadVideoById({ videoId: song.videoId });
    setPlay(true);
  } else {
    ytPlayer.cueVideoById({ videoId: song.videoId });
    setPlay(false);
  }
}

// ── Play / Pause ───────────────────────────────────────────────
function setPlay(estado) {
  reproduciendo = estado;
  document.getElementById("player-play").textContent = estado ? "⏸" : "▶";
  if (estado) {
    iniciarProgreso();
  } else {
    clearInterval(progressInterval);
  }
}

function togglePlay() {
  if (!playerListo) return;
  if (reproduciendo) {
    ytPlayer.pauseVideo();
    setPlay(false);
  } else {
    ytPlayer.playVideo();
    setPlay(true);
  }
}

// ── Anterior / Siguiente ───────────────────────────────────────
function anterior() {
  playerIndex = (playerIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  cargarCancion(playerIndex, reproduciendo);
}

function siguiente() {
  playerIndex = (playerIndex + 1) % PLAYLIST.length;
  cargarCancion(playerIndex, reproduciendo);
}

// ── Barra de progreso ──────────────────────────────────────────
function iniciarProgreso() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (!ytPlayer || !reproduciendo) return;
    const current = ytPlayer.getCurrentTime() || 0;
    const total   = ytPlayer.getDuration()    || 1;
    document.getElementById("player-bar").style.width = (current / total * 100) + "%";
  }, 500);
}

// Click en la barra para hacer seek
document.getElementById("player-progress").addEventListener("click", function(e) {
  if (!playerListo) return;
  const pct   = (e.clientX - this.getBoundingClientRect().left) / this.offsetWidth;
  ytPlayer.seekTo(pct * ytPlayer.getDuration(), true);
});

// ── Eventos de botones ─────────────────────────────────────────
document.getElementById("player-play").addEventListener("click", togglePlay);
document.getElementById("player-prev").addEventListener("click", anterior);
document.getElementById("player-next").addEventListener("click", siguiente);