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
        };
        for (let index = 0; index < this.state.squares.length; index++) {
          this.state.squares[index] = Array(10).fill(null)
        }
        //this.setState({falling:[5, 0]})
      }
      thingy = 0
      mover() {
          const x = this.state.falling[0];
          const y = this.state.falling[1];
          if (x != null && y != null) {
            if (y < 19 && this.state.squares[y + 1][x] == null) {
                if (this.state.squares[y + 1][x + this.thingy] != null) {
                  this.thingy = 0
                }
                const newsquares = this.state.squares.slice();
                newsquares[y][x] =  null
                newsquares[y+1][x+this.thingy] = <div className="test"></div>
                
                this.setState({squares: newsquares})
                this.setState({falling: [x + this.thingy, y + 1]})
                this.thingy = 0
            }
            else {
                this.setState({falling: [null, null]})
                this.addblock()
                this.checkRow()
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
          const place = Math.floor(Math.random() * 10)
          if (this.state.falling[0] == null && this.state.falling[1] == null) {
            this.setState({falling: [place, 0]})
          } 
      } 
      interval = setInterval(this.mover.bind(this), 100);
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