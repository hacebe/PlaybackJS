//Custom functions

function newChatMessage(message){
	var chatEl = document.getElementById('messages');
	var chatContent = chatEl.innerHTML + message + "<br>";
	chatEl.innerHTML = chatContent;
}
function startVideo(video){
	var videoEl = document.getElementById('videos');
	var videoPlayer = document.createElement('image');
	videoPlayer.src="data:image/png;base64," + video
	videoEl.innerHTML = videoPlayer;
}

(function ( ) {

	

	function Playback ( config ) {
		if(!config) config = {};

		this.state = 'idle',
		this.events = config.events || [];
		this.resources = config.res;

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

	Playback.prototype._evtTrigger = function(data){
		//console.log(data.action, data.content);
		window[data.action](data.content);
	}

	Playback.prototype.init = function(){

		var $this = this;

		this._getEventsTime ();

		this.startTime = Date.now ();

		console.log(this);

		this.loop = setInterval ( function () {


			var now = Date.now();

			$this.current.Time = now - $this.startTime;

			var evtTime = $this.allEventsTime[$this.current.Index + 1];

			if( evtTime && $this.current.Time >= evtTime) {

				$this.current.Index += 1;
				$this.current.Event = $this.events[$this.current.Index];

				$this._evtTrigger($this.current.Event);

			}

			else if ( $this.current.Time >= $this.allEventsTime[$this.events.length -1] ) {

				$this.current.Event = null;

				$this.stop ();

				console.debug('end');
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
	res: recordedSession.resources,
	start: true
});

console.log(pb);