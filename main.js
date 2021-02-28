const gameBoard = (function(){
    const gameBoardArr = [["","",""],["","",""],["","",""]];

    let addMove = function(pos1, pos2, sign){
        if(gameBoardArr[pos1][pos2] == ""){
            gameBoardArr[pos1][pos2] = `${sign}`
            displayController.render()
            setTimeout(gameFlow.boardCheck, 100)
            let changeSign = function () {
                if(sign == "x"){
                    gameFlow.setSign("o")
                }else{
                    gameFlow.setSign("x")
                }
            }
            setTimeout(changeSign, 120)
        }
        
    }
    let getBoard = function(){
        return gameBoardArr
    }
    
    return{
        addMove,
        getBoard
    }
})()

const Players = (sign, name) => {
    let playerSign = sign
    const makeMove = function(pos1, pos2, plyrsign){
        gameBoard.addMove(pos1, pos2, plyrsign)
    }
    const getPlayerSign = function(){
        return playerSign
    }
    return{
        makeMove,
        getPlayerSign
    }
}

const displayController = (function(){
    let board = gameBoard.getBoard()
    let cells = document.querySelectorAll(".cell")
    let resultDisplayer = document.querySelector("#result-displayer")
    let resultDisplayerContent = resultDisplayer.querySelector("#content-holder")

    let pos1, pos2;
    let render = function(){
        cells.forEach((e) => {
            pos1 = e.id[0]
            pos2 = e.id[1]
            e.textContent = board[pos1][pos2]
        })
    }
    let publishWinner = function(winnerSign){
        resultDisplayer.style.display = "flex"
        if(winnerSign == "x" || winnerSign == "o"){
            resultDisplayerContent.textContent = `We have a winner, Player${winnerSign.toUpperCase()} won the game!!!`
        }else{
            resultDisplayerContent.textContent = `${winnerSign}`
        }
        resultDisplayer.addEventListener("click", () => setTimeout(gameFlow.resetGame, 500))
    }
    render()
    return{
        render,
        publishWinner
    }
})()

const gameFlow = (function(){
    let playerX = Players("x")
    let playerO = Players("o")
    let plsign = "x"
    let board = gameBoard.getBoard()
    let cells = document.querySelectorAll(".cell")
    let init = function(){
        if(plsign == "x"){
            cells.forEach((e) => {
                e.addEventListener("click", () => playerX.makeMove(e.id[0], e.id[1], plsign))
            })
        }else{
            cells.forEach((e) => {
                e.removeEventListener("click", () => playerX.makeMove(e.id[0], e.id[1], plsign))
                .addEventListener("click", () => playerO.makeMove(e.id[0], e.id[1], plsign))
            })
        }
    }
    let boardCheck = function(){
        let rowArray = []
        , crossArray = []
        , rowSubArr = []
        , crossSubArr = []
        , crossSubArr2 = []
        , lineCheck
        , rowCheck
        , crossCheck
        ,tieCheck;
        
        for(let i = 0; i < board.length; i++){ // Creates arrays from rows and crosses
            crossSubArr.push(board[i][i])
            crossSubArr2.push(board[2-i][i])
            for(let j = 0; j < board.length; j++){
                rowSubArr.push(board[j][i])
            }
            rowArray.push(rowSubArr)
            rowSubArr = []
        }
        crossArray.push(crossSubArr, crossSubArr2) // adds cross sub arrays to cross array

        lineCheck = board.some((e) => e.every((subElem) => subElem == e[0] && subElem != ""))
        crossCheck = crossArray.some((e) => e.every((subElem) => subElem == e[0] && subElem != ""))
        rowCheck = rowArray.some((e) => e.every((subElem) => subElem == e[0] && subElem != ""))
        tieCheck = board.every((e) => e.every((subE) => subE == "x" || subE == "o"))


        if(lineCheck || rowCheck || crossCheck){
            displayController.publishWinner(plsign)
        }else if(tieCheck){
            displayController.publishWinner("It is a tie!!")
        }
    }
    let resetGame = function(){
        location.reload()
    }
    let setSign = function(newSign){
        plsign = newSign
    }
    let getSign = function(){
        return plsign
    }
    init()
    return{
        setSign,
        init,
        getSign,
        boardCheck,
        resetGame,
        removeAllListeners
    }
})()
