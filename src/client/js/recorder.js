const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleStart = () => {
  // 녹화되는 함수
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const handleStop = () => {
  // 녹화 중단
  recorder.stop();
  startBtn.innerText = "Download";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
};

const handleDownload = async () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  // 다운로드 버튼 누르면
  // 1. 카메라 끄기 (해결 안됨 !)
  // 이거 getUserMedia에서 video:false처럼 권한을 안주면 되지 않을까?,,,,,,
  // 2. 비디오도 끄기
  // 3. 미리보기 그만 나오게 하기

  video.pause();
  video.src = "";
  stream.getTracks()[0].stop();
  // 이 밑 코드들은 될지 안될지 모르겠지만, 일단 나중에 힌트라도 얻으라고 넣어둠
  document.body.removeChild(a);
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: false,
  });
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 250, height: 250 },
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
