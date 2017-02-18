"use strict";

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
