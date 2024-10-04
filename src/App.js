import Switch from '@mui/material/Switch';
import { useState } from 'react';

function Square({ value, onSquareClick, isHighlighted }) {
    return (
        <button className="square" onClick={onSquareClick} style={{ backgroundColor: isHighlighted ? 'green' : '#fff' }}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    let n = Math.sqrt(squares.length)
    let line = [];
    function handleClick(i) {
        if (calculateWinner(squares, line) || squares[i]) {
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

    const winner = calculateWinner(squares, line);
    const draw = checkDraw(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    }
    else if (draw) {
        status = 'Draw'
    }
    else {
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
                            line[0] && line[0].includes(index) ? <Square key={col} value={squares[index]} onSquareClick={() => handleClick(index)} isHighlighted={true} />
                                : <Square key={col} value={squares[index]} onSquareClick={() => handleClick(index)} isHighlighted={false} />

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
    const [isToggled, setIsToggled] = useState(false);

    const toggle = () => {
        setIsToggled(!isToggled);
    };
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

        if (isToggled) {
            move = history.length - move - 1;
        }
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <>
                <li key={move}>
                    {
                        currentMove === move ? (move === 0 ? "You are at Start" : `You are at move #${move}`) : <button onClick={() => jumpTo(move)}>{description}</button>
                    }
                </li>
            </>

        );
    });

    return (
        <>
            {
                isToggled === true ? <label>DESCENDING</label> : <label>ASCENDING</label>
            }
            <Switch checked={isToggled} onChange={toggle} />
            <div className="game">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        </>
    );
}

function calculateWinner(squares, line) {
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
            line.push(lines[i])
            return squares[a];
        }
    }
    return null;
}
function checkDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            return false;
        }
    }
    return true;
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