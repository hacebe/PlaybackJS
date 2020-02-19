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

(function ( ) {

	

	function Playback ( config ) {
		if(!config) config = {};

		this.state = 'idle',
		this.events = config.events || [];
		this.resources = config.res;

		this.sessionId = config.sessionId;

		this.allEventsTime = {};

		this.current = {
			Index: -1,
			Event: null,
			Time: 0,
		}

		this.startTime;

		this.loop;

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

		this.loop = setInterval ( function () {


			var now = Date.now();

			$this.current.Time = now - $this.startTime;

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
	}

	window.Playback = Playback;

})();

var pb = new Playback({
	events : recordedSession.events,
	sessionId: recordedSession.sessionId,
	start: true
});
