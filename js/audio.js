let SONGS_COUNT;
let songsList = [];
let songId;
let savedVolume = 35;
let playing = false;
let audio = new Audio();
audio.loop = true;

const overlayScreen = document.getElementById('overlay-screen');
const background = document.querySelector('.background');
const notice = document.querySelector('.notice');
const volumeSlider = document.querySelector('.volume-slider');
updateVolumeSliderBg();
const volumeBarWrapper = document.querySelector('.volume-bar-wrapper');
const controlsMain = document.querySelector('.controls-main');
const volumeBtn = document.querySelector('.controls-volume');
const progressBar = document.querySelector('.progress-bar');
const progressBarFill = document.querySelector('.progress-bar__fill');
const playPause = document.querySelector('.play-pause');
const previousSong = document.querySelector('.previous');
const nextSong = document.querySelector('.next');
const volumeIcon = document.querySelector('.volume-icon');
const content = document.querySelector('.content');
const pauseIcon = `
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clip-rule="evenodd"/>
</svg>
`
const playIcon = `
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd"/>
</svg>
`
const volumeON = `
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z" clip-rule="evenodd"/>
</svg>
`
const volumeOFF = `
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M20 16v-4a8 8 0 1 0-16 0v4m16 0v2a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2ZM4 16v2a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z"/>
</svg>
`

let isSeeking = false;

progressBar.addEventListener('mousedown', (e) => {
    isSeeking = true;
    seek(e);
});

document.addEventListener('mousemove', (e) => {
    if (isSeeking) {
        seek(e);
    }
});

document.addEventListener('mouseup', () => {
    isSeeking = false;
});

function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = percent * audio.duration;
    progressBarFill.style.width = `${percent * 100}%`;

    if (background.duration) {
        background.currentTime = audio.currentTime % background.duration;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSongById(id) {
    return songsList.find(s => s.id === id);
}

async function playSong(id) {
    const song = getSongById(id);
    if (!song) return;
    audio.src = song.song_link;
    audio.volume = volumeSlider.value / 100;
    background.src = song.background;
    background.load();
    background.style.display = 'flex';
    await audio.play();
    playing = true;

    const mediaImg = document.querySelector('.media img');
    const songTitle = document.querySelector('.song-title');
    if (mediaImg) mediaImg.src = song.album_cover;
    if (songTitle) songTitle.textContent = `${song.artist} - ${song.title}`;
    if (notice) notice.textContent = song.notice;

    audio.onloadedmetadata = () => {
        updateProgressBar();
    }

    audio.ontimeupdate = () => {
        updateProgressBar();
    }
}

function updateVolumeSliderBg() {
    const val = parseInt(volumeSlider.value, 10);
    const min = parseInt(volumeSlider.min, 10);
    const max = parseInt(volumeSlider.max, 10);
    const percent = ((val - min) / (max - min)) * 100;
    volumeSlider.style.background = `linear-gradient(to right, #fff 0%, #fff ${percent}%, rgba(255,255,255,0.2) ${percent}%, rgba(255,255,255,0.2) 100%)`;
}

volumeSlider.addEventListener('input', () => {
    savedVolume = volumeSlider.value;
    audio.volume = volumeSlider.value / 100;
    updateVolumeSliderBg();
})

function updateProgressBar() {
    audio.ontimeupdate = () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBarFill.style.width = `${percent}%`;
    }
}

function switchPlaying() {
    if (playing) {
        audio.pause();
        background.pause();
        playing = false;
        playPause.innerHTML = playIcon;
    }
    else {
        audio.play();
        background.play();
        playing = true;
        playPause.innerHTML = pauseIcon;
    }
}

playPause.addEventListener('click', switchPlaying)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        switchPlaying();
    }
});

previousSong.addEventListener('click', async () => {
    songId = songId - 1 < 1 ? SONGS_COUNT : songId - 1;
    await playSong(songId);
});

nextSong.addEventListener('click', async () => {
    songId = songId + 1 > SONGS_COUNT ? 1 : songId + 1;
    await playSong(songId);
});

function showVolumeBar() {
    volumeBarWrapper.classList.add('active');
    volumeBarWrapper.style.zIndex = "2";
    controlsMain.classList.add('hidden');
}
function hideVolumeBar() {
    volumeBarWrapper.classList.remove('active');
    volumeBarWrapper.style.zIndex = "-1";
    controlsMain.classList.remove('hidden');
}

function toggleMute() {
    if (audio.volume === 0) {
        volumeSlider.value = savedVolume;
        audio.volume = savedVolume / 100;
        volumeIcon.innerHTML = volumeON;
    }
    else {
        volumeSlider.value = 0;
        audio.volume = 0;
        volumeIcon.innerHTML = volumeOFF;
    }
    updateVolumeSliderBg();
}

volumeBtn.addEventListener('click', toggleMute);

volumeIcon.addEventListener('mouseenter', showVolumeBar);
volumeIcon.addEventListener('mouseleave', hideVolumeBar);

volumeBarWrapper.addEventListener('mouseenter', showVolumeBar);
volumeBarWrapper.addEventListener('mouseleave', hideVolumeBar);

async function initPlayer() {
    const response = await fetch('js/songs.json');
    songsList = await response.json();
    SONGS_COUNT = songsList.length;
    songId = getRandomInt(1, SONGS_COUNT);

    overlayScreen.addEventListener('click', async () => {
        overlayScreen.classList.add('hidden');
        content.classList.remove('hidden');
        notice.classList.remove('hidden');
        playPause.innerHTML = pauseIcon;
        await playSong(songId);
    });
}

initPlayer();
