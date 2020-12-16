import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import Board from "./board"

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      points: 0,
      done: false,
    }
    this.addPoints = this.addPoints.bind(this)
    this.toggleDone = this.toggleDone.bind(this)
  }
  addPoints() {
    this.setState({ points: this.state.points + 1 })
  }
  toggleDone() {
    this.setState({ done: !this.state.done })
  }
  render() {
    const done = this.state.done
    return (
      <div className="game">
        <div class="game-info">
        <h1>TETRIS</h1>
        <h2>points: {this.state.points}</h2>
        <p>
          Start the game by clicking on the board and pressing U.<br/>
          Move block to left and right with arrow keys.<br/>
          Rotate (space).<br/>
          Pause (P).<br/>
          Unpause (U).<br/><br/>
          GOOD LUCK!
        </p>
        </div>
        <div class="gamearea">
        {done ? (
          <>
          <h1>You got many points</h1>
          <button onClick={() => {this.setState({ done: false, points: 0 })}}>AGAIN</button>
          </>
        ) : (
          <div className="game-board">
            <Board
              class="board"
              points={this.addPoints}
              done={this.toggleDone}
            />
          </div>
        )}
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"))
