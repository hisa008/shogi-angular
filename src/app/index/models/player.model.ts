import {Board} from './board.model'
import {Game} from './game.model'

export class Player {
  public isFirstMove: boolean

  constructor (isFirstMove: boolean) {
    this.isFirstMove = isFirstMove
  }
}
