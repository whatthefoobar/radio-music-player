const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const cardContainer = document.querySelector(".container")


// Current Song // current station
let stationIndex = 0;

// Check if Playing
let isPlaying = false;

// endpoint for channels including mp3 urls to play current radio program
const channelsUrl = "https://api.sr.se/api/v2/channels?format=json&indent=true&pagination=false";

async function getRadioChannels() {
  try {
    let response = await fetch(channelsUrl);
    let res = await response.json();
    
    return res.channels;

  } catch (error) {
    console.log("error :", error);
  }
}

// Play
function playStation() {
  isPlaying = true;
  playBtn.classList.replace('fa-play', 'fa-pause');
  playBtn.setAttribute('title', 'Pause');
  music.play();
  console.log(music.src);
}

// Pause
function pauseStation() {
  isPlaying = false;
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
  music.pause();
}

// // Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseStation() : playStation()));

// Update DOM // change this or its position
async function loadStation() {
  let channels = await getRadioChannels();
  
  let mp3Channels= [];
  channels.map((channel)=>{
    mp3Channels.push(channel.liveaudio.url);
    return mp3Channels;
  });
  // console.log("All mp3Channels are:", mp3Channels);

  let channelNames =[];
  channels.map((channel)=>{
    channelNames.push(channel.name);
    return channelNames;
  });
  // console.log("All channel names are:", channelNames);
  title.textContent = channelNames[stationIndex];
  image.src = `./img/${Math.floor(Math.random() * 9)}.jpeg`;
  music.src = mp3Channels[stationIndex];
  //now get Radio playlist Data here

  
}

// Previous Song // previous station
async function prevStation() {
  let channels = await getRadioChannels();
  
  let mp3Channels= [];
  channels.map((channel)=>{
    mp3Channels.push(channel.liveaudio.url);
    return mp3Channels;
  });

  stationIndex--;
  if (stationIndex < 0) {
    stationIndex = mp3Channels.length - 1;
  }

  loadStation(mp3Channels[stationIndex]);
  // playStation();
  pauseStation();

}

// Next Song // next station
async function nextStation() {
  let channels = await getRadioChannels();
  // console.log(channels);

  let mp3Channels= [];
  channels.map((channel)=>{
    mp3Channels.push(channel.liveaudio.url);
    return mp3Channels;
  });

  stationIndex++;
  if (stationIndex > mp3Channels.length - 1) {
    stationIndex = 0;
  }

  loadStation(mp3Channels[stationIndex]);
  // playStation();
  pauseStation();
};

// Update Progress Bar & Time
function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // Delay switching duration Element to avoid NaN
    if (durationSeconds) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    // Calculate display for currentTime
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

// Set Progress Bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

// Event Listeners
prevBtn.addEventListener('click', prevStation);
nextBtn.addEventListener('click', nextStation);
music.addEventListener('ended', nextStation);
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);

// random color background 

const background = document.querySelector(".background");

const getRandomNumber = (limit) => {
  return Math.floor(Math.random() * limit);
};

const getRandomColor = () => {
  const h = getRandomNumber(360);
  const s = getRandomNumber(100);
  const l = getRandomNumber(100);

  return `hsl(${h}deg, ${s}%, ${l}%)`;
};

const setBackgroundColor = () => {
  const randomColor = getRandomColor();
  background.style.backgroundColor = randomColor;
  background.style.color = randomColor;
};

setBackgroundColor();

setInterval(() => {
  setBackgroundColor();
}, 1500);





