//API Endpoint.
const endpointURL= 'http://localhost:3000/api/game/tictactoe/';
var localStorage = window.localStorage;
console.log(localStorage.length);
var origBoard; //this is where the board is gonna be positioned
const huPlayer = 'O'; // This is the Human Mark inside the game
const aiPlayer = 'X'; // this is the AI Mark for the game
const winCombos = [ //All possible combinations to win
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
//storing references of cells inside the table
const cells = document.querySelectorAll('.cell');
localStorage.clear();

function startGame() {

	checkForStartedGame();

	document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys()); //creating array of 9 elements with keys equals to values.
    
    //removing everything from previous game
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	console.log('Who Won: ', gameWon);

	setMatchResult(gameWon.player);

	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
	//HERE I CAN SEND THE PARAMETER WINNER: TIE
	console.log('TIE');
	// setMatchResult(who.);

}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}

		setMatchResult('TIE');
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function checkForStartedGame(){

	let username = document.getElementById('username').value;

	var gameid = localStorage.getItem(username);

	console.log(gameid);
	if(gameid){
		
		console.log('gameid: ', gameid);

		//UPDATE HISTORY MATCH
		historyMatchRequest();


	}else{
		console.log('startGameRequest');
		startGameRequest();
	}

}

function startGameRequest(){
	let xhr = new XMLHttpRequest();
	xhr.open('POST', endpointURL+'start-game');

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onload = () => {

		if (xhr.status ===  200){
			let response = JSON.parse(xhr.responseText);

			let game = response;

			console.log('xhr: ', response);
			document.getElementById('playerA').innerText = game.humanPlayer;
			document.getElementById('playerAPoints').innerText = game.humanPoints;
			document.getElementById('AIPlayer').innerText = game.AIPlayer;
			document.getElementById('aiplayerPoints').innerText = game.AIPoints;

			let gameid = localStorage.getItem(document.getElementById('username'));

			if( gameid == null || gameid == '' ){
				localStorage.setItem(document.getElementById('username').value, response._id);
			}else{
				historyMatchRequest()
			}

			console.log(response._id);

			let historyMatches = document.getElementById('list');
			historyMatches.innerHTML = '';

			if(game.historyMatch.length > 0){


				for(var i=0; i<game.historyMatch.length; i++){
					let newMatch = document.createElement('li');
					let match = game.historyMatch[i];
	
					newMatch.appendChild(document.createTextNode('Player: '+match.playerA+ 'vs '+match.playerB+' |  Winner: '+ response.historyMatch[i].winner));
					historyMatches.appendChild(newMatch);
	
				}

			}else{
				let noMatch = document.createElement('li');
				noMatch.appendChild(document.createTextNode('No Matches Found.'));
				historyMatches.appendChild(noMatch);
			}
			


		}else{
			alert('request failed. Returned status of: '+ xhr.status);
		}

	};

	let humanPlayer = document.getElementById('username').value;

	xhr.send(JSON.stringify({
		humanPlayer: humanPlayer,
		humanPoints: 0,
		AIPlayer: "AIPlayer",
		AIPoints: 0
	}));
}

function setMatchResult(winner){
	let xhr = new XMLHttpRequest();
	let gameid = localStorage.getItem(document.getElementById('username').value);
	xhr.open('PUT', endpointURL+'set-match-result/'+gameid);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onload = () => {

		if (xhr.status ===  200){
			
			let response = JSON.parse(xhr.responseText);

			document.getElementById('playerA').innerText = response.humanPlayer;
			document.getElementById('playerAPoints').innerText = response.humanPoints;
			document.getElementById('AIPlayer').innerText = response.AIPlayer;
			document.getElementById('aiplayerPoints').innerText = response.AIPoints;

			let historyMatches = document.getElementById('list');
			historyMatches.innerText = '';
			let game = response;

			if(response.historyMatch.length > 0){

				for(var i=0; i<response.historyMatch.length; i++){
					let newMatch = document.createElement('li');
					let match = response.historyMatch[i];
	
					newMatch.appendChild(document.createTextNode('Player: '+match.playerA+ 'vs '+match.playerB+' |  Winner: '+ response.historyMatch[i].winner));
					historyMatches.appendChild(newMatch);
	
				}
			}
			
		}else{
			alert('request failed. Returned status of: '+ xhr.status);
		}

	};

	let humanPlayer = document.getElementById('username').value;

	xhr.send(JSON.stringify({
		playerA: humanPlayer,
		winner: winner,
		gameid: gameid
	}));
}

function historyMatchRequest(){

	let xhr = new XMLHttpRequest();
	let gameid = localStorage.getItem(document.getElementById('username').value);
	xhr.open('GET', endpointURL+'match-history/'+gameid);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onload = () => {

		if (xhr.status ===  200){
			let response = JSON.parse(xhr.responseText);

			let historyMatches = document.getElementById('list');
			historyMatches.innerHTML = '';
			if(response.length > 0){

				let game = response[0];

				for(var i=0; i<game.historyMatch.length; i++){
					let newMatch = document.createElement('li');
	
					document.getElementById('playerAPoints').innerText = game.humanPoints;
					document.getElementById('aiplayerPoints').innerText = game.AIPoints;

					let matches = game.historyMatch;

					if(matches.length>0){

						let match = matches[i];

						newMatch.appendChild(document.createTextNode('Player: '+match.playerA+ 'vs '+match.playerB+' |  Winner: '+ match.winner));
						historyMatches.appendChild(newMatch);
					}else{
						historyMatches.innerHTML = '';
						let noMatch = document.createElement('li');
						noMatch.appendChild(document.createTextNode('No Matches Found.'));
						historyMatches.appendChild(noMatch);
					}
				}
			}else{
				historyMatches.innerHTML = '';
				let noMatch = document.createElement('li');
				noMatch.appendChild(document.createTextNode('No Matches Found.'));
				historyMatches.appendChild(noMatch);
			}
			


		}else{
			alert('request failed. Returned status of: '+ xhr.status);
		}

	};

	xhr.send();

}