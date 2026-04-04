let songs = [
    {
        name: "Jo Tum Mere Ho . by Anuv Jain",
        category: "sad",
        src: "songs/song1.mp3",
        picture: "pictures/song1.jpg"
    },
    {
        name: "For A Reason . by Karan Aujla",
        category: "fun",
        src: "songs/song2.mp3",
        picture: "pictures/song2.jfif"
    },
    {
        name: "Tension . by Diljit Dosanjh",
        category: "fun",
        src: "songs/song3.mp3",
        picture: "pictures/song3.jfif"
    },
    {
        name: "Arz Kiya Hai . by Anuv Jain",
        category: "love",
        src: "songs/song4.mp3",
        picture: "pictures/song4.jfif"
    },
    {
        name: "Samjho na . by Aditiya Rikhari",
        category: "love",
        src: "songs/song5.mp3",
        picture: "pictures/song5.jfif"
    },
    {
        name: "Shaky Shaky . by Sanju Rathod",
        category: "love",
        src: "songs/song6.mp3",
        picture: "pictures/song6.jpg"
    },
    {
        name: "Departure Lane . by Talha Anjum",
        category: "sad",
        src: "songs/song7.mp3",
        picture: "pictures/song7.jfif"
    }
];

let ul              = document.getElementById('song-list');
let progressBar     = document.getElementById('progressBar');
let volumeSlider    = document.getElementById('volumeBar');
let playPauseBtn    = document.getElementById('playPauseBtn');
let iconPlay        = playPauseBtn.querySelector('.icon-play');
let iconPause       = playPauseBtn.querySelector('.icon-pause');
let playerSongName  = document.getElementById('playerSongName');
let playerCategory  = document.getElementById('playerCategory');
let playerThumb     = document.getElementById('playerThumb');
let currentTimeEl   = document.getElementById('currentTime');
let durationEl      = document.getElementById('duration');
let playerBar       = document.getElementById('playerBar');

let audio   = new Audio();
let index   = 0;
let playing = false;

function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function setPlayIcon(isPlaying) {
    if (isPlaying) {
        iconPlay.style.display  = 'none';
        iconPause.style.display = 'block';
    } else {
        iconPlay.style.display  = 'block';
        iconPause.style.display = 'none';
    }
}

function updatePlayerBar(songIndex) {
    const song = songs[songIndex];
    playerSongName.textContent = song.name;
    playerCategory.textContent = song.category.charAt(0).toUpperCase() + song.category.slice(1);
    playerThumb.src = song.picture;
    playerBar.classList.add('visible');
}

function setActiveLi(songIndex) {
    document.querySelectorAll('#song-list li').forEach(li => {
        li.classList.remove('playing');
    });
    const activeLi = ul.querySelector(`li[data-song-index="${songIndex}"]`);
    if (activeLi) activeLi.classList.add('playing');
}

function loadSong(i) {
    audio.src = songs[i].src;
    audio.load();
    updatePlayerBar(i);
    setActiveLi(i);
    progressBar.value = 0;
    currentTimeEl.textContent = '0:00';
    durationEl.textContent    = '0:00';
}

function playSong() {
    audio.play();
    playing = true;
    setPlayIcon(true);
}

function pauseSong() {
    audio.pause();
    playing = false;
    setPlayIcon(false);
}

function togglePlay() {
    if (playing) {
        pauseSong();
    } else {

        if (!audio.src || audio.src === window.location.href) {
            loadSong(index);
        }
        playSong();
    }
}

function nextSong() {
    index = (index + 1) % songs.length;
    loadSong(index);
    playSong();
}

function previousSong() {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index);
    playSong();
}

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    nextSong();
});

progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration)) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

function renderList(songList) {
    ul.innerHTML = "";

    songList.forEach((song) => {
        const songIndex = songs.indexOf(song);

        let li = document.createElement('li');
        li.dataset.songIndex = songIndex;

        let img = document.createElement('img');
        img.src   = song.picture;
        img.alt   = song.name;
        img.className = 'li-thumb';

        let info = document.createElement('div');
        info.className = 'li-info';

        let nameEl = document.createElement('span');
        nameEl.className = 'li-name';
        nameEl.textContent = song.name;

        let catEl = document.createElement('span');
        catEl.className = 'li-cat';
        catEl.textContent = song.category.charAt(0).toUpperCase() + song.category.slice(1);

        info.append(nameEl, catEl);
        li.append(img, info);

        if (songIndex === index && playing) {
            li.classList.add('playing');
        }

        li.addEventListener('click', () => {
            index = songIndex;
            loadSong(index);
            playSong();
        });

        ul.append(li);
    });
}

renderList(songs);

let activeCategory = "All";
let categoryButtons = document.querySelectorAll('.cat-button');

categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        renderList(getFiltered());
    });
});

let searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', () => {
    renderList(getFiltered());
});

function getFiltered() {
    let query = searchBar.value.toLowerCase();
    return songs.filter((song) => {
        const cat         = activeCategory === "All" || song.category === activeCategory;
        const searchMatch = song.name.toLowerCase().includes(query);
        return cat && searchMatch;
    });
}

const searchToggleBtn  = document.getElementById('searchToggleBtn');
const mobileSearchBar  = document.getElementById('mobileSearchBar');
const searchCloseBtn   = document.getElementById('searchCloseBtn');
const searchBarMobile  = document.getElementById('searchBarMobile');
const categoryEl       = document.querySelector('.category');
const songListContainer = document.querySelector('.song-list-container');

function openMobileSearch() {
    mobileSearchBar.classList.add('open');
    categoryEl.classList.add('search-open');
    songListContainer.classList.add('search-open');
    searchBarMobile.focus();
}

function closeMobileSearch() {
    mobileSearchBar.classList.remove('open');
    categoryEl.classList.remove('search-open');
    songListContainer.classList.remove('search-open');
    searchBarMobile.value = '';
    renderList(getFiltered());
}

searchToggleBtn.addEventListener('click', openMobileSearch);
searchCloseBtn.addEventListener('click',  closeMobileSearch);

searchBarMobile.addEventListener('input', () => {
    searchBar.value = searchBarMobile.value;
    renderList(getFiltered());
});
