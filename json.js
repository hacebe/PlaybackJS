var recordedSession = {
	startedAt: 1440165685875, //new Date().getMilliseconds();
	sessionId: '123456',
	owner: 'Vinicius Hacebe',

	events:[
		{time: 2000 /*Date().now();*/, action: 'newChatMessage', content: '<b>Vinícius Hacebe:</b> Hi, are you ok?'},
		{time: 3000, action: 'newChatMessage', content: '<b>Rodrigo:</b> Yes, everything is alright!'},
		{time: 3500, action: 'newChatMessage', content: '<b>Melissa:</b> Hi everyone!'},
		{time: 4500, action: 'newChatMessage', content: '<b>Melissa:</b> Cool sample!'},
		{time: 4800, action: 'startVideo', content: {username: 'Vinícius Hacebe', videoId: 'vinicius_721', type:'instructor'}},
		{time: 6000, action: 'startVideo', content: {username: 'Rodrigo', videoId: 'rodrigo_245', type:'subscriber'}},
		{time: 6200, action: 'newChatMessage', content: '<b>Melissa:</b> How do I start my video?'},
		{time: 10000, action: 'startVideo', content: {username: 'Melissa Araujo', videoId: 'melissa_944', type:'subscriber'}},
		{time: 12000, action: 'newChatMessage', content: '<b>Melissa:</b> Looks like I figured out'},
		{time: 15000, action: 'stopVideo', content: {videoId: 'rodrigo_245', username: 'Rodrigo'}},
		{time: 17000, action: 'stopVideo', content: {videoId: 'vinicius_721', username: 'Vinícius Hacebe'}},
		{time: 18000, action: 'stopVideo', content: {videoId: 'melissa_944', username: 'Melissa Araujo'}}
	]

}

