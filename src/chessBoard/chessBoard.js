import React, { Component } from 'react';
import './chessBoard.css';

const whiteKing = "&#9812"
const whiteRook = "&#9814;"
const whiteKnight = "&#9816;"
const whiteQueen = "&#9813;"
const whiteBishop = "&#9815;"
const whitePawn = "&#9817;"
const blackKing = "&#9818;"
const blackRook = "&#9820;"
const blackKnight = "&#9822;"
const blackQueen = "&#9819;"
const blackBishop = "&#9821;"
const blackPawn = "&#9823;"

const startingPosition = {
  a1:"wr", b1:"wk", c1:"wb", d1:"wq", e1:"wK", f1:"wb", g1:"wk", h1:"wr",
  a2:"wp", b2:"wp", c2:"wp", d2:"wp", e2:"wp", f2:"wp", g2:"wp", h2:"wp",
  a3:"", b3:"", c3:"", d3:"", e3:"", f3:"", g3:"", h3:"",
  a4:"", b4:"", c4:"", d4:"", e4:"", f4:"", g4:"", h4:"",
  a5:"", b5:"", c5:"", d5:"", e5:"", f5:"", g5:"", h5:"",
  a6:"", b6:"", c6:"", d6:"", e6:"", f6:"", g6:"", h6:"",
  a7:"bp", b7:"bp", c7:"bp", d7:"bp", e7:"bp", f7:"bp", g7:"bp", h7:"bp",
  a8:"br", b8:"bk", c8:"bb", d8:"bq", e8:"bK", f8:"bb", g8:"bk", h8:"br",
}

