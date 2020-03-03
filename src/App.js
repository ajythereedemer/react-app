import React from 'react';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} nodevalue={props.nodevalue}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
	  let myAttr = {'data-attr': 'value'+i};
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        nodevalue={i}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      node:null
    };
  }
  
   componentDidMount(winner) {
    console.log(winner);
    if(winner == null)
	{
		$(".square").removeClass("winner-cls");
		return false;
	}
    let newwinner = winner;
    $.each(winner,function(i,e){
		if(i == 1){
			 $.each(e,function(i1,e1){
				 console.log(e1);
				$(".square[nodevalue="+e1+"]").addClass("winner-cls");
			});
		}
	});
  }

  handleClick(i) {
	
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      node:i
    });
  }

  jumpTo(step) {
	  this.componentDidMount(this.winner);
	  if(step == "reset"){
		 this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      node:null
    });
	}else{
		this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      node:this.state.node
    });
	}
    
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner[0];  
      this.componentDidMount(winner);
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className={winner ? 'winner-cls' : ''}>{status}</div>
          <ul><li><button onClick={() => this.jumpTo("reset")}>Reset all move</button></li></ul>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],lines[i]];
    }
  }
  return null;
}

export default Game;
