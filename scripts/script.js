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
const resultMessage = document.getElementById("resultMessage")
const moveNumber = document.getElementById("moveNumber")
const chronometerDisplay = document.getElementById("chronometerDisplay")
const levelDisplay = document.getElementById("levelDisplay")
const mainGame = document.querySelector(".main-game")
const main = document.querySelector("main")
const firstMessage = document.getElementById("firstMessage")
const secondMessage = document.getElementById("secondMessage") 
const thirdMessage = document.getElementById("thirdMessage")
const resultMessageText = document.getElementById("resultMessageText")

let heroPosition = []

const hero = document.createElement("div")
hero.setAttribute("id", "hero")

let finishPosition = []

let gameWon = false
let moveCount = 0

let miliseconds = 0
let seconds = 0
let minutes = 0
let chronometerCall

let rotateMode = false
let degrees = 0
let rotationCall

let currentLevel = 1

let shakeMode = false
let shakeCall

let invisibleMode = false
let invisibleCall

let messagesAppear = false
let messagesCall

let gameOver = false
let checkGameOverCall

let trapMode = false
let trapList = [0, 0]
let trapCall
let removeTrapCall

/* DECLARAÇÃO DE VARIÁVEIS */



/* FUNÇÕES DO JOGO */


startBtn.addEventListener("click", game)

restartBtn.addEventListener("click", game)

function game() {

    resultMessage.classList.add("hidden")
    mapGenerator(mapDefault)
    gameWon = false
    moveCount = 0
    moveCounter()

    clearInterval(chronometerCall)
    chronometerDisplay.innerText = `20:00`
    chronometerCall = setInterval(chronometer, 10)

    removeRotation()
    levelManager()

    modeExecute()


    clearInterval(checkGameOverCall)
    checkGameOverCall = setInterval(checkGameOver, 10)
    gameOver = false
}

    




const modeExecute = () =>{

    clearInterval(trapCall)
    clearTimeout(removeTrapCall)
    trapCall = setInterval(addTrap, 2000)

    clearInterval(messagesCall)
    messagesCall = setInterval(randomMessages, 2000)

    addShake()
    
    clearInterval(invisibleCall)
    invisibleCall = setInterval(invisibleChange, 2000)

    clearInterval(rotationCall)
    rotationCall = setInterval(addRotation, 2200)
}


const mapGenerator = (newMap) => {

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

    if (gameWon === false) {
        winningEvent()
    }
    
})



const checkViability = (newMap, newPositionY, newPositionX) => {

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

    if (gameWon) {
        viability = false
    }

    if (gameOver) {
        viability = false
    }

    return viability
}


const changeSquare = (newPositionY, newPositionX) => {

    let destinySquare = document.querySelector(`.row:nth-child(${newPositionY + 1}) .square:nth-child(${newPositionX + 1})`)
    destinySquare.append(hero)
    heroPosition = [newPositionY, newPositionX]
    moveCount++
    moveCounter()
}



const winningEvent = () => {

    if (heroPosition[0] === finishPosition[0] && heroPosition[1] === finishPosition[1]) {

        gameWon = true
        showResult()
        clearInterval(chronometerCall)

        clearInterval(rotationCall)
    
        nextLevel()
        removeShake()
        messagesAppear = false
        randomMessages()
    }

}


const moveCounter = () => {

    moveNumber.innerText = moveCount

}


const chronometer = () => {

    if (chronometerDisplay.innerText === `20:00`) {
        seconds = 20
        miliseconds = 00
    }

    miliseconds--

    if (miliseconds < 0) {
      miliseconds = 99
      miliseconds = `${miliseconds}`
    }

    if (miliseconds === "99") {
      seconds--
    }

    if (miliseconds < 10) {
        miliseconds = `0` + Number(miliseconds)
    }    

    if (seconds < 0) {
        seconds = 20
    }

    if (seconds < 10) {
        seconds = `0` + Number(seconds)
    }


    chronometerDisplay.innerText = `${seconds}:${miliseconds}`
}


const addRotation = () => {

    if (rotateMode) {
        map.classList.add("rotate")
        let rotatingObject = document.querySelector(".rotate")
        
        degrees -= 90
        rotatingObject.style.transform = `rotate(${degrees}deg)`
        
    }
    

}

