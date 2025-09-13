const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const modeSelect = document.getElementById('modeSelect');
const aiSelect = document.getElementById('aiLevel');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function renderBoard() {
    boardEl.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', () => makeMove(idx));
        boardEl.appendChild(cellDiv);
    });
}

function makeMove(idx) {
    if (!gameActive || board[idx] !== '') return;
    board[idx] = currentPlayer;
    renderBoard();
    if (checkWin(currentPlayer)) {
        messageEl.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    if (!board.includes('')) {
        messageEl.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    if (modeSelect.value === 'pvp') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    } else {
        currentPlayer = 'O';
        setTimeout(aiMove, 400);
    }
}

function aiMove() {
    if (!gameActive) return;
    let move;
    const level = aiSelect.value;

    if (level === 'dumb') {
        move = randomMove();
    } else if (level === 'amateur') {
        move = amateurMove();
    } else if (level === 'smart') {
        move = minimax(board, 'O').index;
    }

    board[move] = currentPlayer;
    renderBoard();

    if (checkWin(currentPlayer)) {
        messageEl.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    if (!board.includes('')) {
        messageEl.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
}

function randomMove() {
    const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}

function amateurMove() {
    // Try to win
    for (let i=0; i<board.length; i++) {
        if (board[i]==='') {
            board[i] = 'O';
            if (checkWin('O')) return i;
            board[i] = '';
        }
    }
    // Block X
    for (let i=0; i<board.length; i++) {
        if (board[i]==='') {
            board[i] = 'X';
            if (checkWin('X')) { board[i]=''; return i; }
            board[i] = '';
        }
    }
    return randomMove();
}

function checkWin(player) {
    return winCombos.some(combo => combo.every(idx => board[idx] === player));
}

// Minimax algorithm
function minimax(newBoard, player) {
    const availSpots = newBoard.map((v,i)=>v===''?i:null).filter(v=>v!==null);
    if (checkWin('X')) return {score: -10};
    if (checkWin('O')) return {score: 10};
    if (availSpots.length===0) return {score:0};

    const moves = [];
    for (let i=0;i<availSpots.length;i++) {
        const move={};
        move.index=availSpots[i];
        newBoard[availSpots[i]]=player;

        if (player==='O') {
            const result=minimax(newBoard,'X');
            move.score=result.score;
        } else {
            const result=minimax(newBoard,'O');
            move.score=result.score;
        }
        newBoard[availSpots[i]]='';
        moves.push(move);
    }

    let bestMove;
    if(player==='O'){
        let bestScore=-Infinity;
        moves.forEach(m=>{if(m.score>bestScore){bestScore=m.score; bestMove=m;}});
        return bestMove;
    } else {
        let bestScore=Infinity;
        moves.forEach(m=>{if(m.score<bestScore){bestScore=m.score; bestMove=m;}});
        return bestMove;
    }
}

restartBtn.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    messageEl.textContent = '';
    renderBoard();
});

    document.getElementById("redirectBtn").addEventListener("click", function() {
    window.location.href = "index.html";
    });

renderBoard();