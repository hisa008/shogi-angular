import {BasePieceClass} from './basePiece.model'

export class Keima extends BasePieceClass {
  public checkForbiddenArea(row: number) :boolean {
    let forbiddenArea = this.player.isFirstMove ? 0 : 8
    let exceptionArea: number | undefined = undefined
    if (this.constructor.name === "Keima")
      exceptionArea = this.player.isFirstMove ? 1 : 7
    if (row === forbiddenArea) return false
    if (row === exceptionArea) return false
    return true
  }

  public printPiece () {
    if (this.promotion)
      return '圭'
    else
      return '桂'
  }

  public canMoveToWithoutObstical () {
    if (this.promotion)
      return [[-1, -1], [-1, 0], [-1, 1],[0, -1], [1, 0], [0, 1]]
    else
      return [[-2, 1], [-2, -1]]
  }

  public canPromoteSelect(currentY: number): void {
    if (this.active && this.canPromote())
      this.promotion = true
  }

  public canPromote(): boolean {
    if (this.promotion) return false
    if (this.player === this.board.player1 && this.currentPosition[0] < 2)
      return true
    else if (this.player === this.board.player1 && this.currentPosition[0] === 2)
      if (window.confirm('成りますか？')) return true
    if (this.player === this.board.player2 && this.currentPosition[0] > 6)
      return true
    else if (this.player === this.board.player2 && this.currentPosition[0] === 6)
      if (window.confirm('成りますか？')) return true
    return false
  }
}