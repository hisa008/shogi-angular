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

  private canPromote(): boolean {
    if (this.promotion) return false
    if (this.player === this.board.player1 && this.currentPosition[0] < 3) {
      if (window.confirm('成りますか？')) return true
    }
    else if (this.player === this.board.player2 && this.currentPosition[0] > 5) {
      if (window.confirm('成りますか？')) return true
    }
    return false
  }

  private canPromoteBefore(): void {
    if (window.confirm('成りますか？')) this.promotion = true
  }

  private checkWinner (): Player | null {
    if (this.board.player1 === undefined) return null
    if (this.board.player2 === undefined) return null

    let king1 = this.board.pieces[4]
    let king2 = this.board.pieces[35]
    if (king2.active === false) return this.board.player1
    if (king1.active === false) return this.board.player2
    return null
  }

  private isOnBoard(nextY: number, nextX: number): boolean {
    if (nextY > 8 || nextY < 0) return false
    if (nextX > 8 || nextX < 0) return false
    return true
  }

  private inActivePositionPlayer1(): number[] {
    let positionX = this.board.inActivePlayer1.length
    let inActivePosition = [6.1, 10 + .3 * (positionX % 7)]
    if (positionX > 13) inActivePosition[0] += 1.8 //inActive1 piece > 12piece
    else if (positionX > 6) inActivePosition[0] += 0.9 //inActive1 piece > 5piece
    return inActivePosition
  }
  private inActivePositionPlayer2(): number[] {
    let positionX = this.board.inActivePlayer2.length
    let inActivePosition = [1.9, 10 + .3 * (positionX % 7)]
    if (positionX > 13) inActivePosition[0] -= 1.8 //inActive2 piece > 12piece
    else if (positionX > 6) inActivePosition[0] -= 0.9 //inActive2 piece > 5piece
    return inActivePosition
  }

  private enemyPieceKilled(nextY: number, nextX: number): void {
    const targetPiece = this.board.positions[nextY][nextX] as BasePieceClass
    targetPiece.player = this.opponentPlayer()
    targetPiece.active = false
    targetPiece.currentPosition = this.player.isFirstMove ? this.inActivePositionPlayer1() : this.inActivePositionPlayer2()
    if (targetPiece.promotion) targetPiece.promotion = false
    if (this.player.isFirstMove) this.board.inActivePlayer1.push(targetPiece)
    else　this.board.inActivePlayer2.push(targetPiece)
  }

  private canPromoteSelect(currentY: number): void {
    if (this.player.isFirstMove && !this.promotion && currentY < 3)
      this.canPromoteBefore()
    else if (!this.player.isFirstMove && !this.promotion && currentY > 5)
      this.canPromoteBefore()
    else if (this.active && this.canPromote())
      this.promotion = true
  }

  public currentX(): number {
    if (this.currentPosition) 
      return 15 + 71 * (this.currentPosition[1])
    else 
      return 0
  }

  public currentY(): number {
    if (this.currentPosition) 
      return 12 + 72 * (this.currentPosition[0])
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

  public checkSelectPiece(piece: BasePieceClass): boolean {
    if (piece.currentPosition === this.board.selectedPiece?.currentPosition) return true
    return false
  }

  public inActivePieceMovedPlayer1(inActivePieceLength: number): void {
    let positionX = inActivePieceLength % 7
    let inActivePosition1 = [6.1, 10 + .3 * positionX]
    if (inActivePieceLength > 13) inActivePosition1[0] += 1.8 //inActive1 piece > 12piece
    else if (inActivePieceLength > 6) inActivePosition1[0] += 0.9 //inActive1 piece > 5piece
    this.currentPosition = inActivePosition1
  }
  public inActivePieceMovedPlayer2(inActivePieceLength: number): void {
    let positionX = inActivePieceLength % 7
    let inActivePosition2 = [1.9, 10 + .3 * positionX]
    if (inActivePieceLength > 13) inActivePosition2[0] -= 1.8 //inActive2 piece > 12piece
    else if (inActivePieceLength > 6) inActivePosition2[0] -= 0.9 //inActive2 piece > 5piece
    this.currentPosition = inActivePosition2
  }

  public inActiveMove(): void{
    this.active = true
    if (this.player.isFirstMove) {
      let inActivePieces = this.board.inActivePlayer1
      for (let index = 0; index < inActivePieces.length; index++) {
        if (inActivePieces[index] == this) {
          inActivePieces.splice(index, 1);
          break;
        }
      }
      for (let i = 0; i < inActivePieces.length; i++) {
        inActivePieces[i].inActivePieceMovedPlayer1(i)
      }
    } else {
      let inActivePieces = this.board.inActivePlayer2
      for (let index = 0; index < inActivePieces.length; index++) {
        if (inActivePieces[index] == this) {
          inActivePieces.splice(index, 1);
          break;
        }
      }
      for (let index = 0; index < inActivePieces.length; index++) {
        inActivePieces[index].inActivePieceMovedPlayer2(index)
      }
    }
  }

  public afterMoving(): void {
    this.board.selectedPiece = null
    this.board.game.isPlayer1Turn = !this.board.game.isPlayer1Turn
    if (!this.active) this.inActiveMove()
    if (this.board.game.isPlayer1Turn) this.board.game.whichTurn = 'Player1'
    else this.board.game.whichTurn = 'Player2' 
  }

  public moveTo(position: number[]): void {
    const currentY = this.currentPosition[0]
    const currentX = this.currentPosition[1]
    if (this.currentPosition && this.active) { // set null to my current location (元々いた場所をnullにする)
      this.board.positions[currentY][currentX] = null
    } 
    const nextY = position[0]
    const nextX = position[1]

    if (this.board.positions[nextY][nextX]) this.enemyPieceKilled(nextY, nextX)

    this.board.positions[nextY][nextX] = this   // set new location of the board and the piece (新しく配置したpositionにpieceの情報を与える)
    this.currentPosition = position
    
    const winner = this.checkWinner() // game over?
    if (winner) {
      this.board.game.isGameOver = true
      this.board.game.winner = winner.isFirstMove ? 'Player1' : 'Player2'
    }

    this.canPromoteSelect(currentY)
    this.afterMoving()
  }

  public movableTo(currentPosition: number[]): void {   // can I move to the new position? (指定のpositionに移動できるか？)
    this.canMoveAllPosition = []
    this.board.selectedPiece = this
    if (this.moveDirection) this.isMoveBetween(currentPosition, this.moveDirection)
    else this.isOtherPiece(currentPosition)
    if(this.active === false) this.inActiveMovableTo()
  }

  public inActiveMovableTo(): void {
    let exitOwnPawnColumn: number[] = []
    if (this.constructor.name === "Hu")
      exitOwnPawnColumn = this.checkPawnColumn() // 自身の歩が存在する場合、そのx座標を格納  
    let rowNumber = 0
    for (let row of this.board.positions) {
      let columnNumber = 0
      for (let column of row) {
        if (this.checkForbiddenArea(rowNumber) && column === null && !exitOwnPawnColumn.includes(columnNumber))
          this.canMoveAllPosition.push([rowNumber, columnNumber])
        columnNumber++
      }
      rowNumber++
    }
  }

  public checkForbiddenArea(row: number) :boolean {
    return true
  }

  public checkPawnColumn(): number[]{  //自身の歩が存在する場合、そのx座標をownPawnColumnに格納
    let ownPawnColumn: number[] = []
    this.board.positions.forEach(row => {
      row.forEach(column => {
        if (column?.player.isFirstMove === this.player.isFirstMove && column.constructor.name === "Hu") {
          ownPawnColumn.push(column.currentPosition[1])
        }
      })
    })
    return ownPawnColumn
  }

  public isOtherPiece(currentPosition: number[]): void {
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

  public isPromotionMoveCheck(nextAreas: number[][], currentArea: number[]): void {
    nextAreas.forEach(nextArea => {
      let nextPosition = [nextArea[0] + currentArea[0], nextArea[1] + currentArea[1]]
      if ((this.isOnBoard(nextPosition[0], nextPosition[1]))
        && (this.isMoveSquare(nextPosition[0], nextPosition[1])))
        this.canMoveAllPosition.push(nextPosition)
    })
  }
  
  public isMoveSquare(nextY: number, nextX: number): boolean {
  const piece = this.board.positions[nextY][nextX]
    if (piece && piece.player.isFirstMove === this.player.isFirstMove) return false
    return true
  }

  public isMoveBetween(currentPosition: number[], directions: number[][]): void {
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
    if (this.promotion) this.isPromotionMoveCheck(this.canMoveToWithoutObstical(), currentPosition)
  }

  public printPiece (): string {
    return ''
  }

  public canMoveToWithoutObstical (): number[][] { return [] }
}