export default class ChessBoard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      whiteToPlay: true,
      whiteInCheck: false,
      blackInCheck: false,
      whiteCheckmate: false,
      blackCheckmate: false,
      a1RookMoved: false,
      h1RookMoved: false,
      a8RookMoved: false,
      h8RookMoved: false,
      blackKindMoved: false,
      whiteKingMoved: false,

      boardPosition: startingPosition,

    }
    this.handleClick = this.handleClick.bind(this);
  }

  setupChessBoard = () =>{
    alert("setting up the chessboard")
    //first row white
    this._board.querySelector("#a1").innerHTML = whiteRook
    this._board.querySelector("#b1").innerHTML = whiteKnight
    this._board.querySelector("#c1").innerHTML = whiteBishop
    this._board.querySelector("#d1").innerHTML = whiteQueen
    this._board.querySelector("#e1").innerHTML = whiteKing
    this._board.querySelector("#f1").innerHTML = whiteBishop
    this._board.querySelector("#g1").innerHTML = whiteKnight
    this._board.querySelector("#h1").innerHTML = whiteRook
    //second row white
    this._board.querySelector("#a2").innerHTML = whitePawn
    this._board.querySelector("#b2").innerHTML = whitePawn
    this._board.querySelector("#c2").innerHTML = whitePawn
    this._board.querySelector("#d2").innerHTML = whitePawn
    this._board.querySelector("#e2").innerHTML = whitePawn
    this._board.querySelector("#f2").innerHTML = whitePawn
    this._board.querySelector("#g2").innerHTML = whitePawn
    this._board.querySelector("#h2").innerHTML = whitePawn
    //first row black
    this._board.querySelector("#a8").innerHTML = blackRook
    this._board.querySelector("#b8").innerHTML = blackKnight
    this._board.querySelector("#c8").innerHTML = blackBishop
    this._board.querySelector("#d8").innerHTML = blackQueen
    this._board.querySelector("#e8").innerHTML = blackKing
    this._board.querySelector("#f8").innerHTML = blackBishop
    this._board.querySelector("#g8").innerHTML = blackKnight
    this._board.querySelector("#h8").innerHTML = blackRook
    //second row black
    this._board.querySelector("#a7").innerHTML = blackPawn
    this._board.querySelector("#b7").innerHTML = blackPawn
    this._board.querySelector("#c7").innerHTML = blackPawn
    this._board.querySelector("#d7").innerHTML = blackPawn
    this._board.querySelector("#e7").innerHTML = blackPawn
    this._board.querySelector("#f7").innerHTML = blackPawn
    this._board.querySelector("#g7").innerHTML = blackPawn
    this._board.querySelector("#h7").innerHTML = blackPawn
  }

  //returns an object with this format {x, y} based on the square name 
  convertChessNotation = (square) => {
    let coordinate = {}
    let y = Number(square[1]) - 1 //chess notation starts at 1, but it's easier to work with a grid when it starts at 0
    let x = square[0]
    switch(x){
      case "a":
        x = 0
      break;
      case "b":
        x = 1
      break;
      case "c":
        x = 2
      break;
      case "d":
        x = 3
      break;
      case "e":
        x = 4
      break;
      case "f":
        x = 5
      break;
      case "g":
        x = 6
      break;
      case "h":
        x = 7
      break;
    }
    coordinate.x = x
    coordinate.y = y
    return coordinate
  }
  
  

  removePiece = (square) => {
    this._board.querySelector("#"+square).innerHTML = ""
  }
  changePiece = (square, newPiece) => {
    this._board.querySelector("#"+square).innerHTML = newPiece
  }

  movePiece = (start, end) => {
    let piece = this._board.querySelector("#"+start).innerHTML
    this.removePiece(start)
    this.changePiece(end, piece)
  }
 
  handleClick = (event) => {
      alert(event.target.id);
      this.movePiece("e1", "e8")
      alert('lul');
      this.movePiece("e8", "e4")
      alert(this.convertChessNotation("a1").x.toString() + this.convertChessNotation("a1").y.toString())
  }

  componentDidMount(){
    this.setupChessBoard()
  }

  render() {

    let self = this

    return(
      <>
        <div ref={
          function(el){
            self._board = el
          }
        }     
        class="board">
          <div class="row">
              <div onClick={this.handleClick} id="a8" class="box"></div>
              <div onClick={this.handleClick} id="b8" class="box black"></div>
              <div onClick={this.handleClick} id="c8" class="box"></div>
              <div onClick={this.handleClick} id="d8" class="box black"></div>
              <div onClick={this.handleClick} id="e8" class="box"></div>
              <div onClick={this.handleClick} id="f8" class="box black"></div>
              <div onClick={this.handleClick} id="g8" class="box"></div>
              <div onClick={this.handleClick} id="h8" class="box black"></div>
          </div>
          <div class="row">
              <div id="a7" class="box black"></div>
              <div id="b7" class="box"></div>
              <div id="c7" class="box black"></div>
              <div id="d7" class="box"></div>
              <div id="e7" class="box black"></div>
              <div id="f7" class="box"></div>
              <div id="g7" class="box black"></div>
              <div id="h7" class="box"></div>
          </div>
          <div class="row">
              <div id="a6" class="box"></div>
              <div id="b6" class="box black"></div>
              <div id="c6" class="box"></div>
              <div id="d6" class="box black"></div>
              <div id="e6" class="box"></div>
              <div id="f6" class="box black"></div>
              <div id="g6" class="box"></div>
              <div id="h6" class="box black"></div>
          </div>
          <div class="row">
              <div id="a5" class="box black"></div>
              <div id="b5" class="box"></div>
              <div id="c5" class="box black"></div>
              <div id="d5" class="box"></div>
              <div id="e5" class="box black"></div>
              <div id="f5" class="box"></div>
              <div id="g5" class="box black"></div>
              <div id="h5" class="box"></div>
          </div>
          <div class="row">
              <div id="a4" class="box"></div>
              <div id="b4" class="box black"></div>
              <div id="c4" class="box"></div>
              <div id="d4" class="box black"></div>
              <div id="e4" class="box"></div>
              <div id="f4" class="box black"></div>
              <div id="g4" class="box"></div>
              <div id="h4" class="box black"></div>
          </div>
          <div class="row">
              <div id="a3" class="box black"></div>
              <div id="b3" class="box"></div>
              <div id="c3" class="box black"></div>
              <div id="d3" class="box"></div>
              <div id="e3" class="box black"></div>
              <div id="f3" class="box"></div>
              <div id="g3" class="box black"></div>
              <div id="h3" class="box"></div>
          </div>
          <div class="row">
              <div id="a2" class="box"></div>
              <div id="b2" class="box black"></div>
              <div id="c2" class="box"></div>
              <div id="d2" class="box black"></div>
              <div id="e2" class="box"></div>
              <div id="f2" class="box black"></div>
              <div id="g2" class="box"></div>
              <div id="h2" class="box black"></div>
          </div>
          <div class="row">
              <div id="a1" class="box black"></div>
              <div id="b1" class="box"></div>
              <div id="c1" class="box black"></div>
              <div id="d1" class="box"></div>
              <div id="e1" class="box black"></div>
              <div id="f1" class="box"></div>
              <div id="g1" class="box black"></div>
              <div id="h1" class="box"></div>
          </div>
        </div>
      </>
    )
  }
}