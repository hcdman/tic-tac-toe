import { Button, TextField } from '@mui/material';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
function Square({ value, onSquareClick, isHighlighted, onSquareEnter, onSquareLeave, isHovered }) {
    return (
        <button className="square" onMouseEnter={onSquareEnter} onMouseLeave={onSquareLeave} onClick={onSquareClick} style={{ backgroundColor: isHighlighted ? 'green' : '#141b28', opacity: isHovered ? 0.7 : 1 }}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay, locations }) {
    const [hoverIndex, setHoverIndex] = useState(null);
    let n = Math.sqrt(squares.length)
    let line = [];
    function handleClick(i) {
        locations.push(i)
        if (calculateWinner(squares, line) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setHoverIndex(null);
        onPlay(nextSquares);
    }
    function handMouseEnter(i) {
        if (!squares[i] && !calculateWinner(squares, line)) {
            setHoverIndex(i);
        }
    }
    function handleMouseLeave() {
        setHoverIndex(null);
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
                        const isHovered = index === hoverIndex;
                        return (
                            line[0] && line[0].includes(index) ? <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} isHighlighted={true} />
                                : <Square key={index} value={squares[index] || (isHovered ? (xIsNext ? 'X' : 'O') : '')} onSquareClick={() => handleClick(index)} isHighlighted={false} isHovered={isHovered} onSquareEnter={() => handMouseEnter(index)} onSquareLeave={handleMouseLeave} />

                        );
                    })}
                </div>
            ))}
        </>
    );
}

function Game({ board }) {
    const [history, setHistory] = useState([Array(board * board).fill(null)]); //two dimensions arrays
    const [location] = useState([]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [isToggled, setIsToggled] = useState(true);

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
    const moves = history.map((squares, index) => {
        let move = index;
        let description;
        if (!isToggled) {
            move = history.length - index - 1;
        }
        if (move > 0) {
            description = `Go to move #${move}: (${Math.floor(location[move - 1] / board)},${location[move - 1] % board})`;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={index} style={{ margin: "3.2px" }}>
                {
                    currentMove === move ? (move === 0 ? "You are at Start" : `You are at move #${move}: (${Math.floor(location[move - 1] / board)},${location[move - 1] % board})`) : <button onClick={() => jumpTo(move)}>{description}</button>
                }
            </li>
        );
    });

    return (
        <>
            <div className="game">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} locations={location} />
                </div>
                <div className="game-info">
                    {
                        isToggled === true ? <label>ASCENDING</label> : <label>DESCENDING</label>
                    }
                    <Switch checked={isToggled} onChange={toggle} />
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
        if (board >= 3 && board <= 10)
            setShowGame(true)
        toast.error("Invalid board size ! The board size range from 3 to 9.")
    }
    function handleChange(event) {
        const newBoard = parseInt(event.target.value, 10);
        setBoard(newBoard)
    }
    return (
        showGame === true ? <Game board={board} /> :
            <div className='home'>
                <div><b>Set Game Board Size (ex: 3 for 3x3)</b></div>
                <TextField id="outlined-basic" margin='normal' size='small' value={board} onChange={(event) => handleChange(event)} type='number' style={{ backgroundColor: "#fff" }} />
                <Button variant="contained" onClick={() => handleClick()} ><b>Play</b></Button>
                <ToastContainer />
            </div>
    )
}