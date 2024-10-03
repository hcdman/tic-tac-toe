import { useState } from 'react';

function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    let n = Math.sqrt(squares.length)
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            {[...Array(n)].map((_, row) => (
                <div className="board-row" key={row}>
                    {[...Array(n)].map((_, col) => {
                        const index = row * n + col;
                        return (
                            <Square key={col} value={squares[index]} onSquareClick={() => handleClick(index)} />
                        );
                    })}
                </div>
            ))}
        </>
    );
}

function Game({ board }) {
    const [history, setHistory] = useState([Array(board * board).fill(null)]); //two dimensions arrays
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const n = Math.sqrt(squares.length)
    const lines = [];
    //rows and columns
    for (let i = 0; i < n; i++) {
        let row = [];
        let col = [];
        for (let j = 0; j < n; j++) {
            row.push(i * n + j);
            col.push(j * n + i);
        }
        lines.push(row);
        lines.push(col);
    }
    //diagonal
    let diag1 = [];
    let diag2 = [];
    for (let i = 0; i < n; i++) {
        diag1.push(i * n + i);
        diag2.push((i + 1) * n - (i + 1));
    }
    lines.push(diag1);
    lines.push(diag2);
    for (let i = 0; i < lines.length; i++) {
        const [a, ...rest] = lines[i];
        if (squares[a] && rest.every(index => squares[index] === squares[a])) {
            return squares[a];
        }
    }
    return null;
}

export default function Mode() {
    const [board, setBoard] = useState(3);
    const [showGame, setShowGame] = useState(false)
    function handleClick() {
        setShowGame(true)
    }
    function handleChange(event) {
        const newBoard = parseInt(event.target.value, 10);
        setBoard(newBoard)
    }
    return (
        showGame === true ? <Game board={board} /> : <>
            <div>My game</div>
            <input value={board} type='number' onChange={(event) => handleChange(event)} />
            <button onClick={() => handleClick()}>OK</button></>
    )
}