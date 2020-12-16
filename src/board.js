import React from "react"
import Square from "./square"

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(20), //all squares on board
      falling: [5, 0], //location of the falling shape
      prevRot: 0, //current rotation {0,3}
      piece: 4, //index of piece type
      points: 0, //current amount of points
      interval: null,
      paused: true,
    }
    for (let index = 0; index < this.state.squares.length; index++) {
      this.state.squares[index] = Array(10).fill(null)
    }
  }
  mycollection = [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [-1, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    [
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    [
      [-1, 0],
      [0, 0],
      [1, 0],
      [0, 1],
    ],
  ]
  colors = ["blue", "red", "orange", "purple", "turquoise", "yellow", "green"]
  hmov = 0 //next horisontal movement
  rot = 0 //next rotation
  mover() {
    const current_hmov = this.hmov
    let current_rot = this.rot
    this.hmov = 0
    const x = this.state.falling[0]
    const y = this.state.falling[1]
    if (x != null && y != null) {
      let oldPositions = []
      const oldRotation = this.mycollection[this.state.piece].map((arr) =>
        this.rotationCalc(arr, this.state.prevRot, x, y)
      ) // location of current squares center block (0,0)

      oldPositions = this.mycollection[this.state.piece].map((arr) =>
        this.rotationCalc(arr, current_rot, x, y)
      ) // previous location with new rotation

      let left = true // able to move to the left
      let right = true // able to move to the right
      let bottom = true // able to move down
      const newsquares = this.state.squares.slice() // create copy of boardsquares

      // deletes old shape
      for (let index = 0; index < oldRotation.length; index++) {
        const e = oldRotation[index]
        if (e[1] >= 0) newsquares[e[1]][e[0]] = null
      }

      // if not able to rotate, dont rotate
      for (let index = 0; index < oldPositions.length; index++) {
        const e = oldPositions[index]
        if (e[1] < 0 || this.state.squares[e[1]][e[0]] !== null) {
          oldPositions = oldRotation
          this.rot = this.state.prevRot
          current_rot = this.state.prevRot
        }
      }

      // update rotation
      this.setState({ prevRot: current_rot })

      // check abilities to move
      for (let index = 0; index < oldPositions.length; index++) {
        const e = oldPositions[index]
        if (this.state.squares[e[1]][e[0] - 1] !== null) left = false
        if (this.state.squares[e[1]][e[0] + 1] !== null) right = false
        if (e[1] + 1 > 19 || this.state.squares[e[1] + 1][e[0]] !== null)
          bottom = false
      }

      // if possible move to left
      if (current_hmov === -1 && left) {
        const newPositions = oldPositions.map((arr) => [arr[0] - 1, arr[1]])
        for (let index = 0; index < newPositions.length; index++) {
          const f = newPositions[index]
          newsquares[f[1]][f[0]] = (
            <div className={"test " + this.colors[this.state.piece]}></div>
          )
        }
        this.setState({ squares: newsquares })
        this.setState({ falling: [x + current_hmov, y] })
      }
      // if possible move to right
      else if (current_hmov === 1 && right) {
        const newPositions = oldPositions.map((arr) => [arr[0] + 1, arr[1]])
        for (let index = 0; index < newPositions.length; index++) {
          const f = newPositions[index]
          newsquares[f[1]][f[0]] = (
            <div className={"test " + this.colors[this.state.piece]}></div>
          )
        }
        this.setState({ squares: newsquares })
        this.setState({ falling: [x + current_hmov, y] })
      } else {
        if (y < 19 && bottom) {
          const newPositions = oldPositions.map((arr) => [arr[0], arr[1] + 1])
          for (let index = 0; index < newPositions.length; index++) {
            const f = newPositions[index]
            newsquares[f[1]][f[0]] = (
              <div className={"test " + this.colors[this.state.piece]}></div>
            )
          }
          this.setState({ squares: newsquares })
          this.setState({ falling: [x, y + 1] })
        } else {
          for (let index = 0; index < oldPositions.length; index++) {
            const f = oldPositions[index]
            if (f[1] === 0) {
              console.log("LOOSER!")
              clearInterval(this.state.interval)
              this.props.done()
              break
            } else {
              newsquares[f[1]][f[0]] = (
                <div className={"test " + this.colors[this.state.piece]}></div>
              )
            }
          }
          this.setState({ falling: [null, null] })
          this.addblock()
          this.checkRow()
        }
      }
    }
  }

  checkRow() {
    for (let index = 0; index < this.state.squares.length; index++) {
      const element = this.state.squares[index]
      let counter = 0
      for (let j = 0; j < element.length; j++) {
        const jelem = element[j]
        if (jelem == null) counter++
      }
      if (counter === 0) {
        this.props.points()
        const newsquares = this.state.squares.slice()
        newsquares[index] = Array(10).fill(null)
        for (let k = index; k > 0; k--) {
          newsquares[k] = newsquares[k - 1]
        }
        newsquares[0] = Array(10).fill(null)
        this.setState({ squares: newsquares })
      }
    }
  }

  addblock() {
    this.rot = 0

    this.setState({ prevRot: 0 })
    const piece = Math.floor(Math.random() * 7)
    if (this.state.falling[0] == null && this.state.falling[1] == null) {
      this.setState({ falling: [5, 0], piece: piece, prevRot: 0 })
    }
  }

  interval = null // setInterval(this.mover.bind(this), 300)
  paused = true
  pause() {
    clearInterval(this.state.interval)
    this.setState({ paused: true })
  }
  unpause() {
    if (this.state.paused) {
      this.setState({
        paused: false,
        interval: setInterval(this.mover.bind(this), 300),
      })
      //   this.interval = setInterval(this.mover.bind(this), 300)
    }
  }

  rotationCalc(arr, rot, x, y) {
    if (rot === 0) return [arr[0] + x, arr[1] + y]
    else if (rot === 1) return [-arr[1] + x, arr[0] + y]
    else if (rot === 3) return [arr[1] + x, -arr[0] + y]
    else return [-arr[0] + x, -arr[1] + y]
  }

  renderSquare(i) {
    //helper for makeRow
    const h = Math.floor(i / 10)
    const x = i % 10
    return <Square key={i} value={this.state.squares[h][x]} />
  }

  makeRow(l, h) {
    //helper for makeBoard
    const result = []
    for (let i = 0; i < l; i++) {
      result.push(this.renderSquare(h * l + i))
    }
    return result
  }
  makeBoard(Htot) {
    //create board in beginning of game
    const board = []
    for (let index = 0; index < Htot; index++) {
      board.push(<div className="board-row">{this.makeRow(10, index)}</div>)
    }
    return board
  }
  move = (event) => {
    //handle keys
    if (this.state.falling[0] !== null) {
      if (event.key === "ArrowRight" && this.state.falling[0] < 9) {
        this.hmov = 1
      } else if (event.key === "ArrowLeft" && this.state.falling[0] > 0) {
        this.hmov = -1
      }
      //change rotation variable on space
      else if (event.key === " ") {
        this.rot = (this.rot + 1) % 4
      } else if (event.key === "p") {
        this.pause()
      } else if (event.key === "u") {
        this.unpause()
      }
    }
  }
  render() {
    return (
      <div onKeyDown={this.move}>
        <div id="theGame">
          <div id="matrix">{this.makeBoard(20)}</div>
        </div>
      </div>
    )
  }
}
