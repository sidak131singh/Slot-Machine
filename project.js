//1. deposite some money 
//2. determine number of lines to bet on
//3. collect a bet amout
//4. spin the slot machinne 
//5. check if the user won 
//6. give the user the money if they won
//7. play again 

const ROWS = 3;
const COLUMNS = 3;
const SYMBOLS_COUNT = {
    'A': 2,
    'B': 4,
    'C': 6,
    'D': 8
};
const SYMBOLS_VALUES = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2
};

// DOM Elements
const startGameBtn = document.getElementById('start-game');
const depositInput = document.getElementById('deposit');
const gameSetupSection = document.getElementById('game-setup');
const gamePlaySection = document.getElementById('game-play');
const balanceDisplay = document.getElementById('balance');
const linesInput = document.getElementById('lines');
const betInput = document.getElementById('bet-amount');
const spinButton = document.getElementById('spin-button');
const reelsContainer = document.querySelector('.reels');
const resultsSection = document.getElementById('results');
const winningsDisplay = document.getElementById('winnings');
const playAgainBtn = document.getElementById('play-again');

let balance = 0;

// Initialize the game
function initGame() {
    // Set up event listeners
    startGameBtn.addEventListener('click', startGame);
    spinButton.addEventListener('click', playRound);
    playAgainBtn.addEventListener('click', resetRound);
    
    // Create the initial empty reels display
    createReelsDisplay();
}

// Create the reels display in the DOM
function createReelsDisplay() {
    reelsContainer.innerHTML = '';
    
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const cell = document.createElement('div');
            cell.classList.add('reel-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.textContent = '?';
            reelsContainer.appendChild(cell);
        }
    }
}

// Start the game with initial deposit
function startGame() {
    const depositAmount = parseFloat(depositInput.value);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
    }
    
    balance = depositAmount;
    balanceDisplay.textContent = balance.toFixed(2);
    
    // Hide setup, show gameplay
    gameSetupSection.classList.add('hidden');
    gamePlaySection.classList.remove('hidden');
}

// Play a round of the slot machine
function playRound() {
    // Get number of lines and bet amount
    const lines = parseInt(linesInput.value);
    const bet = parseFloat(betInput.value);
    
    // Validate inputs
    if (isNaN(lines) || lines < 1 || lines > 3) {
        alert("Please enter a valid number of lines (1-3).");
        return;
    }
    
    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid bet amount.");
        return;
    }
    
    const totalBet = bet * lines;
    
    if (totalBet > balance) {
        alert("You don't have enough balance for this bet.");
        return;
    }
    
    // Deduct bet from balance
    balance -= totalBet;
    balanceDisplay.textContent = balance.toFixed(2);
    
    // Spin the reels
    const reels = spin();
    const rows = transpose(reels);
    
    // Update the display
    updateReelsDisplay(rows);
    
    // Calculate winnings
    const winnings = getWinnings(rows, bet, lines);
    
    // Update balance with winnings
    balance += winnings;
    balanceDisplay.textContent = balance.toFixed(2);
    
    // Show results
    resultsSection.classList.remove('hidden');
    winningsDisplay.textContent = winnings.toFixed(2);
    
    // Show play again button
    playAgainBtn.classList.remove('hidden');
    
    // Disable spin button until "Play Again" is clicked
    spinButton.disabled = true;
    
    // Check if player is out of money
    if (balance <= 0) {
        setTimeout(() => {
            alert("You ran out of money!");
            resetGame();
        }, 1000);
    }
}

// Update the reels display with the results
function updateReelsDisplay(rows) {
    const cells = document.querySelectorAll('.reel-cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        const symbol = rows[row][col];
        cell.textContent = symbol;
        
        // Remove any existing symbol classes
        cell.classList.remove('symbol-A', 'symbol-B', 'symbol-C', 'symbol-D');
        
        // Add the appropriate symbol class
        cell.classList.add(`symbol-${symbol}`);
    });
}

// Reset for a new round
function resetRound() {
    // Reset the cells to show question marks
    const cells = document.querySelectorAll('.reel-cell');
    cells.forEach(cell => {
        cell.textContent = '?';
        // Remove any existing symbol classes
        cell.classList.remove('symbol-A', 'symbol-B', 'symbol-C', 'symbol-D');
    });
    
    // Hide results and play again button
    resultsSection.classList.add('hidden');
    playAgainBtn.classList.add('hidden');
    spinButton.disabled = false;
}

// Reset the entire game
function resetGame() {
    balance = 0;
    gamePlaySection.classList.add('hidden');
    gameSetupSection.classList.remove('hidden');
    depositInput.value = '';
    linesInput.value = '1';
    betInput.value = '1';
    createReelsDisplay();
}

const spin = () => {
    const allSymbols = [];
    for(const [symbol , count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            allSymbols.push(symbol);
        }
    }
    const reels = [];
    for(let i = 0; i < COLUMNS; i++){
        reels.push([]);
        const reelSymbols = [...allSymbols];
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for(let i = 0; i < ROWS ; i++){
        rows.push([]);
        for(let j = 0; j < COLUMNS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}
    
const printRows = (rows) => {
    for(const row of rows){
        let rowString = "" ;
        for( const [i,symbol] of row.entries()){
            rowString += symbol ;
            if(i !== row.length - 1){
                rowString += " | " ;
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows , bet , lines) => {
    let winnings = 0;
    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allsame = true;

        for(const symbol of symbols){
            if(symbol !== symbols[0]){
                allsame = false;
                break;
            }
        }
        if(allsame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
