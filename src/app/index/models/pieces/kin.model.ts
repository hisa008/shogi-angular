import {BasePieceClass} from './basePiece.model'

export class Kin extends BasePieceClass {
  public printPiece () {
    return '金'
  }

  public canMoveToWithoutObstical () {
    return [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [1, 0], [0, 1]
    ]
  }
}