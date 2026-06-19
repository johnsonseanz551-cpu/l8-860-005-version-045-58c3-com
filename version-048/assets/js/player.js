var MoviePlayer = (function () {
    function attach(video, streamUrl) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return null;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    hls.destroy();
                }
            });

            return hls;
        }

        video.src = streamUrl;
        return null;
    }

    function mount(videoId, coverId, streamUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var hls = null;
        var loaded = false;

        if (!video || !cover || !streamUrl) {
            return;
        }

        function start() {
            if (!loaded) {
                hls = attach(video, streamUrl);
                loaded = true;
            }

            cover.classList.add("is-hidden");

            var playTask = video.play();

            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function () {
                    cover.classList.remove("is-hidden");
                });
            }
        }

        cover.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (!loaded) {
                start();
            }
        });
        video.addEventListener("play", function () {
            cover.classList.add("is-hidden");
        });
        window.addEventListener("pagehide", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    }

    return {
        mount: mount
    };
}());
