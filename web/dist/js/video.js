'use strict';
// Source: bower_components/videojs-playlists/dist/videojs-playlists.js
/*!
 * videojs-playlists - Playlists done right for Videojs
 * v0.1.1
 * 
 * copyright Antonio Laguna 2013
 * MIT License
*/
//videojs-playlists.js
function playList(options,arg){
  var player = this;
  player.pl = player.pl || {};
  var index = parseInt(options,10);

  player.pl._guessVideoType = function(video){
    var videoTypes = {
      'webm' : 'video/webm',
      'mp4' : 'video/mp4',
      'ogv' : 'video/ogg'
    };
    var extension = video.split('.').pop();

    return videoTypes[extension] || '';
  };

  player.pl.init = function(videos, options) {
    options = options || {};
    player.pl.videos = [];
    player.pl.current = 0;
    player.on('ended', player.pl._videoEnd);

    if (options.getVideoSource) {
      player.pl.getVideoSource = options.getVideoSource;
    }

    player.pl._addVideos(videos);
  };

  player.pl._updatePoster = function(posterURL) {
    player.poster(posterURL);
    player.removeChild(player.posterImage);
    player.posterImage = player.addChild("posterImage");
  };

  player.pl._addVideos = function(videos){
    for (var i = 0, length = videos.length; i < length; i++){
      var aux = [];
      for (var j = 0, len = videos[i].src.length; j < len; j++){
        aux.push({
          type : player.pl._guessVideoType(videos[i].src[j]),
          src : videos[i].src[j]
        });
      }
      videos[i].src = aux;
      player.pl.videos.push(videos[i]);
    }
  };

  player.pl._nextPrev = function(func){
    var comparison, addendum;

    if (func === 'next'){
      comparison = player.pl.videos.length -1;
      addendum = 1;
    }
    else {
      comparison = 0;
      addendum = -1;
    }

    if (player.pl.current !== comparison){
      var newIndex = player.pl.current + addendum;
      player.pl._setVideo(newIndex);
      player.trigger(func, [player.pl.videos[newIndex]]);
    }
  };

  player.pl._setVideo = function(index){
    if (index < player.pl.videos.length){
      player.pl.current = index;
      player.pl.currentVideo = player.pl.videos[index];

      if (!player.paused()){
        player.pl._resumeVideo();
      }

      if (player.pl.getVideoSource) {
        player.pl.getVideoSource(player.pl.videos[index], function(src, poster) {
          player.pl._setVideoSource(src, poster);
        });
      } else {
        player.pl._setVideoSource(player.pl.videos[index].src, player.pl.videos[index].poster);
      }
    }
  };

  player.pl._setVideoSource = function(src, poster) {
    player.src(src);
    player.pl._updatePoster(poster);
  };

  player.pl._resumeVideo = function(){
    player.one('loadstart',function(){
      player.play();
    });
  };

  player.pl._videoEnd = function(){
    if (player.pl.current === player.pl.videos.length -1){
      player.trigger('lastVideoEnded');
    }
    else {
      player.pl._resumeVideo();
      player.next();
    }
  };

  if (options instanceof Array){
    player.pl.init(options, arg);
    player.pl._setVideo(0);
    return player;
  }
  else if (index === index){ // NaN
    player.pl._setVideo(index);
    return player;
  }
  else if (typeof options === 'string' && typeof player.pl[options] !== 'undefined'){
    player.pl[options].apply(player);
    return player;
  }
}

videojs.Player.prototype.next = function(){
  this.pl._nextPrev('next');
  return this;
};
videojs.Player.prototype.prev = function(){
  this.pl._nextPrev('prev');
  return this;
};

videojs.plugin('playList', playList);
;
// Source: src/js/misc/video.js
/* Disqus thread */
var disqus_shortname = 'asseln';
var disqus_identifier = 'tl-all';

