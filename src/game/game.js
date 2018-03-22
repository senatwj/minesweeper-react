import React, { Component } from 'react';
import update from 'immutability-helper';
import './game.css';
import Options from './options/options';
import Stats from './stats/stats';
import Board from './board/board';

class Game extends Component {

    constructor(props) {
        super(props);

        this.defaultDifficulty = 'beginner';
        this.difficulties = {
            beginner: {
                num_rows: 9,
                num_columns: 9,
                num_bombs: 10,
                name: 'beginner'
            },
            intermediate: {
                num_rows: 16,
                num_columns: 16,
                num_bombs: 40,
                name: 'intermediate'
            },
            advanced: {
                num_rows: 16,
                num_columns: 30,
                num_bombs: 99,
                name: 'advanced'
            }
        };

        this.state = {
            game: this.getNewGame(this.defaultDifficulty),
            time: this.getGameTime()
        };

        this.endGame = this.endGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.newGame = this.newGame.bind(this);
        this.tick = this.tick.bind(this);
        this.incrementGamePropertyByCount = this.incrementGamePropertyByCount.bind(this);
    }

    getNewGame(difficulty) {
        return {
            isGameOver: false,
            isWinner: false,
            hasMadeFirstMove: false,
            num_rows: this.difficulties[difficulty].num_rows,
            num_columns: this.difficulties[difficulty].num_columns,
            num_bombs: this.difficulties[difficulty].num_bombs,
            moves: 0,
            tilesOpened: 0,
            openTilesToWin: this.difficulties[difficulty].num_rows * this.difficulties[difficulty].num_columns - this.difficulties[difficulty].num_bombs,
            difficulty: difficulty
        }
    }

    getGameTime() {
        return {
            timer: undefined,
            current: undefined,
            seconds: 0
        }
    }

    tick() {
        this.setState((prevState) => {
            return {time: update(prevState.time, {seconds: {$set: Math.floor((new Date() - prevState.time.current) / 1000)}})}
        });
    }

    startGame() {
        this.setState((prevState) => {
            return {game: update(prevState.game, {hasMadeFirstMove: {$set: true}}),
                    time: update(prevState.time, {timer: {$set: setInterval(this.tick, 1000)}, current: {$set: Date.now()}})}
        });
    }

    endGame(isWinner = false) {
        this.setState((prevState) => {
            return {game: update(prevState.game, {isGameOver: {$set: true}, isWinner: {$set: isWinner}}),
                    time: update(prevState.time, {timer: {$set: clearInterval(prevState.time.timer)}})}
        });
    }

    incrementGamePropertyByCount(prop, increment) {
        this.setState((prevState) => {
            return {game: update(prevState.game, {[prop]: {$apply: value => value + increment}})}
        });
    }

    newGame(difficulty) {
        this.setState((prevState) => {
            return {game: this.getNewGame(difficulty),
                    time: update(prevState.time, {timer: {$set: clearInterval(prevState.time.timer)}, seconds: {$set: 0}})}
        });
    }

    render() {
        return (
            <div className="game">
                <Stats game={this.state.game} time={this.state.time}></Stats>
                <Options difficulties={this.difficulties} defaultDifficulty={this.defaultDifficulty} newGame={this.newGame}></Options>
                <Board game={this.state.game}
                       endGame={this.endGame}
                       startGame={this.startGame}
                       incrementGamePropertyByCount={this.incrementGamePropertyByCount}></Board>
            </div>
        );
    }
}

export default Game;
