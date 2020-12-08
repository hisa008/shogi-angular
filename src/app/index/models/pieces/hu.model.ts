import {BasePieceClass} from './basePiece.model'

export class Hu extends BasePieceClass {
  public printPiece () {
    if (this.promotion) 
      return 'と'
    else
      return '歩'
  }

  public canPromoteTo(): boolean {
    if (!this.active) return false
    if (this.player.isFirstMove && this.currentPosition[0] === 0) this.promotion = true
    else if (this.player === this.board.player1 && this.currentPosition[0] < 3) return true
    if (this.player === this.board.player2 && this.currentPosition[0] === 8) this.promotion = true
    else if (this.player === this.board.player2 && this.currentPosition[0] > 5) return true
    return false
  }

  public checkForbiddenArea(row: number) :boolean {
    let forbiddenArea = this.player.isFirstMove ? 0 : 8
    if (row === forbiddenArea) return false
    return true
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

  public canMoveToWithoutObstical () {
    if (this.promotion)
      return [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [1, 0], [0, 1]
      ]
    else
      return [[-1, 0]]
  }
}