const Game = require('../models/game-model.js');
const Match = require('../models/match-model.js');
const serverResponse = require('../http-responses/http-status-codes');

let gameController = {
    fetchAll: (req, res)=>{
        // Game.find({},(err, result)=>{

        //     if(err){ serverResponse.statusServerError(err, res);}
        //     else{ serverResponse.statusOKSuccess(result, res); }

        // });

        Game.find({}).populate('matches').exec((err, result)=>{

            if(err){ serverResponse.statusServerError(err, res);}
            else{ serverResponse.statusOKSuccess(result, res); }

        });
    },
    startGame: (req, res)=> {        
        if(req.body){

            let query = {humanPlayer: req.body.humanPlayer};

            Game.find(query).populate({path: 'historyMatch', model:'Match'}).exec((err, games)=>{

                if(err){
                    serverResponse.statusNotFound(err,res);
                }else{

                    console.log('Games: ', games.length);

                    if(games.length > 0){
                        
                        //sending game of the current Username received
                        serverResponse.statusOKSuccess(games[0], res);

                    }else{
                        
                        let game = new Game(req.body);

                        game.save((err) => {

                            if(err) serverResponse.statusBadRequest(err,res);
                            else serverResponse.statusOKSuccess(game, res)

                        });

                    }

                }

            })

        }else{
            serverResponse.statusServerError('body parameters were not found', res);
        }
    },
    setMatchResult: (req, res)=>{

        if(req.params.gameid){

            if(req.body){
                let query = {_id: req.body.gameid};
                console.log(req.body.gameid);
                console.log(req.body);

                Game.find(query).populate({
                    path: 'historyMatch',
                    model: 'Match'
                }).exec((err, game)=>{
                    console.log('Game: ',game);
                    if(err){ serverResponse.statusServerError('No game was found, game identifier may be corrupted.', res);}
                    else{

                        let winner = '';
                        if(req.body.winner == "O"){
                            winner = req.body.playerA
                        }else if(req.body.winner == "X"){
                            winner = "AIPlayer"
                        }else{
                            winner = "TIE"
                        }

                        const matchToUpdate = new Match({
                            playerA: req.body.playerA,
                            winner: winner,
                            game: req.body.gameid
                        });

                        console.log('lool: ',game);
                        console.log('Match: ',matchToUpdate);
                        
                        game[0].historyMatch.push(matchToUpdate);

                        game[0].save();

                        matchToUpdate.save();

                        serverResponse.statusOKSuccess(game[0], res);
                    }

                });

            }else{
                serverResponse.statusOKSuccess('Sorry!, I have not received any date to set a match Result, try again!', res);
            }


        }else{
            serverResponse.statusServerError("Sorry, i can't set a match winner without knowing the Game where occurred. Try again", res);
        }

    },
    getHistory: (req, res)=>{

        if(req.params.gameid){

            console.log('Req UserID: ',req.params.gameid);

            let query = {_id: req.params.gameid};
            
            Game.find(query)
                .populate({path:'historyMatch', model:'Match'})
                .exec(function(err, game){

                    if(err){serverResponse.statusServerError(err, res);}
                    else{
                        console.log('History: ',game);
                        serverResponse.statusOKSuccess(game, res);
                    }

                });

        }else{
            serverResponse.statusServerError('No No UserId was found.', res);
        }
    }

};

module.exports = gameController;