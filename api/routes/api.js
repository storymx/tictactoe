const router = require('express').Router();

//Controller here
const gameController = require('../controllers/game-controller');

//startNewGame
//setWinner(winner,loser) --> points are set to the Game
//getHistoric of current Match
router.route('/game/tictactoe/start-game').post(gameController.startGame);
router.route('/game/tictactoe/match-history/:gameid').get(gameController.getHistory);
router.route('/game/tictactoe/set-match-result/:gameid').put(gameController.setMatchResult);
router.route('/game/tictactoe/all').get(gameController.fetchAll);

module.exports = router;