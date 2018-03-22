import React, { Component } from 'react';
import './stats.css';

class Stats extends Component {

    render() {
        return (
            <div className="stats">
                {this.props.time.seconds} seconds - {this.props.game.moves} moves - {this.props.game.tilesOpened} tiles opened {this.props.game.isGameOver ? (this.props.game.isWinner ? '- Winner!' : '- You Lost!') : ''}
            </div>
        );
    }
}

export default Stats;
