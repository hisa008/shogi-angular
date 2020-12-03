import {Hu} from './pieces/hu.model'
import {BasePieceClass} from './pieces/basePiece.model'
import {Hisya} from './pieces/hisya.model'
import {Kaku} from './pieces/kaku.model'
import {Kin} from './pieces/kin.model'
import {Gin} from './pieces/gin.model'
import {Keima} from './pieces/keima.model'
import {Kyosya} from './pieces/kyosya.model'
import {Ou} from './pieces/ou.model'
import {Player} from './player.model'
import {Game} from './game.model'

export class Board { 
  public positions: (null | BasePieceClass)[][]
  public pieces: BasePieceClass[]
  public baseBoardPosition: number[][]
  public player1: Player | undefined
  public player2: Player | undefined
  public game: Game
  public selectedPiece: null | BasePieceClass

  constructor (game: Game) {
    this.game = game
    this.positions = [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],      
      [null, null, null, null, null, null, null, null, null],
    ]
    
    this.pieces = []
    this.baseBoardPosition = [
      [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
      [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
      [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
      [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8],
      [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8],
      [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8],
      [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8],
      [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8],
      [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8]
    ]
    this.selectedPiece = null
  }

  public initBoard () {
    this.player1 = this.player1 as Player
    this.player2 = this.player2 as Player

    // player_1 ----------------------------
    this.pieces.push(new Kyosya(this.player1, [8, 0], this))
    this.pieces.push(new Keima(this.player1, [8, 1], this))
    this.pieces.push(new Gin(this.player1, [8, 2], this))
    this.pieces.push(new Kin(this.player1, [8, 3], this))
    this.pieces.push(new Ou(this.player1, [8, 4], this))
    this.pieces.push(new Kin(this.player1, [8, 5], this))
    this.pieces.push(new Gin(this.player1, [8, 6], this))
    this.pieces.push(new Keima(this.player1, [8, 7], this))
    this.pieces.push(new Kyosya(this.player1, [8, 8], this))
    this.pieces.push(new Kaku(this.player1, [7, 1], this))
    this.pieces.push(new Hisya(this.player1, [7, 7], this))
    for (let i = 0; i < 9; i++) {
      this.pieces.push(new Hu(this.player1, [6, i], this))      
    }
    // player_2 ----------------------------
    for (let i = 0; i < 9; i++) {
      this.pieces.push(new Hu(this.player2, [2, i], this))      
    }
    this.pieces.push(new Hisya(this.player2, [1, 1], this))
    this.pieces.push(new Kaku(this.player2, [1, 7], this))
    this.pieces.push(new Kyosya(this.player2, [0, 0], this))
    this.pieces.push(new Keima(this.player2, [0, 1], this))
    this.pieces.push(new Gin(this.player2, [0, 2], this))
    this.pieces.push(new Kin(this.player2, [0, 3], this))
    this.pieces.push(new Ou(this.player2, [0, 4], this))
    this.pieces.push(new Kin(this.player2, [0, 5], this))
    this.pieces.push(new Gin(this.player2, [0, 6], this))
    this.pieces.push(new Keima(this.player2, [0, 7], this))
    this.pieces.push(new Kyosya(this.player2, [0, 8], this))
  }

  public print () {
    console.log('-------------------------------------------------------')     
    this.positions.forEach(row => {
      const pieceFaces = row.map(position => {
        if (position === null) {
          return '   '
        } else {
          return `${position.printPiece()}${position.player.isFirstMove ? '↑' : '↓'}`
        }
      })
            
      console.log(`| ${pieceFaces.join(' | ')} |`)
      console.log('-------------------------------------------------------')
    })
  }
}


/**
 * TODO: 
 * - BasePieceのCurrent Positionを正しく実装してください。
 * /- それぞれのコマのcanMoveToWithoutObsticalを実装してください
 * - BasePieceにcanMoveToを実装してください (以下を考慮する必要があります)
 *   - 自分の現在の位置
 *   - 自分がPlayer1 か Player2か
 *   - 将棋盤の端
 *   - 自分の他のコマ
 *   - 敵のコマ
 * - Gameに isGameOver()を実装して、試合が終わったかどうかを判断するメソッドを実装する
 * - index.tsに while loopを実装して、ゲームが終わるまでユーザーインプットを求め続けるようにする
 */



 /**
  * QUESTION
  * - game.model.ts(8) 型宣言？ boardはBoardクラスという型という宣言という認識で合っているか？
  * -export class クラス名 extends 継承するクラス implements BasePiece
  */