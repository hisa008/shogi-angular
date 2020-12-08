import {Player} from '../player.model'
import {Board} from '../board.model'
// import { threadId } from 'worker_threads';
// import { TestBed } from '@angular/core/testing';

export class BasePieceClass {
  player: Player;
  currentPosition: number[];
  board: Board
  promotion: boolean
  canMoveAllPosition: number[][]
  active: boolean
  moveDirection: number[][] | null
  
  constructor (player: Player, currentPosition: number[], board: Board) {
    this.player = player
    this.currentPosition = currentPosition
    this.board = board
    this.board.positions[currentPosition[0]][currentPosition[1]] = this
    this.promotion = false
    this.canMoveAllPosition = []
    this.active = true
    this.moveDirection = null
  }

  private opponentPlayer (): Player {
    if (this.player === this.board.player1) return this.board.player1
    return this.board.player2 as Player
  }

  private movedCanPromote(): void {
    if (window.confirm('成りますか？')) this.promotion = true
  }

  private checkWinner (): void{
    let winner: Player | undefined
    let king1 = this.board.pieces[4]
    let king2 = this.board.pieces[35]

    if (king2.active === false) winner = this.board.player1
    if (king1.active === false) winner = this.board.player2
    if (winner) {
      this.board.game.isGameOver = true
      this.board.game.winner = winner.isFirstMove ? 'Player1' : 'Player2'
    } 
  }

  private inActivePositions(): number[] {
    const player = this.player.isFirstMove
    let positionX = player ? this.board.inActivePieces1.length : this.board.inActivePieces2.length
    let inActivePosition = player ? [6.1, 10 + .3 * (positionX % 7)] : [1.9, 10 + .3 * (positionX % 7)]
    if (positionX > 13) 
      player ? inActivePosition[0] += 1.8 : inActivePosition[0] -= 1.8
    else if (positionX > 6) 
      player ? inActivePosition[0] += 0.9 : inActivePosition[0] -= 0.9
    return inActivePosition
  }

  private inActivePieceMovedPlayer(inActivePieceLength: number): void {
    const player = this.player.isFirstMove
    let positionX = inActivePieceLength % 7
    let inActivePosition = player ? [6.1, 10 + .3 * positionX] : [1.9, 10 + .3 * positionX]
    if (inActivePieceLength > 13)
      player ? inActivePosition[0] += 1.8 : inActivePosition[0] -= 1.8 
    else if (inActivePieceLength > 6)
      player ? inActivePosition[0] += 0.9 : inActivePosition[0] -= 0.9
    this.currentPosition = inActivePosition
  }

  private enemyPieceKilled(nextY: number, nextX: number): void {
    const targetPiece = this.board.positions[nextY][nextX] as BasePieceClass
    targetPiece.player = this.opponentPlayer()
    targetPiece.active = false
    targetPiece.currentPosition = this.inActivePositions()
    if (targetPiece.promotion) targetPiece.promotion = false
    if (this.player.isFirstMove) this.board.inActivePieces1.push(targetPiece)
    else　this.board.inActivePieces2.push(targetPiece)
  }

  private isMoveSquare(nextY: number, nextX: number): boolean {
    const piece = this.board.positions[nextY][nextX]
    if (piece && piece.player.isFirstMove === this.player.isFirstMove) return false
    return true
  }

  public canPromoteSelect(currentY: number): void {
    if (this.player.isFirstMove && !this.promotion && currentY < 3)
      this.movedCanPromote()
    else if ((!this.player.isFirstMove) && !this.promotion && currentY > 5)
      this.movedCanPromote()
    else if (this.active && !this.promotion && this.canPromote())
      this.promotion = true
  }

  public canPromote(): boolean {
    if (this.player.isFirstMove && this.currentPosition[0] < 3) {
      if (window.confirm('成りますか？')) return true
    } else if (!this.player.isFirstMove && this.currentPosition[0] > 5) {
      if (window.confirm('成りますか？')) return true
    }
    return false
  }

  public isOnBoard(nextY: number, nextX: number): boolean {
    if (nextY > 8 || nextY < 0) return false
    if (nextX > 8 || nextX < 0) return false
    return true
  }

