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
}