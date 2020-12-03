import {Player} from '../player.model'
import {Board} from '../board.model'
import { threadId } from 'worker_threads';
// import { TestBed } from '@angular/core/testing';

export class BasePieceClass {
  player: Player;
  currentPosition: number[] | null;
  board: Board
  promotion: boolean
  canMoveAllPosition: number[][]
  
  constructor (player: Player, currentPosition: number[], board: Board) {
    this.player = player
    this.currentPosition = currentPosition
    this.board = board
    this.board.positions[currentPosition[0]][currentPosition[1]] = this
    this.promotion = false
    this.canMoveAllPosition = []
  }

  private opponentPlayer (): Player {
    if (this.player === this.board.player1) return this.board.player1
    return this.board.player2 as Player
  }

  private canPromote (): boolean {
    if (this.currentPosition === null) return false
    if (this.promotion) return false
    if (this.player === this.board.player1) return this.currentPosition[0] < 3
    else return this.currentPosition[0] > 5
  }

  private checkWinner (): Player | null {
    if (this.board.player1 === undefined) return null
    if (this.board.player2 === undefined) return null

    let king1 = this.board.pieces[4].currentPosition
    let king2 = this.board.pieces[35].currentPosition
    if (king2 && king2[0] === 7 && king2[1] === 10.8) return this.board.player1
    if (king1 && king1[0] === 1 && king1[1] === 10.8) return this.board.player2
    return null
  }

  private isOnBoard(nextY: number, nextX: number): boolean {
    if (nextY > 8 || nextY < 0) return false
    if (nextX > 8 || nextX < 0) return false
    return true
  }

  public currentX(): number {
    if (this.currentPosition)
      return 15 + 71 * (this.currentPosition[1])
    else
      return 0
  } 
  public currentY(): number {
    if (this.currentPosition)
      return 15 + 71 * (this.currentPosition[0])
    else
      return 0
  }

  public canMoveArea(position: number[]): number[] {
    return [71 * (position[0]), 71 * (position[1])]
  }

  
  public chooseY(index: number): number {
    return 71 * this.canMoveAllPosition[index][0]
  }

  public chooseX(index: number): number {
    return 71 * this.canMoveAllPosition[index][1]
  }

  moveTo(position: number[]): void {
    if (this.currentPosition) { // set null to my current location (元々いた場所をnullにする)
      const currentY = this.currentPosition[0]
      const currentX = this.currentPosition[1]
      this.board.positions[currentY][currentX] = null   
    } 

    const nextY = position[0]
    const nextX = position[1]

    if (this.board.positions[nextY][nextX]) {   // remove the enemy piece if killed (相手のコマを奪った場合、そのコマをinActiveにする)
      const targetPiece = this.board.positions[nextY][nextX] as BasePieceClass
      targetPiece.player = this.opponentPlayer()
      targetPiece.currentPosition = this.player.isFirstMove ? [7, 10.8] : [1, 10.8]
    }

    this.board.positions[position[0]][position[1]] = this   // set new location of the board and the piece (新しく配置したpositionにpieceの情報を与える)
    this.currentPosition = position

    if(this.canPromote()) this.promotion = true
    
    const winner = this.checkWinner() // game over?
    if (winner) {
      this.board.game.isGameOver = true
      this.board.game.winner = winner.isFirstMove ? 'Player1' : 'Player2'
    }

    this.board.selectedPiece = null
    this.board.game.isPlayer1Turn = !this.board.game.isPlayer1Turn
  }

  movableTo(currentPosition: number[]): void {   // can I move to the new position? (指定のpositionに移動できるか？)
    this.canMoveAllPosition = []
    this.board.selectedPiece = this
    if (this.constructor.name === "Hisya") this.isMoveBetween(currentPosition, [[-1, 0],[0, 1],[1, 0],[0, -1]])
    else if (this.constructor.name === "Kaku") this.isMoveBetween(currentPosition, [[-1, 1],[-1, -1],[1, 1],[1, -1]])
    else if (this.constructor.name === "Kyosya" && this.promotion === false) this.isMoveBetween(currentPosition, this.player.isFirstMove ? [[-1, 0]] : [[1, 0]])
    else this.isOtherPiece(currentPosition)
  }

  isOtherPiece(currentPosition: number[]): void {
    const currentY = currentPosition[0]
    const currentX = currentPosition[1]

    let position = this.canMoveToWithoutObstical()
     
    for (let i = 0;  i < position.length; i++) {
      let canMoveOnBoard: number[]
      if (this.player.isFirstMove)
        canMoveOnBoard = [currentY + position[i][0], position[i][1] + currentX]
      else
        canMoveOnBoard = [currentY - position[i][0], position[i][1] + currentX]
      if ((this.isOnBoard(canMoveOnBoard[0], canMoveOnBoard[1])) && (this.isMoveSquare(canMoveOnBoard[0], canMoveOnBoard[1])))
        this.canMoveAllPosition.push(canMoveOnBoard)
    }
  }

  isPromotionMoveCheck(nextAreas: number[][], currentArea: number[]): void {
    nextAreas.forEach(nextArea => {
      let nextPosition = [nextArea[0] + currentArea[0], nextArea[1] + currentArea[1]]
      if ((this.isOnBoard(nextPosition[0], nextPosition[1]))
        && (this.isMoveSquare(nextPosition[0], nextPosition[1])))
        this.canMoveAllPosition.push(nextPosition)
    })
  }
  
  isMoveSquare(nextY: number, nextX: number): boolean {
  const piece = this.board.positions[nextY][nextX]
    if (piece && piece.player.isFirstMove === this.player.isFirstMove) return false
    return true
  }

  isMoveBetween(currentPosition: number[], directions: number[][]): void {
    directions.forEach(direction => {
      let checkPosition = [currentPosition[0], currentPosition[1]]
      while (true) {
        checkPosition = [checkPosition[0] + direction[0], checkPosition[1] + direction[1]]
        if(!this.isOnBoard(checkPosition[0], checkPosition[1])) break
        let nextCheckArea = this.board.positions[checkPosition[0]][checkPosition[1]]
        if (nextCheckArea) { // piece exists

          if(nextCheckArea.player.isFirstMove === this.player.isFirstMove) {
            break 
          } else { 
            this.canMoveAllPosition.push(checkPosition)
            break
          }
        } else {  // piece DOES NOT exist
          this.canMoveAllPosition.push(checkPosition)
        }
      }
    })
    if (this.promotion && this.constructor.name === "Hisya")
      this.isPromotionMoveCheck([[-1, 1],[-1, -1],[1, 1],[1, -1]], currentPosition)
    if (this.promotion && this.constructor.name === "Kaku")
      this.isPromotionMoveCheck([[-1, 0],[0, 1],[1, 0],[0, -1]], currentPosition)
  }

  printPiece (): string {
    return ''
  }

  canMoveToWithoutObstical (): number[][] { return [] }
}
