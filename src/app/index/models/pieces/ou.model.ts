import {BasePieceClass} from './basePiece.model'

export class Ou extends BasePieceClass {
  public printPiece () {
    return '王'
  }

  public canMoveToWithoutObstical () {
    return [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]
  }
}