const Words = ["Banana", "Apple", "Microsoft", "Xbox", "Man", "Hand", "Red", "Strawberry", "Playstation", "Sony", "Blue", "Yellow", "Green", "Silver", "Meat", "Cookie", "Selfish", "Github", "Javascript", "Csharp", "Cplusplus", "Html", "Css", "Scss", "Php"]
var ErrorsCount = 0
var HitsCount = 0
var HintBtnPressed = false
var Wins = localStorage.getItem("Wins") != null ? localStorage.getItem("Wins") : 0
var Loses = localStorage.getItem("Loses") != null ? localStorage.getItem("Loses") : 0

window.addEventListener("load", () => {
    var Word = Words[Math.floor(Math.random() * Words.length)]
    var ErrorsMax = Word.length + 1

    function SetCorrect(InputNode, index) {
        InputNode[index].value = Word[index];
        InputNode[index].readOnly = true;
        HitsCount++;
    }
    
    document.getElementById("MaxErrors").innerText = ErrorsMax
    document.getElementById("Wins").innerText = `${Wins}`;
    document.getElementById("Loses").innerText = `${Loses}`;
    
    var DivInps = document.getElementById("inputChars")
    for (let index = 0; index < Word.length; index++) DivInps.appendChild(document.createElement("input"));
    
    var DivInpsNodes = DivInps.querySelectorAll("input")
    document.getElementById("SubmitBtn").addEventListener('click', () => {
        for (let i = 0; i < DivInpsNodes.length; i++) {
            if (DivInpsNodes[i].value == Word[i] && DivInpsNodes[i].readOnly != true ) {
                DivInpsNodes[i].readOnly = true
                HitsCount++;
            } 
            else if (DivInpsNodes[i].value != "" && DivInpsNodes[i].readOnly != true) ErrorsCount++;
        }
        if (HitsCount == Word.length) {
            localStorage.setItem("Wins", ++Wins);
            document.getElementById("MainContent").innerHTML = `YOU WIN ! The word was ${Word}<br/><br/><button id="reloadPage">Take another word</button>`;
        }
        if (ErrorsCount >= ErrorsMax) {
            localStorage.setItem("Loses", ++Loses);
            document.getElementById("MainContent").innerHTML = `GAME OVER ! The word was ${Word}<br/><br/><button id="reloadPage">Take another word</button>`;
        } 
        if (document.getElementById("ErrosrCount") != null) document.getElementById("ErrosrCount").innerText = ErrorsCount;
        if (document.getElementById("reloadPage") != null) document.getElementById("reloadPage").addEventListener('click', () => location.reload());
    })
    
    document.getElementById("HintBtn").addEventListener('click', () => {
        if (HintBtnPressed == false) {
            if (Word.length >= 6) {
                SetCorrect(DivInpsNodes, 3);
            } 
            SetCorrect(DivInpsNodes, 0)
            SetCorrect(DivInpsNodes, DivInpsNodes.length - 1)
            HintBtnPressed = true;
        }
    })
})