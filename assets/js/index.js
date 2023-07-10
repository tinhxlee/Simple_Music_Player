// Base
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "TINHXPEAR_PLAYER";
// Variables
const playlist = $(".playlist");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;

const heading = $("header h2");
const cdThumb = $(".cd .cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
// code
const app = {
  // index dau tien cua mang songs
  currentIndex: 0,
  isPlaying: false,
  isActiveRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  // data
  songs: [
    {
      name: "Co Hay Tu Bao Gio 2",
      singer: "Nie - Hast - KET",
      path: "./assets/music/cohaytubaogio2.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Em Khong Khoc",
      singer: "buitruonglinh",
      path: "./assets/music/emkhongkhoc.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Em Qua Ngoc",
      singer: "Chuy Sa Lisa",
      path: "./assets/music/emquangoc.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Muoi Nam",
      singer: "Den",
      path: "./assets/music/muoinam.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Nau an cho em",
      singer: "Den",
      path: "./assets/music/nauanchoem.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "Nuoc mat em lau bang tinh yeu moi",
      singer: "Dalab",
      path: "./assets/music/nuocmatemlaubangtinhyeumoi.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Sinh ra da la thu doi lap nhau",
      singer: "Dalab",
      path: "./assets/music/sinhradalathudoilapnhau.mp3",
      image: "./assets/img/song7.jpg",
    },
    {
      name: "Thuc giac",
      singer: "Dalab",
      path: "./assets/music/thucgiac.mp3",
      image: "./assets/img/song8.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  // Render function for render view
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },
  // Method defineProperty
  defineProperties: function () {
    // Tao property currentSong de lay ra bai hat dau tien
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  //Handles events: Xu ly su kien
  handleEvents: function () {
    const _this = this;

    // Xu ly cd quay va dung
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, // 10s
        iterations: Infinity, // loop vo han lan
      }
    );
    cdThumbAnimate.pause();
    // Lang nghe su kien keo trang web
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xu ly khi play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi song dc play
    audio.onplay = function () {
      player.classList.add("playing");
      // Phai define _this vi this trong ham nay se la playBtn
      _this.isPlaying = true;
      cdThumbAnimate.play();
    };
    // Khi song dc pause
    audio.onpause = function () {
      player.classList.remove("playing");
      _this.isPlaying = false;
      cdThumbAnimate.pause();
    };
    // Khi tien do song dc change
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercentage = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercentage;
      }
    };
    // Xu ly khi tua song
    progress.onchange = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
      audio.value = e.target.value;
    };
    // Xu ly next song
    nextBtn.onclick = function () {
      if (_this.isActiveRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActive();
    };
    // Xu ly prev song
    prevBtn.onclick = function () {
      if (_this.isActiveRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActive();
    };

    // Xu ly random song
    randomBtn.onclick = function () {
      // if (_this.isActiveRandom) {
      //   randomBtn.classList.remove("active");
      //   _this.isActiveRandom = false;
      // } else {
      //   randomBtn.classList.add("active");
      //   _this.isActiveRandom = true;
      // }

      // Tuong tu code tren ta co
      _this.isActiveRandom = !_this.isActiveRandom;
      _this.setConfig("isActiveRandom", _this.isActiveRandom);
      randomBtn.classList.toggle("active", _this.isActiveRandom);
    };
    // Xu ly repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    // Xu ly chuyen bai khi ket thuc bai hat
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // method click item in playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Xu ly khi click vao song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        // Xu ly khi click vao option
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  scrollToActive: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },
  // load current song method, tai bai hat dau tien vao UI cd khi chay ung dung
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isActiveRandom = this.config.isActiveRandom;
    this.isRepeat = this.config.isRepeat;
    randomBtn.classList.toggle("active", this.isActiveRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
  // nextSong method
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  // prevSong method
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  // randomSong method
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  // Method start dung de bat dau chuong trinh
  start: function () {
    // Call load config
    this.loadConfig();
    // Call defineProperty
    this.defineProperties();
    // Call handleEvents function
    this.handleEvents();
    // Call loadCurrentSong function
    this.loadCurrentSong();
    // Call render function
    this.render();
  },
};

// Run function start
app.start();

// Code
