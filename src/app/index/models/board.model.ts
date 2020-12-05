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
  public player1: Player | undefined
  public player2: Player | undefined
  public game: Game
  public selectedPiece: null | BasePieceClass
  public inActivePlayer1: BasePieceClass[]
  public inActivePlayer2: BasePieceClass[]

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
    this.selectedPiece = null
    this.inActivePlayer1 = []
    this.inActivePlayer2 = []
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