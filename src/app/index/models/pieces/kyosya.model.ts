import {BasePieceClass} from './basePiece.model'

export class Kyosya extends BasePieceClass {
  public printPiece () {
    if (this.promotion)
      return '杏'
    else
      return '香'
  }

  public canPromoteSelect(currentY: number): void {
    if (this.active && this.canPromote())
      this.promotion = true
  }

  public canPromote(): boolean {
    if (this.promotion) return false
    if (this.player === this.board.player1 && this.currentPosition[0] === 0)
      return true
    else if (this.player === this.board.player1 && this.currentPosition[0] < 3)
      if (window.confirm('成りますか？')) return true
    if (this.player === this.board.player2 && this.currentPosition[0] === 8)
      return true
    else if (this.player === this.board.player2 && this.currentPosition[0] > 5)
      if (window.confirm('成りますか？')) return true
    return false
  }

  public checkForbiddenArea(row: number) :boolean {
    let forbiddenArea = this.player.isFirstMove ? 0 : 8
    if (row === forbiddenArea) return false
    return true
  }

  public canMoveToWithoutObstical () {
    if (this.promotion) {
      return [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [1, 0], [0, 1]
      ]
    } else {
      return [
        [-1, 0], [-2, 0], [-3, 0],
        [-4, 0], [-5, 0], [-6, 0],
        [-7, 0], [-8, 0]
      ]
    }
  }
  public movableTo(currentPosition: number[]): void {
    this.canMoveAllPosition = []
    this.board.selectedPiece = this
    if (this.promotion === false) this.isMoveBetween(currentPosition, this.player.isFirstMove ? [[-1, 0]] : [[1, 0]])
    else this.isOtherPiece(currentPosition)
    if(this.active === false) this.inActiveMovableTo()
  }
}