jQuery(function($) {
	var videotag = ($("<video/>")
		.attr({
			"width": "auto", "height": "auto",
			"poster": "/img/bottich_poster.jpg",
			"preload": "metadata",
			"controls": ""
		})
		.addClass("video-js vjs-default-skin vjs-big-play-centered")
	)[0];

	$("#player").html(videotag);

	videojs(
		videotag,
		{"controlBar": {"volumeControl": false, "muteToggle": false}, "playbackRates": [0.25, 0.5, 0.75, 1.0, 1.5, 2]},
		function() {
			var player = this;

			// query string to array
			// http://stackoverflow.com/questions/901115#3855394
			var qs = (function(a) {
				if (a == "") return {};
				var b = {};
				for (var i = 0; i < a.length; ++i) {
					var p = a[i].split('=', 2);
					if (p.length == 1)
						b[p[0]] = "";
					else
						b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
				}
				return b;
			})(window.location.search.substr(1).split('&'));

			// keep references used in update loop
			var here = document.location.origin + document.location.pathname;
			var link_href = $("#link_href")[0];
			var link_text = $("#link_text")[0];
			var download_href = $("#download_href")[0];

			var lastvid = -1;
			var current = $();

			function reloadPlaylist(selectedVideo) {
				$.getJSON("//videos.asseln.attraktor.org/videos.json", function(videos) {
					if (!videos.length) {
						return;
					}

					var playlist = $("<ul/>").addClass("nav nav-pills nav-stacked");

					$.each(videos, function(idx, video) {
						playlist.append($("<li/>")
							.html($("<a/>")
								.text(video.title)
								.attr("href", here + "?v=" + video.title))
							.attr({
								"id": "video-" + idx,
								"data-video-selector": video.title,
								"data-video-src": video.src[0]
							})
						);
					});

					$("#playlist").empty();
					lastvid = -1;

					player.playList(videos);

					lastvid = videos.length-1;
					$("#playlist").html(playlist);

					var selected = lastvid;
					if (selectedVideo) {
						var selector = $("[data-video-selector='" + CSS.escape(selectedVideo) + "']");
						if (selector.length) {
							selected = selector.index();
						}
					}

					var seek = 0;
					var seek_m = location.hash.replace(/^#t=([0-9]+)m.*/, "$1");
					var seek_s = location.hash.replace(/^#t=([0-9]+m)?([0-9.]+)s.*/, "$2");

					if ($.isNumeric(seek_m)) {
						seek += seek_m * 60
					}

					if ($.isNumeric(seek_s)) {
						seek += seek_s * 1
					}

					if (seek) {
						player.one("loadedmetadata", function() {
							// check if the selected video is actually playing
							// if playList() fails to open the selected file,
							// the event could trigger on the wrong video
							if (selected === player.pl.current) {
								player.currentTime(seek);
								player.play();
							}
						});
					}

					player.playList(selected);
					updateActive();

					// TODO: quickfix - think again. what could possibly go wrong?
					if ($.isNumeric(qs["rate"])) {
						player.playbackRate(qs["rate"]);
					}
				});
			}

			function updateActive() {
				current.removeClass("active");
				current = $("#video-" + player.pl.current).addClass("active");

				download_href.href = current.data("video-src");
				link_href.href = link_text.innerHTML = getCurrentURI();

				var offset = current.position().top - $("#playlist").position().top
								- ($("#listbox").height() / 2) + (current.height() / 2);
				$("#listbox").animate({scrollTop: offset}, 200);
			}

			function getCurrentURI() {
				if (!current || !current.length) {
					return here;
				}

				var time = player.currentTime();
				var rate = player.playbackRate();

				return (here + "?v=" + current.data("video-selector") +
					((rate != 1) ? ("&rate=" + rate) : ("")) +
					((time) ? ("#t=" + Math.floor(time / 60) + "m" + Math.floor(time % 60) + "s") : (""))
				);
			}

			player.on("next", updateActive);
			player.on("prev", updateActive);

			// TODO: optimize?
			// link content depends on current, player.playbackRate(), player.currentTime()
//			player.on("timeupdate", function() { link_href.href = link_text.innerHTML = getCurrentURI() });
			player.setInterval(function() { link_href.href = link_text.innerHTML = getCurrentURI() }, 500);

			$("[data-action=next]").on("click", function() {
				player.next();
			});

			$("[data-action=prev]").on("click", function() {
				player.prev();
			});

			$("[data-action=first]").on("click", function() {
				player.playList(0);
				updateActive();
			});

			$("[data-action=last]").on("click", function() {
				if (lastvid >= 0) {
					player.playList(lastvid);
					updateActive();
				}
			});

			$("#playlist").on("click", "li", function(e) {
				e.preventDefault();
				player.playList($(this).index());
				updateActive();
			});

			reloadPlaylist(("" + qs["v"]).replace(/[^0-9-]*/g, ""));
		}
	);
});
