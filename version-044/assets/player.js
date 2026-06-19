(function () {
  function initPlayer(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('[data-play-button]');
    var overlay = box.querySelector('[data-player-overlay]');
    if (!video) {
      return;
    }

    var streamUrl = video.getAttribute('data-stream') || '';
    var hlsInstance = null;
    var loaded = false;

    function attachStream() {
      if (!streamUrl || loaded) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        loaded = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        loaded = true;
        return;
      }

      video.src = streamUrl;
      loaded = true;
    }

    function play() {
      attachStream();
      box.classList.add('is-playing');
      video.setAttribute('controls', 'controls');
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
      box.classList.add('is-playing');
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
  });
})();
