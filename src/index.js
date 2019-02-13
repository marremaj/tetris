import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: null,
        };
      }
    render() {
      return (
        <button 
          className="square" 
          onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button>
      );
    }
  }

  
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          squares: Array(20),
          falling: [5, 0],
          piece: 1
        };
        for (let index = 0; index < this.state.squares.length; index++) {
          this.state.squares[index] = Array(10).fill(null)
        }
        //this.setState({falling:[5, 0]})
      }
      mycollection = [[[0,0]], [[0,0], [0,1], [1,1]], [[0,0], [1,0]], [[-1, 0], [0,0], [1,0], [2,0]]]
      colors = ["red", "green", "blue", "grey", "grey", "grey", "grey"]
      thingy = 0
      mover() {
          const x = this.state.falling[0];
          const y = this.state.falling[1];
          if (x != null && y != null) {
            const oldPositions = this.mycollection[this.state.piece].map((arr) => [arr[0] + x, arr[1] + y])
            let left = true
            let right = true 
            let bottom = true
            const newsquares = this.state.squares.slice();
            for (let index = 0; index < oldPositions.length; index++) {
              const e = oldPositions[index];
              newsquares[e[1]][e[0]] =  null
            }
            for (let index = 0; index < oldPositions.length; index++) {
              const e = oldPositions[index];
              if( this.state.squares[e[1]][e[0]-1] !== null) left = false
              if( this.state.squares[e[1]][e[0]+1] !== null) right = false
              if((e[1]+1)>19 || this.state.squares[e[1]+1][e[0]] !== null) bottom = false
            }
            if (this.thingy === -1 && left) {
              const newPositions = oldPositions.map((arr) => [arr[0] - 1, arr[1]])
              for (let index = 0; index < newPositions.length; index++) {
                const f = newPositions[index];
                newsquares[f[1]][f[0]] = <div className={"test " + this.colors[this.state.piece]}></div>
              }
              this.setState({squares: newsquares})
              this.setState({falling: [x + this.thingy, y]})
              this.thingy = 0
            }
            else if (this.thingy === 1 && right) {
              const newPositions = oldPositions.map((arr) => [arr[0] + 1, arr[1]])
              for (let index = 0; index < newPositions.length; index++) {
                const f = newPositions[index];
                newsquares[f[1]][f[0]] = <div className={"test " + this.colors[this.state.piece]}></div>
              }
              this.setState({squares: newsquares})
              this.setState({falling: [x + this.thingy, y]})
              this.thingy = 0
            }
            else {
              console.log("here")
              if (y < 19 && bottom) {
                const newPositions = oldPositions.map((arr) => [arr[0], arr[1] + 1])
                for (let index = 0; index < newPositions.length; index++) {
                  const f = newPositions[index];
                  newsquares[f[1]][f[0]] = <div className={"test " + this.colors[this.state.piece]}></div>
                }
                this.setState({squares: newsquares})
                this.setState({falling: [x, y + 1]})
              }
              else {
                for (let index = 0; index < oldPositions.length; index++) {
                  const f = oldPositions[index];
                  newsquares[f[1]][f[0]] = <div className={"test " + this.colors[this.state.piece]}></div>
                }
                this.setState({falling: [null, null]})
                console.log(this.state.falling)
                this.addblock()
                this.checkRow()
              }
            }
          }
      } 
      checkRow() {
          for (let index = 0; index < this.state.squares.length; index++) {
              const element = this.state.squares[index];
              let counter = 0
              for (let j = 0; j < element.length; j++) {
                  const jelem = element[j];
                  if (jelem == null) counter++
              }
              if (counter === 0) {
                const newsquares = this.state.squares.slice();
                newsquares[index] =  Array(10).fill(null)
                for (let k = index; k > 0; k--) {
                  newsquares[k] = newsquares[k-1]
                }
                newsquares[0] = Array(10).fill(null)
                this.setState({squares: newsquares})
              }
          }
      }
      addblock() {
          const piece = Math.floor(Math.random() * 4)
          if (this.state.falling[0] == null && this.state.falling[1] == null) {
            this.setState({falling: [5, 0], piece: piece})
          } 
      } 
      interval = setInterval(this.mover.bind(this), 500);
      pause() {
          clearInterval(this.interval)
      }
      handleClick(i) {
        // const newsquares = this.state.squares.slice();
        // const h = Math.floor(i/10)
        // const x = i%10
        // newsquares[h][x] =  <div className="test"></div>
        // this.setState({squares: newsquares})
      }
    renderSquare(i) {
      const h = Math.floor(i/10)
      const x = i%10
      return <Square key={i} value={this.state.squares[h][x]} onClick={() => this.handleClick(i)} />;
    }
     
    makeRow(l, h) {
        const result = [];
        for (let i=0; i < l; i++) {
            result.push(this.renderSquare(h*l+i))
        }
        return result;
      }
    makeBoard(Htot) {
        const boeard = [];
        for (let index = 0; index < Htot; index++) {
            boeard.push(<div className="board-row">{this.makeRow(10, index)}</div>);   
        }
        return boeard;
    }
    move = (event) => {

        if (event.key === 'ArrowRight' && this.state.falling[0] !== null && this.state.falling[0] < 9) {
            this.thingy = 1
        }
        else if (event.key === 'ArrowLeft' && this.state.falling[0] !== null && this.state.falling[0] > 0) {
            this.thingy = -1
        }
    }
    render() {
      const status = 'Next player: X';
      return (
        <div onKeyDown={this.move}>
          <button onClick={this.pause.bind(this)}>Click</button>
          <div className="status">{status}</div>
          {this.makeBoard(20)}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );