const image = document.querySelector('img');
let title = document.getElementById('title');
let artist = document.getElementById('artist');
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
const defaultApiUrl = "http://api.sr.se/api/v2";
const defaultChannelId = "132";

// get all channel ids
async function getRadioChannels() {
  try {
    let response = await fetch(channelsUrl);
    let res = await response.json();
    const channels = res.channels;

    // console.log("All channels: ", channels);
    return channels ;

  } catch (error) {
    console.log("error :", error);
  }
}

async function fetchCurrentlyPlayingByChannelId(id) {
  try {
    let response = await fetch(`${defaultApiUrl}/playlists/getplaylistbychannelid?id=${id}&format=json&indent=true`);
    // `${defaultApiUrl}/playlists/getplaylistbychannelid?id=${id}&format=json`
    let playlist = await response.json();
    // const channels = res.channels;

    // console.log("All channels: ", channels);
    console.log(playlist);
    return playlist ;

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
    return mp3Channels; // returns a list of all the channel's mp4 urls
  });
  // console.log("All mp3Channels are:", mp3Channels);

  let channelNames =[];
  channels.map((channel)=>{
    channelNames.push(channel.name);
    return channelNames; // returns a list of all the channel's mp4 urls
  });

  //now get all channel Ids
  const allChannelIds = [];
  channels.map((channel)=>{
    allChannelIds.push(channel.id);
    return allChannelIds;
  });

  console.log(allChannelIds);
  console.log("current mp3 url playing", mp3Channels[stationIndex]);
  console.log("current channel Id is", allChannelIds[stationIndex]);
  // console.log("current Channel is playing", channelIdSubstring);

  //pass channel Id to fetchCurrentlyPlayingByChannelId to get the currently playing song
    console.log(allChannelIds[stationIndex]);
    
    let playlist = await fetchCurrentlyPlayingByChannelId(allChannelIds[stationIndex]);
    //console.log(playlist.song[0].description);
    // fetchInterval = setInterval(fetchCurrentlyPlayingByChannelId, 3000);
  
  
   title.textContent = channelNames[stationIndex];
   if(playlist.song.length !== 0){
    artist.textContent = playlist.song[0].description ;
   } else {
    artist.textContent = "No song currently playing" ;
   }

   
  //  setInterval(() => {
  //   fetchCurrentlyPlayingByChannelId(allChannelIds[stationIndex]);
  //   artist.textContent = playlist.song[0].description // i need the song frpm fetchCurrentlyPlayingByChannelId() here
  //  }, 10000);
   
   image.src = `./img/${Math.floor(Math.random() * 9)}.jpeg`;
   music.src = mp3Channels[stationIndex];

  //  if(playlist.song.length != 0){
  //   music.src = mp3Channels[stationIndex]
  //  } else {
  //   music.src = "";
  //  }
   
 
}

loadStation(132);




// Previous station
async function prevStation() {
  // example mp3url https://sverigesradio.se/topsy/direkt/srapi/132.mp3
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

// Next station
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





