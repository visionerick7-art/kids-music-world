
// KIDS MUSIC WORLD - MUSIC PLAYER

const songs = [
  {
    title: "Happy Little Bear",
    category: "Animal Adventures",
    file: "assets/audio/song1.mp3"
  },
  {
    title: "Rainbow Colours",
    category: "Learning Music",
    file: "assets/audio/song2.mp3"
  },
  {
    title: "Dancing Elephant",
    category: "Animal Adventures",
    file: "assets/audio/song3.mp3"
  },
  {
    title: "Count With Me",
    category: "Numbers and Learning",
    file: "assets/audio/song4.mp3"
  },
  {
    title: "Funny Bunny",
    category: "Funny Songs",
    file: "assets/audio/song5.mp3"
  },
  {
    title: "African Little Stars",
    category: "African Music",
    file: "assets/audio/song6.mp3"
  }
];

let currentIndex = 0;
let isPlaying = false;

const audio = new Audio();
audio.preload = "metadata";

const titleElement = document.getElementById("currentSong");
const statusElement = document.getElementById("playerStatus");
const progressBar = document.getElementById("progressBar");
const currentTimeElement = document.getElementById("currentTime");
const durationElement = document.getElementById("duration");
const volumeControl = document.getElementById("volumeControl");
const playButton = document.getElementById("playButton");

// Display selected song
function loadSong(index) {
  currentIndex = (index + songs.length) % songs.length;

  const song = songs[currentIndex];

  audio.src = song.file;

  titleElement.textContent = song.title;
  statusElement.textContent = song.category;

  progressBar.value = 0;
  currentTimeElement.textContent = "0:00";
  durationElement.textContent = "0:00";

  playButton.textContent = "▶ Play";
}

// Play music
async function playSong() {
  if (!audio.src) {
    loadSong(currentIndex);
  }

  try {
    await audio.play();
    isPlaying = true;
    playButton.textContent = "⏸ Pause";
    statusElement.textContent = "Now playing 🎵";
  } catch (error) {
    isPlaying = false;
    statusElement.textContent =
      "Audio unavailable. Please add the MP3 song file.";
  }
}

// Pause music
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playButton.textContent = "▶ Play";
  statusElement.textContent = "Music paused.";
}

// Play or pause
function toggleMusic() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

// Next song
function nextSong() {
  loadSong(currentIndex + 1);
  playSong();
}

// Previous song
function previousSong() {
  loadSong(currentIndex - 1);
  playSong();
}

// Format audio time
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return minutes + ":" + String(remaining).padStart(2, "0");
}

// Update progress
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration)) return;

  progressBar.value =
    (audio.currentTime / audio.duration) * 100;

  currentTimeElement.textContent =
    formatTime(audio.currentTime);
});

// Display duration
audio.addEventListener("loadedmetadata", () => {
  durationElement.textContent =
    formatTime(audio.duration);
});

// Seek through song
progressBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime =
      (progressBar.value / 100) * audio.duration;
  }
});

// Volume control
volumeControl.addEventListener("input", () => {
  audio.volume = Number(volumeControl.value);
});

audio.volume = 0.8;

// Automatically play next song
audio.addEventListener("ended", () => {
  nextSong();
});

// Handle errors
audio.addEventListener("error", () => {
  isPlaying = false;
  playButton.textContent = "▶ Play";
  statusElement.textContent =
    "Could not load this song. Check the MP3 file.";
});

// Select a song from the song cards
function selectSong(name) {
  const index = songs.findIndex(song => song.title === name);

  if (index !== -1) {
    loadSong(index);
    playSong();
  }
}

// Load first song
loadSong(0);
