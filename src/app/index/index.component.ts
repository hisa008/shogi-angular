import { Component, OnInit } from '@angular/core';
import { Game } from './models/game.model'
import { BasePieceClass } from '../index/models/pieces/basePiece.model'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  game: Game

  constructor() { 
    this.game = new Game()
    this.game.initGame()
  }
  
  ngOnInit(): void {
  }

  onSelect(selectPiece: BasePieceClass): void {

    if ((selectPiece.currentPosition) && (selectPiece.player.isFirstMove === this.game.isPlayer1Turn)) 
      selectPiece.movableTo(selectPiece.currentPosition)
  }

  offSelect(): void {
    if (this.game.board.selectedPiece !== null) this.game.board.selectedPiece = null 
  }

  chooseSelect(area: number[]): void {
    this.game.board.selectedPiece?.moveTo(area)
  }

  onShadow(selectPiece: BasePieceClass): boolean {
    if (selectPiece.checkSelectPiece(selectPiece)) return true
    return false
  }
}