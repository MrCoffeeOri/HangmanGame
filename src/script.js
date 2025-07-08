class HangmanGame {
    constructor() {
        this.words = [
            "Afraid", "Take", "Frame", "Thought", "Knowledge", "Glass", "Grass", 
            "Grace", "Beautiful", "Archer", "Short", "Tall", "Lost", "Ice", "Eyes", 
            "Masterpiece", "Down", "Front", "Right", "Left", "Back", "Thief", 
            "Robber", "Politician", "Lucky", "Banana", "Apple", "Man", "Hand", 
            "Red", "Strawberry", "Blue", "Yellow", "Green", "Silver", "Meat", 
            "Cookie", "Selfish", "Chocolate", "Love", "Sweety", "Heart", 
            "Through", "True", "False", "Adventure", "Mystery", "Wonder", 
            "Courage", "Freedom", "Justice", "Harmony", "Wisdom", "Victory"
        ];
        
        this.currentWord = "";
        this.errorsCount = 0;
        this.hitsCount = 0;
        this.maxErrors = 0;
        this.hintUsed = false;
        this.gameActive = false;
        
        this.scores = {
            wins: parseInt(localStorage.getItem("Wins")) || 0,
            loses: parseInt(localStorage.getItem("Loses")) || 0
        };
        
        this.init();
    }
    
    init() {
        this.updateScores();
        this.startNewGame();
        this.setupEventListeners();
    }
    
    startNewGame() {
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.maxErrors = Math.min(this.currentWord.length + 1, 8);
        this.errorsCount = 0;
        this.hitsCount = 0;
        this.hintUsed = false;
        this.gameActive = true;
        
        this.createLetterInputs();
        this.updateUI();
        this.enableButtons();
        this.showMessage("New game started, good luck!");
    }
    
    createLetterInputs() {
        const inputContainer = document.getElementById("inputChars");
        inputContainer.innerHTML = "";
        
        for (let i = 0; i < this.currentWord.length; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.dataset.index = i;
            input.placeholder = "?";
            
            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.toUpperCase();
                this.moveToNextEmptyInput(e.target);
            });
            
            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && e.target.value === "") {
                    return this.moveToPreviousInput(e.target);
                }
                if (e.key === "ArrowLeft") {
                    return this.moveToPreviousInput(e.target);
                }
                if (e.key === "ArrowRight") {
                    return this.moveToNextInput(e.target);
                }
            });
            
            inputContainer.appendChild(input);
        }
        if (inputContainer.firstChild && this.gameActive) {
            inputContainer.firstChild.focus();
        }
    }
    
    moveToNextInput(currentInput) {
        const inputs = document.querySelectorAll("#inputChars input");
        const currentIndex = parseInt(currentInput.dataset.index);
        
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }
    
    moveToPreviousInput(currentInput) {
        const inputs = document.querySelectorAll("#inputChars input");
        const currentIndex = parseInt(currentInput.dataset.index);
        
        if (currentIndex > 0) {
            inputs[currentIndex - 1].focus();
        }
    }

    moveToNextEmptyInput(currentInput) {
        const inputs = document.querySelectorAll("#inputChars input");
        const currentIndex = parseInt(currentInput.dataset.index);
        for (let i = currentIndex + 1; i < inputs.length; i++) {
            if (!inputs[i].readOnly && inputs[i].value === "") {
                inputs[i].focus();
                return;
            }
        }
    }
    
    checkWord() {
        if (!this.gameActive) return;
        
        const inputs = document.querySelectorAll("#inputChars input");
        let newHits = 0;
        let newErrors = 0;
        
        inputs.forEach((input, index) => {
            if (input.readOnly) return;
            
            const userLetter = input.value.toUpperCase();
            const correctLetter = this.currentWord[index].toUpperCase();
            
            if (userLetter === correctLetter && userLetter !== "") {
                input.readOnly = true;
                input.classList.add("correct");
                newHits++;
            } else if (userLetter !== "" && userLetter !== correctLetter) {
                input.classList.add("error");
                setTimeout(() => {
                    input.classList.remove("error");
                }, 500);
                newErrors++;
            }
        });
        
        this.hitsCount += newHits;
        this.errorsCount += newErrors;
        
        this.updateUI();
        this.checkGameEnd();
    }
    
    useHint() {
        if (!this.gameActive || this.hintUsed) return;
        
        const inputs = document.querySelectorAll("#inputChars input");
        const unrevealedIndices = [];
        
        inputs.forEach((input, index) => {
            if (!input.readOnly) {
                unrevealedIndices.push(index);
            }
        });
        
        if (unrevealedIndices.length === 0) return;
        
        let indicesToReveal = [];
        if (this.currentWord.length >= 6) {
            indicesToReveal = [0, this.currentWord.length - 1];
        } else {
            const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            indicesToReveal = [randomIndex];
        }
        
        indicesToReveal.forEach(index => {
            if (!inputs[index].readOnly) {
                inputs[index].value = this.currentWord[index].toUpperCase();
                inputs[index].readOnly = true;
                inputs[index].classList.add("correct");
                this.hitsCount++;
            }
        });
        
        this.hintUsed = true;
        this.updateUI();
        this.checkGameEnd();
    }
    
    checkGameEnd() {
        if (this.hitsCount >= this.currentWord.length) {
            this.endGame(true);
        } else if (this.errorsCount >= this.maxErrors) {
            this.endGame(false);
        }
    }
    
    endGame(won) {
        this.gameActive = false;
        if (won) {
            this.scores.wins++;
            this.showMessage("🎉 YOU WIN! 🎉", "win");
        } else {
            this.scores.loses++;
            this.showMessage(`💀 GAME OVER! The word was: ${this.currentWord}`, "lose");
        }
        this.saveScores();
        this.updateScores();
        this.disableButtons();
        const messageEl = document.getElementById("GameMessage");
        const restartBtn = document.createElement("button");
        restartBtn.textContent = "Play Again";
        restartBtn.addEventListener("click", () => this.startNewGame());
        messageEl.appendChild(restartBtn);
    }
    
    showMessage(text, type = "") {
        const messageEl = document.getElementById("GameMessage");
        messageEl.textContent = text;
        messageEl.className = `game-message ${type}`;
        messageEl.style.animation = "fadeIn 0.5s ease";
    }
    
    updateUI() {
        document.getElementById("ErrorsCount").textContent = this.errorsCount;
        document.getElementById("MaxErrors").textContent = this.maxErrors;
        
        const progressFill = document.getElementById("ProgressFill");
        const progressPercentage = (this.errorsCount / this.maxErrors) * 100;
        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
        
        const hintBtn = document.getElementById("HintBtn");
        if (this.hintUsed) {
            hintBtn.disabled = true;
            hintBtn.textContent = "Hint Used";
        }
    }
    
    updateScores() {
        document.getElementById("Wins").textContent = this.scores.wins;
        document.getElementById("Loses").textContent = this.scores.loses;
    }
    
    saveScores() {
        localStorage.setItem("Wins", this.scores.wins);
        localStorage.setItem("Loses", this.scores.loses);
    }
    
    enableButtons() {
        document.getElementById("SubmitBtn").disabled = false;
        document.getElementById("HintBtn").disabled = false;
        document.getElementById("NewGameBtn").disabled = false;
    }
    
    disableButtons() {
        document.getElementById("SubmitBtn").disabled = true;
        document.getElementById("HintBtn").disabled = true;
        document.getElementById("NewGameBtn").disabled = true;
    }
    
    setupEventListeners() {
        document.getElementById("SubmitBtn").addEventListener("click", () => {
            this.checkWord();
        });
        
        document.getElementById("HintBtn").addEventListener("click", () => {
            this.useHint();
        });
        
        document.getElementById("NewGameBtn").addEventListener("click", () => {
            this.startNewGame();
        });
        
        window.addEventListener("keydown", (e) => {
            if (!this.gameActive) return;
            
            if (e.key === "Enter") {
                e.preventDefault();
                this.checkWord();
            } else if (e.key === "H") {
                e.preventDefault();
                this.useHint();
            } else if (e.key === "N") {
                e.preventDefault();
                this.startNewGame();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new HangmanGame();
    const infoBtn = document.getElementById("InfoBtn");
    const infoModal = document.getElementById("InfoModal");
    const closeInfoModal = document.getElementById("CloseInfoModal");
    infoBtn.addEventListener("click", () => {
        infoModal.classList.add("active");
    });
    closeInfoModal.addEventListener("click", () => {
        infoModal.classList.remove("active");
    });
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            infoModal.classList.remove("active");
        }
    });
    infoModal.addEventListener("click", (e) => {
        if (e.target === infoModal) {
            infoModal.classList.remove("active");
        }
    });
});
