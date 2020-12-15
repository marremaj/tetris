import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import Board from "./board"

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      points: 0,
    }
    this.addPoints = this.addPoints.bind(this)
  }
  addPoints() {
    this.setState({ points: this.state.points + 1 })
  }
  render() {
    return (
      <div className="game">
        <h1>TETRIS {this.state.points}</h1>
        <div className="game-board">
          <Board class="board" points={this.addPoints} />
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"))
