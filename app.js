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

		this.config = {

		}

		this.devices = {
			Mouse : {
				pointer : new Pointer ()
			}
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

	Playback.prototype.startRecording = function (deviceName, eventName, replace ) {
		if(!this.config[deviceName]) this.config[deviceName] = {}
		if(!this.config[deviceName][eventName]) this.config[deviceName][eventName] = {};

		this.config[deviceName][eventName].allowRecording = true;

		this._clearEvents ();

		this.sessionStartTime = Date.now ();

		this._prepareDevice(deviceName, eventName);
	}

	Playback.prototype.stopRecording = function ( deviceName, eventName ) {

		this.config[deviceName][eventName].allowRecording = false;
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

	Playback.prototype._prepareDevice = function ( deviceName, eventName ) {
		var $this = this;

		if(deviceName == 'mouse') {
			if(eventName == 'mousemove') {
				window.addEventListener ('mousemove', function () {
					if($this.config[deviceName][eventName].allowRecording) {
						$this._OnMouseMove.apply($this, arguments);
					}
				}, true);
			}
		}
	}

	//
	//	Mouse Events Callback
	//

	Playback.prototype._OnMouseMove = function (event) {
		var pos = {
			x : event.x || event.clientX || event.pageX || event.screeX || event.offsetX,
			y : event.y || event.clientY || event.pageY || event.screeY || event.offsetY
		}

		var event = {name: 'mousemove', pos: pos};

		this._registerEvent (event);
	}

	Playback.prototype._registerEvent = function (event) {
		event.time = Date.now () - this.sessionStartTime;
		
		this.events.push(event);

		this._getEventsTime ();
	}

	Playback.prototype.stop = function () {
		clearInterval(this.loop);
	}

	Playback.prototype._clearEvents = function () {
		this.events = [];
	}

	Playback.prototype.replay = function () {
		var $this = this;
		var i = -1;
		var interval = setInterval(function () {
			
			var e = $this.events[++i];

			if(i == $this.events.length - 1) {
				clearInterval(interval);
				return;
			}

			$this.devices.Mouse.pointer.moveTo(e.pos);

		}, 16);
	}

	function Pointer () {
		this.dom = document.createElement("span");

		this.dom.style.width  = '10px';
		this.dom.style.height = '10px';
		this.dom.style.position = 'absolute';
		this.dom.style.backgroundColor = 'red';

		document.body.appendChild(this.dom);

		this.moveTo({x: -999, y: -999})

	}

	Pointer.prototype.moveTo = function ( pos ) {
		this.dom.style.left = pos.x + 'px';
		this.dom.style.top = pos.y + 'px';
	}

	window.Playback = Playback;

})();

/*var pb = new Playback({
	events : recordedSession.events,
	start: true
});
*/

var pb = new Playback({events: e});

/*pb.startRecording ('mouse', 'mousemove');

setTimeout (function () {
	pb.stopRecording ('mouse', 'mousemove');

	console.log(pb.events);
}, 2000)*/