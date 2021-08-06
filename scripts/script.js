/* DECLARAÇÃO DE VARIÁVEIS */

const mapDefault = [
    "WWWWWWWWWWWWWWWWWWWWW",
    "W   W     W     W W W",
    "W W W WWW WWWWW W W W",
    "W W W   W     W W   W",
    "W WWWWWWW W WWW W W W",
    "W         W     W W W",
    "W WWW WWWWW WWWWW W W",
    "W W   W   W W     W W",
    "W WWWWW W W W WWW W F",
    "S     W W W W W W WWW",
    "WWWWW W W W W W W W W",
    "W     W W W   W W W W",
    "W WWWWWWW WWWWW W W W",
    "W       W       W   W",
    "WWWWWWWWWWWWWWWWWWWWW",
];
/* 21 colunas (células) e 14 linhas */


const map = document.getElementById("map")
const startBtn = document.getElementById("startBtn")
const restartBtn = document.getElementById("restartBtn")
const winningMessage = document.getElementById("winningMessage")
const moveNumber = document.getElementById("moveNumber")
const chronometerDisplay = document.getElementById("chronometerDisplay")
const levelDisplay = document.getElementById("levelDisplay")
const mainGame = document.querySelector(".main-game")
const main = document.querySelector("main")

let heroPosition = []

const hero = document.createElement("div")
hero.setAttribute("id", "hero")

let finishPosition = []

let gameWon = false
let moveCount = 0

let seconds = 0
let minutes = 0
let chronometerCall

let rotateMode = false
let degrees = 0
let rotationCall

let currentLevel = 1

let shakeMode = false
let shakeCall

/* DECLARAÇÃO DE VARIÁVEIS */



/* FUNÇÕES DO JOGO */


startBtn.addEventListener("click", function() {
    mapGenerator(mapDefault)
    moveCount = 0
    moveCounter()

    clearInterval(chronometerCall)
    chronometerDisplay.innerText = `00:00`
    chronometerCall = setInterval(chronometer, 1000)

    clearInterval(rotationCall)
    removeRotation()
    if (currentLevel > 1) {
        rotateMode = true
    }
    rotationCall = setInterval(addRotation, 2200)

    if (currentLevel > 2) {
        shakeMode = true
    }
    addShake()

})

restartBtn.addEventListener("click", function() {
    winningMessage.classList.add("hidden")
    mapGenerator(mapDefault)
    gameWon = false
    moveCount = 0
    moveCounter()
    chronometerDisplay.innerText = `00:00`
    chronometerCall = setInterval(chronometer, 1000)

    clearInterval(rotationCall)
    removeRotation()
    if (currentLevel > 1) {
        rotateMode = true
    }
    rotationCall = setInterval(addRotation, 2200)

    if (currentLevel > 2) {
        shakeMode = true
    }
    addShake()
})


let mapGenerator = (newMap) => {

    map.innerText = ""

    for (let i = 0; i < newMap.length; i++) {

        let newRow = document.createElement("div")
        newRow.classList.add("row")

        for (let j = 0; j < newMap[i].length; j++) {

            let newSquare = document.createElement("div")
            newSquare.classList.add("square")
            if (newMap[i][j] === "W") {
                newSquare.classList.add("wall")
            }
            if (newMap[i][j] === " ") {
                newSquare.classList.add("floor")
            }
            if (newMap[i][j] === "S") {
                newSquare.classList.add("floor")
                newSquare.append(hero)
                heroPosition = [i, j]
            }
            if (newMap[i][j] === "F") {
                newSquare.classList.add("finish")
                finishPosition = [i, j]
            }
            newRow.append(newSquare)
        }

        map.append(newRow)  
    }
}




document.addEventListener('keydown', (event) => {
    
    const keyName = event.key

    let positionY = heroPosition[0]
    let positionX = heroPosition[1]

    if (keyName === "ArrowUp" & checkViability(mapDefault, positionY - 1, positionX)) {
        changeSquare(positionY -1, positionX)
    }

    if (keyName === "ArrowDown" & checkViability(mapDefault, positionY + 1, positionX)) {
        changeSquare(positionY +1, positionX)
    }

    if (keyName === "ArrowRight" & checkViability(mapDefault, positionY, positionX + 1)) {
        changeSquare(positionY, positionX + 1)
    }

    if (keyName === "ArrowLeft" & checkViability(mapDefault, positionY, positionX - 1)) {
        changeSquare(positionY, positionX - 1)
    }
    winningEvent()
})



let checkViability = (newMap, newPositionY, newPositionX) => {

    let viability = true

    if (newPositionY < 0 || newPositionY >= newMap.length) {
        viability = false
    }

    if (newPositionX < 0 || newPositionX >= newMap[0].length) {
        viability = false
    }

    if (newMap[newPositionY][newPositionX] === "W") {
        viability = false
    }

    if (gameWon === true) {
        viability = false
    }

    return viability
}


let changeSquare = (newPositionY, newPositionX) => {

    let destinySquare = document.querySelector(`.row:nth-child(${newPositionY + 1}) .square:nth-child(${newPositionX + 1})`)
    destinySquare.append(hero)
    heroPosition = [newPositionY, newPositionX]
    moveCount++
    moveCounter()
}



let winningEvent = () => {

    if (heroPosition[0] === finishPosition[0] && heroPosition[1] === finishPosition[1]) {

        gameWon = true
        winningMessage.classList.remove("hidden")
        clearInterval(chronometerCall)

        clearInterval(rotationCall)
    
        nextLevel()
        removeShake()
    }

}


let moveCounter = () => {

    moveNumber.innerText = moveCount

}


let chronometer = () => {

    if (chronometerDisplay.innerText === `00:00`) {
        seconds = 0
        minutes = 0
    }

    seconds++

    if (seconds < 10) {
        seconds = `0` + Number(seconds)
    }

    if (seconds > 59) {
        seconds = `00`
        minutes++
    }

    if (minutes < 10) {
        minutes = `0` + Number(minutes)
    }


    if (minutes > 59) {
        minutes = `00`
    }

    chronometerDisplay.innerText = `${minutes}:${seconds}`
}


let addRotation = () => {

    if (rotateMode) {
        map.classList.add("rotate")
        let rotatingObject = document.querySelector(".rotate")
        
        degrees -= 90
        rotatingObject.style.transform = `rotate(${degrees}deg)`
        
    }
    

}

let removeRotation = () => {

    degrees = 0

    if (rotateMode) {
        let rotatingObject = document.querySelector(".rotate") 
        rotatingObject.style.transform = `rotate(${degrees}deg)`
        map.classList.remove("rotate")
    }
    
}

let nextLevel = () => {

    currentLevel++
    levelDisplay.innerText = currentLevel

}


let addShake = () => {

    if (shakeMode) {
        mainGame.classList.add("shake")
    }


}

let removeShake = () => {

    mainGame.classList.remove("shake")

}
