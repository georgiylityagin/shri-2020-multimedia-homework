function openFullScreen(e) {
  e.preventDefault();
  const video = e.target;

  if (video.localName === 'video') {
    const classList = Array.from(video.classList);

    if (!classList.includes('fullscreen')) {
      video.classList.add('fullscreen');
    }
  }
}

function closeFullScreen(e) {
  e.preventDefault();
  
  const fullScreen = document.querySelector('.fullscreen');

  if (fullScreen) {
    fullScreen.classList.remove('fullscreen');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelector('.videos-grid');
  videos.addEventListener('click', openFullScreen);

  const button = document.querySelector('#AllCameras');
  button.addEventListener('click', closeFullScreen)
})