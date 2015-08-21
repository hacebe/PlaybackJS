(function ( ) {

	function Playback ( config ) {
		if(!config) config = {};

		this.state = 'idle',
		this.events = config.events || [];

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
	start: true
});