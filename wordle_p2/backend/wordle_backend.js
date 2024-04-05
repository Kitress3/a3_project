const port = 8000;
const express = require('express');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const fs = require('fs');
const Wordle = require("./model.js");

const app = express();
app.use(cookieParser());
const database = {};

let words = ["words"]; // just in case!!
let onlineUsers = 0; 
fs.readFile('./words.5', 'utf8', (err, data) => {
	if (err) console.error(err);
	else words = data.split("\n");
});


let sharedWordle = new Wordle(words);


const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/username/', function (req, res) {
	if (req.cookies && req.cookies.username) {
		// if cookie has it,return 
		res.status(200).json({"username": req.cookies.username});
	  } else {
		// if dont have
		let wordle = new Wordle(words);
		let username = wordle.getUsername();
		// storage cookie
		res.cookie('username', username, { maxAge: 900000, httpOnly: true });
		res.status(200).json({"username": username});
	  }
});

app.put('/api/username/:username/newgame', function (req, res) {
	// Adjust this endpoint to work with the shared Wordle instance
	const gameState = "created"
	onlineUsers++;
	broadcastOnlineUsers()
	let username=req.params.username;
	if(!(username in database)){
		let wordle=new Wordle(words);
		wordle.setUsername(username);
		database[username]=wordle;
	} 
	database[username].reset();

	res.status(200).json({ "status": gameState });
});

app.post('/api/username/:username/guess/:guess', function (req, res) {
	let guess = req.params.guess;
	let username=req.params.username;
	// Make a guess against the shared Wordle instance
	if(! username in database){
		res.status(409);
		res.json({"error":`${username} does not have an active game`});
		return;
	}
	var data = database[username].makeGuess(guess);
	res.status(200);
	res.json(data);
});

// Calculate and broadcast the remaining time
let gameTime = 300;// Set the game time to 5 minutes (300 seconds)

const broadcastTime = () => {
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			const message = JSON.stringify({
				type: "timer",
				value: formatTime(gameTime),
			});
			client.send(message);
		}
	});

	if (gameTime <= 0) {
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				const message = JSON.stringify({
					type: "over",
					value: true,
				});
				client.send(message);
			}
		});
		// Reset the game
		sharedWordle.reset();
		console.log('Game has been reset.');
		gameTime = 300; // Reset the game time to 5 minutes
		// broadcast the game reset message here again
	} else {
		gameTime--;
	}
};

// A function that converts seconds to mm:ss format
const formatTime = (time) => {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Set the timer to execute broadcastTime once per second
setInterval(broadcastTime, 1000);


wss.on('connection', function connection(ws) {
	broadcastOnlineUsers(); // Number of current online broadcast users
	ws.on('close', () => {
	  onlineUsers--; // User disconnection
	  broadcastOnlineUsers(); // Update the number of online users
	});
	ws.on('message', function incoming(message) {
		const data = JSON.parse(message);
		if (data.type === "requestOnlineUsers") {	
			broadcastOnlineUsers(); // Number of current online broadcast users
		}
	  });
  });



  function broadcastOnlineUsers() {
	// Broadcast the current number of online users to all connected clients
	wss.clients.forEach(function each(client) {
	  if (client.readyState === WebSocket.OPEN) {
		client.send(JSON.stringify({ type: 'onlineUsers', value: onlineUsers }));
	  }
	});
  }

server.listen(port, function () {
	console.log('App listening on port ' + port);
});



  