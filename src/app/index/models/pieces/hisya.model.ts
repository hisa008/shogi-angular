import {BasePieceClass} from './basePiece.model'

export class Hisya extends BasePieceClass {
  moveDirection = [[-1, 0],[0, 1],[1, 0],[0, -1]]
  
  public printPiece () {
    if (this.promotion)
      return '龍'
    else
      return '飛'
  }

  public canMoveToWithoutObstical () {
    if (this.promotion) {
      return [[-1, 1],[1, 1], [1, -1], [-1, -1]]
    } else {
      return []
    }
  }
}