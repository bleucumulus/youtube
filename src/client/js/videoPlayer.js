const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handleVideoEnded = () => {
  playBtnIcon.classList = "fas fa-play";
  timeline.value = 0;
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handlePlayKey = (event) => {
  if (event.target !== textarea) {
    if (event.code === "Space") {
      handlePlayClick();
    }
  }
};

const handlePlayVideoClick = () => {
  handlePlayClick();
};

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const changeVideoTime = (seconds) => {
  video.currentTime += seconds;
};

const handleArrowKey = (event) => {
  if (event.target !== textarea) {
    if (event.code === "ArrowRight") {
      changeVideoTime(5);
    } else if (event.code === "ArrowLeft") {
      changeVideoTime(-5);
    }
  }
};

const handleMuteKey = (event) => {
  if (event.target !== textarea) {
    if (event.keyCode === 77) {
      handleMute();
    }
  }
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
    volumeRange.value = volumeValue;
  } else {
    video.muted = true;
    volumeRange.value = 0;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
};

const handleVolumeChange = (event) => {
  const value = event.target.value;
  volumeValue = value;
  video.volume = value;
  if (video.volume !== 0) {
    video.muted = false;
    volumeRange.value = volumeValue;
    muteBtnIcon.classList = "fas fa-volume-up";
  } else {
    video.muted = true;
    volumeRange.value = volumeValue;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
};

const formatTime = (seconds) => {
  // formatting 00:00:00 or 00:00
  if (seconds >= 3600) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  }
};
const handleLoadedMetaData = () => {
  // 비디오의 총 시간
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  // 비디오의 현재 시간
  currentTime.innerText = formatTime(Math.floor(video.currentTime));

  // 재생 바
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  // 비디오 밖으로 마우스가 나갔다가 다시 들어왔을 때, timeout 없애려고 하는 것
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }

  // 마우스가 비디오 안에 들어왔을 때, class 추가
  videoControls.classList.add("showing");
  // Timeout에 대한 id 받아오기
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

video.addEventListener("ended", handleVideoEnded);
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handlePlayKey);
document.addEventListener("keyup", handleMuteKey);
document.addEventListener("keyup", handleArrowKey);
video.addEventListener("click", handlePlayVideoClick);
