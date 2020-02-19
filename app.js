//Custom functions
var chatScroll;
var scrollToBottom = true;

function chatMsg(msg){
	var chatEl = $('#messages');

	var chatContent = chatEl.html() + msg + "<br>";
	chatEl.html(chatContent);

	if(scrollToBottom)
		chatEl.scrollTop(chatEl.height());

}

$('#messages').on("scroll", function(a, b, c){
	scrollToBottom = false;
	chatScroll = $('#messages');
	var scrollHeight = document.getElementById('messages').scrollHeight;
	var scrollPosition = $(chatScroll).scrollTop() + $(chatScroll).height();
	
	if (scrollHeight == scrollPosition){
		scrollToBottom = true;
	}
})

function newChatMessage(message, pb){
	chatMsg(message);
}

function startVideo(video, pb){
	var videoEl = $('#videos .row');
	var videoPlayer = $("<div class='col-sm-4' id=\"" + video.videoId + "\"><div class='card'><video class='card-img-top' autoplay src=\"resources/" + pb.sessionId + "/" + video.videoId + ".webm\"></video><div class='card-body p-1 text-center'><div class='card-text'>"+ video.username +"</div></div></div></div>");
	videoEl.append(videoPlayer);

	chatMsg("<small class='text-muted'><em>"+video.username + " - turned the video on</em></small>");
}

function stopVideo(video, pb){
	var videoEl = $('#' + video.videoId);
	videoEl.remove();
	chatMsg("<small class='text-muted'><em>"+video.username + " - turned the video off</em></small>");
}

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    (hours.toString().length == 1) ? hours = '0'+hours : void 0;    
    (minutes.toString().length == 1) ? minutes = '0'+minutes : void 0;    
    (seconds.toString().length == 1) ? seconds = '0'+seconds : void 0; 

    return hours + ":" + minutes + ":" + seconds;
}

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

(function ( ) {

	

	function Playback ( config ) {
		if(!config) config = {};

		this.state = 'idle',
		this.events = config.events || [];
		this.resources = config.res;

		this.sessionId = config.sessionId;
		this.sessionLength = config.sessionLength;
		this.progress = 0;

		this.progressEl = config.progressEl;

		this.allEventsTime = {};

		this.current = {
			Index: -1,
			Event: null,
			Time: 0,
		}

		this.startTime;

		this.loop;
		this.scrubInterval;

		if(config.start && config.start == true)
			this.init ();

	}

	Playback.prototype._evtTrigger = function(data, pb){
		//console.log(data.action, data.content);
		window[data.action](data.content, pb);
	}

	Playback.prototype.init = function(){

		var $this = this;

		this._getEventsTime ();

		this.startTime = Date.now ();

		this.scrubInterval = setInterval ( function () {
			$this._updateScrub();

		},100);

		$('#totalTime').html(secondsToTime(this.sessionLength/1000));

		this.loop = setInterval ( function () {


			var now = Date.now();

			$this.current.Time = now - $this.startTime;

			$this.progress = ($this.current.Time / $this.sessionLength) * 100;

			var evtTime = $this.allEventsTime[$this.current.Index + 1];

			if( evtTime && $this.current.Time >= evtTime) {

				$this.current.Index += 1;
				$this.current.Event = $this.events[$this.current.Index];			
				
				$this._evtTrigger($this.current.Event, $this);

				if ( $this.current.Index == $this.events.length-1 ) {

					$this.current.Event = null;

					$this.stop ();

					chatMsg("<div class='text-center'>End of session!</div>");
				}

			}			

		}, 40);

	}

	Playback.prototype._updateScrub = function(){
		if(this.progressEl){
			$(this.progressEl).css("width", this.progress + "%");
		}
		$('#currentTime').html(secondsToTime(this.current.Time/1000));
	}

	Playback.prototype._getEventsTime = function () {
		var $this = this;

		this.events.map (function (obj, index) {
			var time = obj.time;

			if(time) {
				$this.allEventsTime[index] = time;
			}
		})
		
	}

	Playback.prototype.stop = function () {
		clearInterval(this.loop);
		clearInterval(this.scrubInterval);
	}

	window.Playback = Playback;

})();

var session = qs['sID'] ? qs['sID'] : "123456";
var pb; 

(function(){
	$.ajax({
		url: "sessions/" + session + ".json",
		method: "GET",
		success: function(data, status, ajx){
			pb = new Playback({
				events : data.events,
				sessionId: data.sessionId,
				sessionLength: data.sessionLength,
				progressEl: "#scrubbar",
				start: false
			})
		},
		error: function(ajx, statusErr, thrownErr){
			alert('Failed to load session! It might be deleted or just wrong!');
		}
	})

	$('#play_btn').click(function(){
		$("#play_btn").addClass('d-none');
		$("#stop_btn").removeClass('d-none');
		pb.init();
	})
	$('#stop_btn').click(function(){
		$("#stop_btn").addClass('d-none');
		$("#play_btn").removeClass('d-none');
		pb.stop();
	})
})();
