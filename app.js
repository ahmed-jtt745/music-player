let songs = [{ name: "Jo Tum Mere Ho . by Anuv Jain", category: "sad", src: "music-player/songs/song1.mp3" }, { name: "For A Reason . by Karan Aujla", category: "fun", src: "music-player/songs/song2.mp3" }, { name: "Tension . by Diljit Dosant", category: "fun", src: "music-player/songs/song3.mp3" }, { name: "Arz Kiya ha . by Anuv Jain", category: "love", src: "music-player/songs/song4.mp3" }];
let ul = document.getElementById('song-list');
let progressBar = document.getElementById('progressBar');
let volumeSlider = document.getElementById('volumeBar');
let audio = new Audio();
let index = 0;

audio.src = songs[0].src;
audio.load();

function loadSong(index) {
    audio.src = songs[index].src;
    audio.load();
}

function playSong(index) {
    audio.play();
}

function nextSong() {
    index = (index + 1) % songs.length;
    loadSong(index);
    audio.play();
}

function pauseSong() {
    audio.pause();
}

function previousSong() {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index);
    audio.play();
}

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
});

progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function renderList(songList) {
    ul.innerHTML = "";

    songList.forEach((song, songIndex) => {
        let li = document.createElement('li');
        li.innerText = song.name;
        li.dataset.index = index;

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
        const category = btn.dataset.category;
        activeCategory = category;

        renderList(getFiltered());
    });
});

let searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', () => {
    let query = searchBar.value;

    renderList(getFiltered());
});


function getFiltered() {
    let query = searchBar.value;

    return songs.filter((song) => {
        const cat = activeCategory == "All" || song.category == activeCategory;
        const searchMatch = song.name.includes(query);

        return cat && searchMatch;
    });
}