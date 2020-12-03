import {BasePieceClass} from './basePiece.model'

export class Keima extends BasePieceClass {
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