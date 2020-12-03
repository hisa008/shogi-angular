import {Player} from './player.model'
import {Board} from './board.model'

export class Game {
  board: Board
  winner: null | 'Player1' | 'Player2' = null
  gameChecker: number | undefined

  isGameOver = false
  isPlayer1Turn = true
  // turnCount = 1
  isInitialized = false

  constructor () {
    this.board = new Board(this)     
  }

  public initGame () {
    const player1 = new Player(true)
    const player2 = new Player(false)

    this.board.player1 = player1
    this.board.player2 = player2

    this.board.initBoard()
    this.isInitialized = true
  }

  // public gameInPlay(): boolean {
  //   return !this.isGameOver
  // }
}