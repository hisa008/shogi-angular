import {BasePieceClass} from './basePiece.model'

export class Kyosya extends BasePieceClass {
  public printPiece () {
    if (this.promotion)
      return '杏'
    else
      return '香'
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
}