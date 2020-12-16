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
        <h1>TETRIS {this.state.points}</h1>
        {done ? (
          <h1>you lose</h1>
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
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"))