const removeRotation = () => {

    degrees = 0

    if (rotateMode) {
        let rotatingObject = document.querySelector(".rotate") 
        rotatingObject.style.transform = `rotate(${degrees}deg)`
        map.classList.remove("rotate")
    }
    
}

const nextLevel = () => {

    currentLevel++
    levelDisplay.innerText = currentLevel

}


const addShake = () => {

    if (shakeMode) {
        mainGame.classList.add("shake")
    }


}

const removeShake = () => {

    mainGame.classList.remove("shake")

}

const invisibleChange = () => {

    if (invisibleMode) {
        hero.classList.toggle("hidden")
    }

}


const randomMessages = () => {

    firstMessage.classList.add("hidden")
    secondMessage.classList.add("hidden")
    thirdMessage.classList.add("hidden")

    if (messagesAppear) {

        let choices = [firstMessage, secondMessage, thirdMessage]

        let randomNumber = Math.floor(Math.random() * 3)

        choices[randomNumber].classList.remove("hidden")

    }
    
}


const gameLost = () => {

    if (gameOver) {
        
        showResult()
        clearInterval(chronometerCall)

        clearInterval(rotationCall)
    
        removeShake()
        messagesAppear = false
        randomMessages()
 
        clearInterval(checkGameOverCall)
        
    }
 
}


const checkGameOver = () => {

    if (heroPosition[0] === trapList[0][0] & heroPosition[1] === trapList[0][1]) { 
  
         gameOver = true
  
    }
  
    if (heroPosition[0] === trapList[1][0] & heroPosition[1] === trapList[1][1]) { 
  
         gameOver = true
  
    }
  
    if (chronometerDisplay.innerText === "00:00") {
    
        gameOver = true
    }
  
    gameLost()
  }




const showResult = () => {

    if (gameWon) {
        resultMessage.classList.remove("hidden")
        resultMessageText.innerText = "Parabéns, você chegou ao final!"
    }
    
    if (gameOver) {
        resultMessage.classList.remove("hidden")
        resultMessageText.innerText = ":(((((("
    }

}


const randomNumberGen = (range) => {

    let randomNumber = Math.floor(Math.random() * range)
  
    return randomNumber
}

const addTrap = () => {

    if (trapMode) {

        let goalTrap = [[5,1], [3,9], [9,11], [7,13]]
        let fakeTrap = [[11,3], [9,9], [5,13]]

        let trapIndex = randomNumberGen(goalTrap.length - 1)
        let trapY = goalTrap[trapIndex][0]
        let trapX = goalTrap[trapIndex][1]

        trapList = []

        trapPosition = [trapY, trapX]
        trapList.push(trapPosition)

        trapElement = document.querySelector(`.row:nth-child(${trapY + 1}) .square:nth-child(${trapX + 1})`)
        trapElement.classList.add("trap")

        trapIndex = randomNumberGen(fakeTrap.length - 1)
        trapY = fakeTrap[trapIndex][0]
        trapX = fakeTrap[trapIndex][1]

        trapPosition = [trapY, trapX]
        trapList.push(trapPosition)

        trapElement = document.querySelector(`.row:nth-child(${trapY + 1}) .square:nth-child(${trapX + 1})`)
        trapElement.classList.add("trap")

        removeTrapCall = setTimeout(removeTrap, 1000)

    }
}

const removeTrap = () => {
    let trapRemover = document.querySelector(".trap")
    trapRemover.classList.remove("trap")
    trapRemover = document.querySelector(".trap")
    trapRemover.classList.remove("trap")
    trapList = [[0, 0], [0, 0]]
}


const levelManager = () => {

    if (currentLevel === 2) {
        trapMode = true
        messagesAppear = true
        shakeMode = false
        invisibleMode = false
        rotateMode = false
        
    }

    if (currentLevel === 3) {
        trapMode = true
        messagesAppear = true
        shakeMode = true
        invisibleMode = false
        rotateMode = false     
    }

    if (currentLevel === 4) {
        trapMode = true
        messagesAppear = true
        shakeMode = true
        invisibleMode = true
        rotateMode = false
    }

    if (currentLevel === 5) {
        trapMode = true
        messagesAppear = true
        shakeMode = true
        invisibleMode = true
        rotateMode = true
    }

    if (currentLevel === 6) {
        
    }

    if (currentLevel === 7) {
        
    }

    if (currentLevel === 8) {
        
    }

    if (currentLevel === 9) {
        
    }

    if (currentLevel === 10) {
        
    }
}