  public currentX(): number {
    if (this.currentPosition) 
      return 15 + 71 * (this.currentPosition[1])
    return 0
  }

  public currentY(): number {
    if (this.currentPosition) 
      return 12 + 72 * (this.currentPosition[0])
    return 0
  }

  public chooseY(index: number): number {
    return 71 * this.canMoveAllPosition[index][0]
  }

  public chooseX(index: number): number {
    return 71 * this.canMoveAllPosition[index][1]
  }

  public checkSelectPiece(piece: BasePieceClass): boolean {
    if (piece.currentPosition === this.board.selectedPiece?.currentPosition) return true
    return false
  }

  public inActiveMove(): void{
    this.active = true
    let inActivePieces: BasePieceClass[]
    inActivePieces = this.player.isFirstMove ? this.board.inActivePieces1 : this.board.inActivePieces2
    for (let i = 0; i < inActivePieces.length; i++) {
      if (inActivePieces[i] == this) {
        inActivePieces.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < inActivePieces.length; i++) {
      inActivePieces[i].inActivePieceMovedPlayer(i)
    }
  }

  public afterMoving(): void {
    this.board.selectedPiece = null
    this.board.game.isPlayer1Turn = !this.board.game.isPlayer1Turn
    if (!this.active) this.inActiveMove() 
    this.board.game.whichTurn = this.board.game.isPlayer1Turn ? 'Player1' : 'Player2'
  }

  public moveTo(position: number[]): void {
    const currentY = this.currentPosition[0]
    const currentX = this.currentPosition[1]
    if (this.currentPosition && this.active) this.board.positions[currentY][currentX] = null // set null to my current location (元々いた場所をnullにする)
      
    const nextY = position[0]
    const nextX = position[1]
    if (this.board.positions[nextY][nextX]) this.enemyPieceKilled(nextY, nextX)
    this.board.positions[nextY][nextX] = this   // set new location of the board and the piece (新しく配置したpositionにpieceの情報を与える)
    this.currentPosition = position

    this.checkWinner() // game over?
    this.canPromoteSelect(currentY) // can promote?
    this.afterMoving()
  }

  public movableTo(currentPosition: number[]): void {   // can I move to the new position? (指定のpositionに移動できるか？)
    this.canMoveAllPosition = []
    this.board.selectedPiece = this
    this.smallPieceMove(currentPosition)
    if(this.active === false) this.inActiveMovableTo()
  }

  public inActiveMovableTo(): void {
    let rowNumber = 0
    for (let row of this.board.positions) {
      let columnNumber = 0
      for (let column of row) {
        if (column === null) this.canMoveAllPosition.push([rowNumber, columnNumber])
        columnNumber++
      }
      rowNumber++
    }
  }

  public smallPieceMove(currentPosition: number[]): void {
    const currentY = currentPosition[0]
    const currentX = currentPosition[1]

    let position = this.canMoveToWithoutObstical()     
    for (let i = 0;  i < position.length; i++) {
      let canMoveOnBoard: number[]
      if (this.player.isFirstMove) canMoveOnBoard = [currentY + position[i][0], position[i][1] + currentX]
      else canMoveOnBoard = [currentY - position[i][0], position[i][1] + currentX]
      if ((this.isOnBoard(canMoveOnBoard[0], canMoveOnBoard[1])) && (this.isMoveSquare(canMoveOnBoard[0], canMoveOnBoard[1])))
        this.canMoveAllPosition.push(canMoveOnBoard)
    }
  }

  public isPromotionMoveCheck(nextAreas: number[][], currentArea: number[]): void {
    nextAreas.forEach(nextArea => {
      let nextPosition = [nextArea[0] + currentArea[0], nextArea[1] + currentArea[1]]
      if ((this.isOnBoard(nextPosition[0], nextPosition[1])) && (this.isMoveSquare(nextPosition[0], nextPosition[1])))
        this.canMoveAllPosition.push(nextPosition)
    })
  }

  public bigPieceMove(currentPosition: number[], directions: number[][]): void {}
  public printPiece (): string { return '' }
  public canMoveToWithoutObstical (): number[][] { return [] }
}
