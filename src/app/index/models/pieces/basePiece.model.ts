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

  /**
   * 呼び出したplayerの相手playerを返す
   */
  private opponentPlayer (): Player {
    if (this.player === this.board.player1) return this.board.player1
    return this.board.player2 as Player
  }
  /**
   * 勝者がいるかを確認する ->> いた場合勝者のplayerを返す
   */
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
  /**
   * 駒台のポジションを計算する
   */
  private calculationPosition(positionX: number, player: boolean): number[] {
    let inActivePosition: number[]
    if (player)inActivePosition = [6.1 + .9 * Math.floor(positionX / 7), 10 + .3 * (positionX % 7)]
    else inActivePosition = [1.9 - .9 * Math.floor(positionX / 7), 10 + .3 * (positionX % 7)]
    return inActivePosition
  }
  /**
   * 駒台のpositionを決め
   */
  private inActivePositions(): number[] {
    const player = this.player.isFirstMove
    let positionX = player ? this.board.inActivePieces1.length : this.board.inActivePieces2.length
    let inActivePosition = this.calculationPosition(positionX, player)
    return inActivePosition
  }
  /**
   * 持ち駒を動かした際、駒台のpieceのpositionを再配置
   */
  private inActivePieceMovedPlayer(inActivePieceLength: number): void {
    const player = this.player.isFirstMove
    let positionX = inActivePieceLength
    this.currentPosition = this.calculationPosition(positionX, player)
  }
  /**
   * 移動エリアに相手のコマがいた場合の処理
   */
  private killEnemyPiece(nextY: number, nextX: number): void {
    const targetPiece = this.board.positions[nextY][nextX] as BasePieceClass
    targetPiece.player = this.opponentPlayer()
    targetPiece.active = false
    targetPiece.currentPosition = this.inActivePositions()
    if (targetPiece.promotion) targetPiece.promotion = false
    if (this.player.isFirstMove) this.board.inActivePieces1.push(targetPiece)
    else　this.board.inActivePieces2.push(targetPiece)
  }
  /**
   * 指定したエリアが移動可能かどうか
   */
  private canMoveSquare(nextY: number, nextX: number): boolean {
    const piece = this.board.positions[nextY][nextX]
    if (piece && piece.player.isFirstMove === this.player.isFirstMove) return false
    return true
  }
  /**
   * 成るかならないかの確認　->> yesなら成る
   */
  private chooseWhetherPromote(): void {
    if (window.confirm('成りますか？')) this.promotion = true
  }
  /**
   * 自陣から相手陣内に入ったかの確認（入っていれば成ることができる）
   */
  private canPromote(): boolean {
    if (this.player.isFirstMove && this.currentPosition[0] < 3) return true
    else if (!this.player.isFirstMove && this.currentPosition[0] > 5) return true
    return false
  }
  /**
   * 指定の駒が成れるかどうか全パターンでcheck
   */
  public canPromoteTo(currentY: number): boolean {
    if (this.player.isFirstMove && !this.promotion && currentY < 3) return true
    else if ((!this.player.isFirstMove) && !this.promotion && currentY > 5) return true
    else if (this.active && !this.promotion && this.canPromote()) return true
    return false
  }
  /**
   * 駒が成るかどうかの一連の流れを実装 
   */
  public promoteSequence(currentY: number): void {
    if (this.canPromoteTo(currentY)) this.chooseWhetherPromote()
  }
  /**
   * 引数の座標（指定エリア）がボード上にあるか判別する
   */
  public isOnBoard(nextY: number, nextX: number): boolean {
    if (nextY > 8 || nextY < 0) return false
    if (nextX > 8 || nextX < 0) return false
    return true
  }
  /**
   * 駒のcurrentPositionからボード上のX座標を計算する
   */
  public currentX(): number {
    if (this.currentPosition) 
      return 15 + 71 * (this.currentPosition[1])
    return 0
  }
  /**
   * 駒のcurrentPositionからボード上のY座標を計算する
   */
  public currentY(): number {
    if (this.currentPosition) 
      return 12 + 72 * (this.currentPosition[0])
    return 0
  }
  /**
   * 移動可能エリアのY座標を計算する
   */
  public chooseY(index: number): number {
    return 71 * this.canMoveAllPosition[index][0]
  }
  /**
   * 移動可能エリアのX座標を計算する
   */
  public chooseX(index: number): number {
    return 71 * this.canMoveAllPosition[index][1]
  }
  /**
   * (piece)がselectedPieceと同じかを確認する
   */
  public checkSelectPiece(piece: BasePieceClass): boolean {
    if (piece.currentPosition === this.board.selectedPiece?.currentPosition) return true
    return false
  }
  /**
   * 持ち駒の移動可能エリアを確認する
   */
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
  /**
   * 駒の移動後の処理を行う
   */
  public afterMoving(): void {
    this.board.selectedPiece = null
    this.board.game.isPlayer1Turn = !this.board.game.isPlayer1Turn
    if (!this.active) this.inActiveMove() 
    this.board.game.whichTurn = this.board.game.isPlayer1Turn ? 'Player1' : 'Player2'
  }
  /**
   * 駒が移動する場合の処理を行う
   */
  public moveTo(position: number[]): void {
    const currentY = this.currentPosition[0]
    const currentX = this.currentPosition[1]
    if (this.currentPosition && this.active) this.board.positions[currentY][currentX] = null  // set null to my current location (元々いた場所をnullにする)
      
    const nextY = position[0]
    const nextX = position[1]
    if (this.board.positions[nextY][nextX]) this.killEnemyPiece(nextY, nextX)
    this.board.positions[nextY][nextX] = this   // set new location of the board and the piece (新しく配置したpositionにpieceの情報を与える)
    this.currentPosition = position

    this.checkWinner() // game over?
    this.promoteSequence(currentY) // can promote?
    this.afterMoving()
  }
  /**
   * 選択されたpieceの移動可能なエリアの座標を確認する
   */
  public movableTo(currentPosition: number[]): void {   // can I move to the new position? (指定のpositionに移動できるか？)
    this.canMoveAllPosition = []
    this.board.selectedPiece = this
    this.checkMovableArea(currentPosition)
    if(this.active === false) this.inActiveMovableTo()
  }
  /**
   * 選択された持ち駒の移動可能なエリアの座標を確認する
   */
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
  /**
   * 選択されたpieceの移動可能エリアの座標を確認する
   */
  public checkMovableArea(currentPosition: number[]): void {
    const currentY = currentPosition[0]
    const currentX = currentPosition[1]

    let position = this.canMoveToWithoutObstical()     
    for (let i = 0;  i < position.length; i++) {
      let canMoveOnBoard: number[]
      if (this.player.isFirstMove) canMoveOnBoard = [currentY + position[i][0], position[i][1] + currentX]
      else canMoveOnBoard = [currentY - position[i][0], position[i][1] + currentX]
      if ((this.isOnBoard(canMoveOnBoard[0], canMoveOnBoard[1])) && (this.canMoveSquare(canMoveOnBoard[0], canMoveOnBoard[1])))
        this.canMoveAllPosition.push(canMoveOnBoard)
    }
  }
  /**
   * 大駒が成っている場合、nextAreasが移動可能かを確認する  //飛車、角、香車
   */
  public isPromotionMoveCheck(nextAreas: number[][], currentArea: number[]): void {
    nextAreas.forEach(nextArea => {
      let nextPosition = [nextArea[0] + currentArea[0], nextArea[1] + currentArea[1]]
      if ((this.isOnBoard(nextPosition[0], nextPosition[1])) && (this.canMoveSquare(nextPosition[0], nextPosition[1])))
        this.canMoveAllPosition.push(nextPosition)
    })
  }

  public bigPieceMove(currentPosition: number[], directions: number[][]): void {}
  public printPiece (): string { return '' }
  public canMoveToWithoutObstical (): number[][] { return [] }
}
  //            ----- memo -----

  // public pre(currentPosition: number[]): void {
  //   const currentY = currentPosition[0]
  //   const currentX = currentPosition[1]

  //   let position = this.canMoveToWithoutObstical()     
  //   for (let i = 0;  i < position.length; i++) {
  //     let canMoveOnBoard: number[]
  //     if (this.player.isFirstMove) canMoveOnBoard = [currentY + position[i][0], position[i][1] + currentX]
  //     else canMoveOnBoard = [currentY - position[i][0], position[i][1] + currentX]
  //     if ((this.isOnBoard(canMoveOnBoard[0], canMoveOnBoard[1])) && (this.canMoveSquare(canMoveOnBoard[0], canMoveOnBoard[1])))
  //       this.canMoveAllPosition.push(canMoveOnBoard)
  //   }
  // }

  // public post(currentPosition: number[]): void {　スーパークラス
  //   this.pre(currentPosition)
  // }

  // public post(currentPosition: number[]): void {  サブクラス
  //   this.pre(currentPosition)
  //   // do something
  // }

