import React, { Component } from 'react';
import './tile.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faFlag, faBomb, faTimes } from '@fortawesome/fontawesome-free-solid';

class Tile extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleClick() {
        if (!this.props.game.isGameOver && !this.props.tile.isOpen && !this.props.tile.isFlagged) {
            this.props.clickTile(this.props.tile.row, this.props.tile.column);
        }
    }

    handleRightClick(e) {
        e.preventDefault();
        if (!this.props.game.isGameOver && !this.props.tile.isOpen) {
            this.props.flagTile(this.props.tile.row, this.props.tile.column);
        }
    }

    handleDoubleClick() {
        if (!this.props.game.isGameOver && this.props.tile.isOpen && this.props.tile.adjacentBombs > 0 && this.props.tile.adjacentBombs === this.props.tile.adjacentFlaggedTiles) {
            this.props.chord(this.props.tile);
        }
    }

    render() {

        let isFlagged = this.props.tile.isFlagged;
        let isBomb = this.props.tile.isBomb;
        let isOpen = this.props.tile.isOpen;
        let isIncorrectlyFlaggedBomb = false;

        if (this.props.game.isWinner) {
            if (isBomb) {
                isBomb = false;
                isFlagged = true;
            }
        } else if (this.props.game.isGameOver) {
            if (isBomb && isFlagged) {
                isBomb = false;
            } else if (!isBomb && isFlagged) {
                isFlagged = false;
                isIncorrectlyFlaggedBomb = true;
            }
        } else {
            isBomb = false;
        }

        const adjacentBombCount = isOpen && !isBomb && this.props.tile.adjacentBombs > 0 ? this.props.tile.adjacentBombs : '';

        let flag = undefined;
        let bomb = undefined;
        let times = undefined;
        if (isFlagged) {
            flag = <FontAwesomeIcon icon={faFlag}/>
        }
        if (isBomb) {
            bomb = <FontAwesomeIcon icon={faBomb}/>
        }
        if (isIncorrectlyFlaggedBomb) {
            times = <FontAwesomeIcon icon={faTimes} />
        }

        const openClass = isOpen ? ' open' : '';
        const flaggedClass = isFlagged ? ' flag' : '';
        const bombClass = isBomb ? ' bomb' : '';
        const isIncorrectlyFlaggedBombClass = isIncorrectlyFlaggedBomb ? ' incorrectlyFlaggedBomb' : '';

        return (
            <div className={"tile" + openClass + flaggedClass + bombClass + isIncorrectlyFlaggedBombClass}
                 onClick={this.handleClick}
                 onContextMenu={this.handleRightClick}
                 onDoubleClick={this.handleDoubleClick}>
                {flag}
                {bomb}
                {times}
                {adjacentBombCount}
            </div>
        );
    }
}

export default Tile;
