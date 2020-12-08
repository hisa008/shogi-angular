import {BasePieceClass} from './basePiece.model'

export class Keima extends BasePieceClass {
  public printPiece () {
    if (this.promotion)
      return '圭'
    else
      return '桂'
  }

  public inActiveMovableTo(): void {
    let rowNumber = 0
    for (let row of this.board.positions) {
      let columnNumber = 0
      for (let column of row) {
        if (this.checkForbiddenArea(rowNumber) && column === null)
          this.canMoveAllPosition.push([rowNumber, columnNumber])
        columnNumber++
      }
      rowNumber++
    }
  }

  public checkForbiddenArea(row: number) :boolean {
    let forbiddenArea = this.player.isFirstMove ? 0 : 8
    let exceptionArea: number | undefined = undefined
    if (this.constructor.name === "Keima")
      exceptionArea = this.player.isFirstMove ? 1 : 7
    if (row === forbiddenArea) return false
    if (row === exceptionArea) return false
    return true
  }

  public canMoveToWithoutObstical () {
    if (this.promotion)
      return [[-1, -1], [-1, 0], [-1, 1],[0, -1], [1, 0], [0, 1]]
    else
      return [[-2, 1], [-2, -1]]
  }

  public canPromoteTo(): boolean {
    if (!this.active) return false
    if (this.player.isFirstMove && this.currentPosition[0] < 2) this.promotion = true
    else if (this.player.isFirstMove && this.currentPosition[0] === 2) return true
    if (!this.player.isFirstMove && this.currentPosition[0] > 6) this.promotion = true
    else if (!this.player.isFirstMove && this.currentPosition[0] === 6) return true
    return false
  }
}