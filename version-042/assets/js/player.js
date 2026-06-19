(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function prepareVideo(video) {
    var stream = video.getAttribute('data-stream');
    var panel = video.closest('[data-player]');
    var overlay = panel ? panel.querySelector('.play-overlay') : null;
    var prepared = false;

    function attachStream() {
      if (prepared || !stream) {
        return;
      }
      prepared = true;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video._hls = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      }
    }

    attachStream();

    if (overlay) {
      overlay.addEventListener('click', function () {
        attachStream();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      });
    }

    video.addEventListener('play', function () {
      if (panel) {
        panel.classList.add('playing');
      }
    });

    video.addEventListener('pause', function () {
      if (panel && video.currentTime === 0) {
        panel.classList.remove('playing');
      }
    });
  }

  ready(function () {
    document.querySelectorAll('.video-player').forEach(prepareVideo);
  });
})();
