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

  public movableTo(currentPosition: number[]): void {   // can I move to the new position? (指定のpositionに移動できるか？)
    this.canMoveAllPosition = []
    this.board.selectedPiece = this
    this.bigPieceMove(currentPosition, this.moveDirection)
    if(this.active === false) this.inActiveMovableTo()
  }

  public bigPieceMove(currentPosition: number[], directions: number[][]): void {
    directions.forEach(direction => {
      let checkPosition = [currentPosition[0], currentPosition[1]]
      while (true) {
        checkPosition = [checkPosition[0] + direction[0], checkPosition[1] + direction[1]]
        if(!this.isOnBoard(checkPosition[0], checkPosition[1])) break
        let nextCheckArea = this.board.positions[checkPosition[0]][checkPosition[1]]
        if (nextCheckArea) { // piece exists
          if(nextCheckArea.player.isFirstMove === this.player.isFirstMove) {
            break 
          } else { 
            this.canMoveAllPosition.push(checkPosition)
            break
          }
        } else {  // piece DOES NOT exist
          this.canMoveAllPosition.push(checkPosition)
        }
      }
    })
    if (this.promotion) this.isPromotionMoveCheck(this.canMoveToWithoutObstical(), currentPosition)
  }
}