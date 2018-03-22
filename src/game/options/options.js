import React, { Component } from 'react';
import './options.css';

class Options extends Component {

    constructor(props) {
        super(props);

        this.state = {
            difficulty: props.defaultDifficulty
        }

        this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
        this.handleNewGameClick = this.handleNewGameClick.bind(this);
    }

    handleDifficultyChange(event) {
        this.setState({
            difficulty: event.target.value
        });
    }

    handleNewGameClick() {
        this.props.newGame(this.state.difficulty);
    }

    render() {
        return (
            <div className="options">
                <div className="difficulties">
                    <label>
                        <input type="radio" value={this.props.difficulties.beginner.name} onChange={this.handleDifficultyChange} checked={this.state.difficulty === this.props.difficulties.beginner.name}/>
                        {this.props.difficulties.beginner.name} ({this.props.difficulties.beginner.num_rows}x{this.props.difficulties.beginner.num_columns}, {this.props.difficulties.beginner.num_bombs} Bombs)
                    </label>
                    <label>
                        <input type="radio" value={this.props.difficulties.intermediate.name} onChange={this.handleDifficultyChange} checked={this.state.difficulty === this.props.difficulties.intermediate.name}/>
                        {this.props.difficulties.intermediate.name} ({this.props.difficulties.intermediate.num_rows}x{this.props.difficulties.intermediate.num_columns}, {this.props.difficulties.intermediate.num_bombs} Bombs)
                    </label>
                    <label>
                        <input type="radio" value={this.props.difficulties.advanced.name} onChange={this.handleDifficultyChange} checked={this.state.difficulty === this.props.difficulties.advanced.name}/>
                        {this.props.difficulties.advanced.name} ({this.props.difficulties.advanced.num_rows}x{this.props.difficulties.advanced.num_columns}, {this.props.difficulties.advanced.num_bombs} Bombs)
                    </label>
                </div>
                <div className="newGame">
                    <button onClick={this.handleNewGameClick}>
                        New Game
                    </button>
                </div>
            </div>
        );
    }
}

export default Options;
