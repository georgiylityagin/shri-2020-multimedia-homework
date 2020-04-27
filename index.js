function openFullScreen(e) {
  e.preventDefault();
  
  const fullScreen = document.querySelectorAll('.fullscreen');

  if (fullScreen.length === 0) {
    e.target.classList.add('fullscreen');

    const controlPanel = document.querySelector('.control-panel');
    controlPanel.style.display = 'flex';
    controlPanel.classList.add('open');
    addFilter(e.target);
    drawDiagram();
    return;
  }

  if (e.target.paused) {
    e.target.play();
  } else {
    e.target.pause();
  }

}

function closeFullScreen(e) {
  e.preventDefault();
  
  const fullScreen = document.querySelector('.fullscreen');

  if (fullScreen) {
    fullScreen.classList.remove('fullscreen');

    const controlPanel = document.querySelector('.control-panel');
    controlPanel.style.display = 'none';
  }
}

function addFilter(target) {
  const brightness = target.getAttribute(`data-brightness`);
  const contrast = target.getAttribute(`data-contrast`);

  target.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
}

function updateFilter(target) {
  const brightness = document.getElementById('brightness');
  const contrast = document.getElementById('contrast');

  if (brightness) {
    target.dataset.brightness = brightness.value;
  }
  if (contrast) {
    target.dataset.contrast = contrast.value;
  }

  addFilter(target);
}

function setVolume(event) {
  const video = document.querySelector('.fullscreen');
  const volume = event.target.value;

  if (volume > 0) {
    video.muted = false
    video.volume = volume;
  } else {
    video.muted = true
    video.volume = volume;
  }
}

function drawDiagram() {
  const volume = document.querySelectorAll('.volume');
  const context = new (window.AudioContext || window.webkitAudioContext)();

  const transfer = context.createChannelMerger(4);
  transfer.connect(context.destination);

  document.querySelectorAll('.video').forEach((videoSource) => {
    const source = context.createMediaElementSource(videoSource);
    source.connect(transfer);
  });

  const analyser = context.createAnalyser();
  analyser.fftSize = 32;
  transfer.connect(analyser);

  const streamData = new Uint8Array(analyser.frequencyBinCount);

  function update() {

    requestAnimationFrame(update);

    analyser.getByteFrequencyData(streamData);

    volume.forEach((vol, i) => {
      vol.style.height = streamData[i]/1.5 + 'px';
    });
  };
  update();
}


document.addEventListener('DOMContentLoaded', () => {

  const videos = document.querySelectorAll('.video');

  videos.forEach(video => {
    video.addEventListener('click', openFullScreen);
  })

  const button = document.querySelector('#AllCameras');
  button.addEventListener('click', closeFullScreen);

  const controlPanel = document.querySelector('.control-panel');
  controlPanel.addEventListener('change', e => {
    const fullScreen = document.querySelector('.fullscreen');

    if (e.target.id === 'volume') {
      setVolume(e);
    } else if (e.target.id === 'brightness' || e.target.id === 'contrast') {
      updateFilter(fullScreen)
    }
  });
})