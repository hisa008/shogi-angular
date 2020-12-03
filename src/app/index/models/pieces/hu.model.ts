import {BasePieceClass} from './basePiece.model'

export class Hu extends BasePieceClass {
  public printPiece () {
    if (this.promotion) 
      return 'と'
    else
      return '歩'
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