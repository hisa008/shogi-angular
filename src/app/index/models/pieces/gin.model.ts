import {BasePieceClass} from './basePiece.model'

export class Gin extends BasePieceClass {
  public printPiece () {
    if (this.promotion) 
      return '全'
    else
      return '銀'
  }

  public canMoveToWithoutObstical () {
    if (this.promotion) {
      return [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [1, 0], [0, 1]
      ]
    } else {
      return [
        [-1, -1], [-1, 0], [-1, 1],
        [1, -1], [1, 1]
      ]
    }
  }
}