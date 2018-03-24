import React, { Component } from 'react';
import update from 'immutability-helper';
import './board.css';
import Tile from './tile/tile';

class Board extends Component {

    constructor(props) {
        super(props);
        this.state = {
            board: this.getNewBoard(props.game.num_rows, props.game.num_columns)
        }

        this.flagTile = this.flagTile.bind(this);
        this.clickTile = this.clickTile.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.game.difficulty !== nextProps.game.difficulty ||
            (this.props.game.hasMadeFirstMove && !nextProps.game.hasMadeFirstMove)) {
            this.setState({
                board: this.getNewBoard(nextProps.game.num_rows, nextProps.game.num_columns)
            });
        }
    }

    getNewBoard(rows, columns) {
        let board = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                const tile = {
                    row: i,
                    column: j,
                    isBomb: false,
                    isFlagged: false,
                    isOpen: false,
                    adjacentBombs: 0,
                    isOpenedBomb: false,
                    isIncorrectlyFlaggedBomb: false
                }
                row.push(tile);
            }
            board.push(row);
        }
        return board;
    }

    startGame() {
        this.props.startGame();
        this.setBombs();
    }

    endGame() {
        this.props.endGame();
    }

    clickTile(row, column) {
        this.props.incrementGamePropertyByCount('moves', 1);
        !this.props.game.hasMadeFirstMove ? this.openFirstTile(row, column) : this.openTile(row, column);
    }

    openFirstTile(row, column) {
        let board = [...this.state.board];
        const tile = board[row][column];
        tile.isOpen = true;
        this.props.incrementGamePropertyByCount('tilesOpened', 1);
        this.setState({
            board
        })
        this.startGame();
        if (tile.adjacentBombs === 0) {
            this.chord(board, tile);
        }
    }

    openTile(row, column) {
        let board = [...this.state.board];
        const tile = board[row][column];
        tile.isOpen = true;
        this.props.incrementGamePropertyByCount('tilesOpened', 1);
        if (tile.isBomb) {
            this.endGame();
        } else if (tile.adjacentBombs === 0) {
            this.chord(board, tile);
        }
        this.setState({
            board
        });
    }

    chord(board, tile) {
        const neighbors = this.findNeighbors(board, tile);
        const len = neighbors.length;
        for (let i = 0; i < len; i++) {
            const neighbor = neighbors[i];
            if (!this.props.game.isGameOver && !neighbor.isOpen && !neighbor.isFlagged) {
                this.openTile(neighbor.row, neighbor.column);
            }
        }
    }

    flagTile(row, column) {
        if (!this.props.game.hasMadeFirstMove) {
            this.startGame();
        }
        this.setState((prevState) => {
            return {board: update(prevState.board, {[row]: {[column]: {isFlagged: {$apply: isFlagged => !isFlagged}}}})}
        });
    }

    setBombs() {
        let board = [...this.state.board];
        let bombsToPlace = this.props.game.num_bombs;
        while (bombsToPlace > 0) {
            const tile = board[this.generateRandomNumber(this.props.game.num_rows)][this.generateRandomNumber(this.props.game.num_columns)];
            if (!tile.isOpen && !tile.isBomb) {
                tile.isBomb = true;
                this.updateNeighborsBombCounts(board, tile);
                bombsToPlace--;
            }
        }
        this.setState({
            board
        });
    }

    updateNeighborsBombCounts(board, tile) {
        const neighbors = this.findNeighbors(board, tile);
        const len = neighbors.length;
        for (let i = 0; i < len; i++) {
            const neighbor = neighbors[i];
            neighbor.adjacentBombs++;
        }
    }

    findNeighbors(board, tile) {

        const row = tile.row;
        const col = tile.column;

        const isNorthWall = row === 0;
        const isSouthWall = row === this.props.game.num_rows - 1;
        const isWestWall = col === 0;
        const isEastWall = col === this.props.game.num_columns - 1;

        const neighbors = [];

        if (!isNorthWall) {
            // n
            neighbors.push(board[row - 1][col]);
            if (!isWestWall) {
                // nw
                neighbors.push(board[row - 1][col - 1]);
            }
            if (!isEastWall) {
                // ne
                neighbors.push(board[row - 1][col + 1]);
            }
        }
        if (!isSouthWall) {
            // s
            neighbors.push(board[row + 1][col]);
            if (!isWestWall) {
                // sw
                neighbors.push(board[row + 1][col - 1]);
            }
            if (!isEastWall) {
                // se
                neighbors.push(board[row + 1][col + 1]);
            }
        }
        if (!isWestWall) {
            // w
            neighbors.push(board[row][col - 1]);
        }
        if (!isEastWall) {
            // e
            neighbors.push(board[row][col + 1]);
        }

        return neighbors;
    }

    generateRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    render() {
        return (
            <div className="board">
                {this.state.board.map((row, index) => {
                    return <div key={index} className="row">
                        {row.map((tile) => {
                            return <Tile key={tile.column} tile={tile} game={this.props.game} flagTile={this.flagTile} clickTile={this.clickTile}></Tile>
                        })}
                    </div>
                })}
            </div>
        );
    }
}

export default Board;
