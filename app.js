// Variables
let deckId
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const messageEl = document.getElementById("message-el")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")
const resetBtn = document.getElementById("reset")

// Handle Remaining Cards
function handleclick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
      .then(res => res.json())
      .then(data => {
        remainingText.textContent = `Remaining cards: ${data.remaining}`
        deckId = data.deck_id
    })

      // Disable New Deck button when the game is started
      newDeckBtn.disabled = true
}

newDeckBtn.addEventListener("click", handleclick)

//Draw Cards
drawCardBtn.addEventListener("click", ()=> {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      remainingText.textContent = `Remaining cards: ${data.remaining}`
      cardsContainer.children[0].innerHTML = `
        <img src=${data.cards[0].image} class="card" />
      `
      cardsContainer.children[1].innerHTML = `
        <img src=${data.cards[1].image} class="card" />
      `
      const winnerText = determineCardWinner(data.cards[0], data.cards[1])
        messageEl.textContent = winnerText
        
        // Disable Draw button when the game is over
        if (data.remaining === 0) {
          drawCardBtn.disabled = true
        }

        // Disable Reset button until the game is over
        if (data.remaining !== 0) {
          resetBtn.disabled = true
        } else {
          resetBtn.disabled = false
        }

        // Determine the winner
        if(computerScore > myScore && data.remaining === 0) {
          header.textContent = "Computer Wins!"
        } else if(myScore > computerScore && data.remaining === 0) {
          header.textContent = "You win!"
        } else if(myScore === computerScore && data.remaining === 0) {
          header.textContent = "Tie!"
        }
    })
  })

  // Determine the score
  function determineCardWinner(card1, card2) {
      const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
      "10", "JACK", "QUEEN", "KING", "ACE"]
      const card1ValueIndex = valueOptions.indexOf(card1.value)
      const card2ValueIndex = valueOptions.indexOf(card2.value)
      
      if (card1ValueIndex > card2ValueIndex) {
          computerScore++
          computerScoreEl.textContent = `Computer total score: ${computerScore}`
          return "Computer scores!"
      } else if (card1ValueIndex < card2ValueIndex) {
          myScore++
          myScoreEl.textContent = `My total score: ${myScore}`
          return "You score!"
      } else {
          return "Tie!"
      }
  }

// Reset the Game
resetBtn.addEventListener("click", ()=> {
    remainingText.textContent = ""
    cardsContainer.children[0].innerHTML = ""
    cardsContainer.children[1].innerHTML = ""
    computerScoreEl.textContent = ""
    myScoreEl.textContent = ""
    messageEl.textContent = ""
    newDeckBtn.disabled = false
    location.reload()
})