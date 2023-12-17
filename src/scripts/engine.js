const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox : document.getElementById("score_points")
  },
  cardSprites : {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards : {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card") 
  },
  actions: {
    button: document.getElementById("next-duel")
  },
  playerSides: {
    player1: "player-cards",
    player1Box: document.querySelector(".card-box.framed#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector(".card-box.framed#computer-cards")
  }
  
}

const pathImages = "./src/assets/icons/"

const cardData = [
  {
    id: 0,
    name: "Infernal Dragon",
    type: "Paper",
    img: pathImages + "infernal-dragon.jpg",
    WinOf: [1, 3],
    LoseOf: [2]
  }, 
  {
    id: 1,
    name: "Mountain Dragon",
    type: "Rock",
    img: pathImages + "mountain-dragon.jpg",
    WinOf: [2],
    LoseOf: [0, 4]
  }, 
  {
    id: 2,
    name: "Wind Dragon",
    type: "scissors",
    img: pathImages + "wind-dragon.jpg",
    WinOf: [0, 4],
    LoseOf: [1, 3]
  },
  {
    id: 3,
    name: "Lighting Dragon",
    type: "Rock",
    img: pathImages + "lighting-dragon.jpg",
    WinOf: [2],
    LoseOf: [0, 4]
  },
  {
    id: 4,
    name: "Water Dragon",
    type: "Paper",
    img: pathImages + "water-dragon.jpg",
    WinOf: [1, 3],
    LoseOf: [2]
  }
  
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img")
  cardImage.setAttribute("height", "100px")
  cardImage.setAttribute("src", "./src/assets/icons/back-dragon-card.png")
  cardImage.setAttribute("data-id", idCard)
  cardImage.classList.add("card")

  if(fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(idCard)
     }) 

     cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"))
     })
  }
  return cardImage
}

async function setCardsField(cardId) {
  await removeAllCardsImages()

  let computerCardId = await getRandomCardId()

  await shorHiddenCardsdFieldsImages(true)

  await drawCardsInField(cardId, computerCardId)

  let duelResults = await checkDuelResults(cardId, computerCardId)

  await updateScore()
  await drawButton(duelResults)
}

async function shorHiddenCardsdFieldsImages(value) {
  if(value == true) {
    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"
  }

  if(value == false) {
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
  }
}

async function drawCardsInField(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img
  state.fieldCards.computer.src = cardData[computerCardId].img
  state.fieldCards.player.classList.add("cards-duel")
  state.fieldCards.computer.classList.add("cards-duel")
}

async function hidenCardsDetails() {
  state.cardSprites.name.innerText = ""
  state.cardSprites.type.innerText = ""
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase()
  state.actions.button.style.display = "block"
}

async function updateScore() {
  state.score.scoreBox.innerHTML = `<span id="winCount">Win: ${state.score.playerScore} </span> </br> <span id="loseCount">Lose: ${state.score.computerScore}</span> `
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Empate"
  let playerCard = cardData[playerCardId]

  if(playerCard.WinOf.includes(computerCardId)) {
    duelResults = "Ganhou"
    await playAudio("win")
    state.score.playerScore++
  }

  if(playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "Perdeu Play Boy"
    await playAudio("lose")
    state.score.computerScore++
  }

  return duelResults
}

async function removeAllCardsImages() {
  let { computerBox , player1Box} = state.playerSides
  let imagesElements = computerBox.querySelectorAll("img")
  imagesElements.forEach((img) => { 
    img.remove()
  })
  imagesElements = player1Box.querySelectorAll("img")
  imagesElements.forEach((img) => { 
    img.remove()
  })
}

async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardData[index].img
  state.cardSprites.name.innerText = cardData[index].name
  state.cardSprites.type.innerHTML = "Atributte : " + "<span>" + cardData[index].type + "</span>"
  state.cardSprites.avatar.classList.add("card-image")
}

async function drawCards(cardNumbers, fieldSide) {
  for(let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId()
    const cardImage = await createCardImage(randomIdCard, fieldSide)

    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = ""
  state.actions.button.style.display = "none"

  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"
  state.cardSprites.avatar.classList.remove("card-image")

  await hidenCardsDetails()

  initialize()
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.volume = 0.3
   try {
    audio.play()
  }
   catch {}
}

function initialize() {
  shorHiddenCardsdFieldsImages(false)

  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"

  drawCards(5, state.playerSides.player1)    
  drawCards(5, state.playerSides.computer)    

  const bgm = document.getElementById("bgm")
  bgm.play()
  bgm.volume = .2
}

initialize()

