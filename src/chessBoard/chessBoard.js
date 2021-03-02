import React, { Component } from 'react';
import './chessBoard.css';

const whiteKing = "♔"
const whiteRook = "♖"
const whiteKnight = "♘"
const whiteQueen = "♕"
const whiteBishop = "♗"
const whitePawn = "♙"
const blackKing = "♚"
const blackRook = "♜"
const blackKnight = "♞"
const blackQueen = "♛"
const blackBishop = "♝"
const blackPawn = "♟"

const startingPosition = {
  a1:whiteRook, b1:whiteKnight, c1:whiteBishop, d1:whiteQueen, e1:whiteKing, f1:whiteBishop, g1:whiteKnight, h1:whiteRook,
  a2:whitePawn, b2:whitePawn, c2:whitePawn, d2:whitePawn, e2:whitePawn, f2:whitePawn, g2:whitePawn, h2:whitePawn,
  a3:"", b3:"", c3:"", d3:"", e3:"", f3:"", g3:"", h3:"",
  a4:"", b4:"", c4:blackRook, d4:"", e4:"", f4:"", g4:"", h4:"",
  a5:"", b5:"", c5:"", d5:"", e5:"", f5:"", g5:"", h5:"",
  a6:"", b6:"", c6:"", d6:"", e6:"", f6:"", g6:"", h6:"",
  a7:blackPawn, b7:blackPawn, c7:blackPawn, d7:blackPawn, e7:blackPawn, f7:blackPawn, g7:blackPawn, h7:blackPawn,
  a8:blackRook, b8:blackKnight, c8:blackBishop, d8:blackQueen, e8:blackKing, f8:blackBishop, g8:blackKnight, h8:blackRook,
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
      lastMove: {},
      whiteKingPosition: 'e1',
      blackKingPosition: 'e8',

      selectedSquare: '',
      legalMovesOfSelectedPiece: {}

    }
    this.handleClick = this.handleClick.bind(this);
    this.addSelectedCSSClass = this.addSelectedCSSClass.bind(this);
  }

  setupChessBoard = (position) =>{

    for(const square in position){
      this.changePieceVisually(square, position[square])     
    }
  }

  //returns an object with this format {x, y} based on the square name 
  convertChessNotation = (square) => {
    let coordinate = {}
    let y = Number(square[1]) - 1 //chess notation starts at 1, but it's easier to work with a grid when it starts at 0
    if(!(y >= 0 && y < 8)){
      return null
    }
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
      default:
        return null
    }
    coordinate.x = x
    coordinate.y = y
    return coordinate
  }

  convertCoordinate = (coordinate) =>{
    if(!(coordinate.y >= 0 && coordinate.y < 8 && coordinate.x >= 0 && coordinate.x < 8)){
      return null
    }
    let square = ""
    switch(coordinate.x){
      case 0:
        square = 'a'
      break;
      case 1:
        square = 'b'
      break;
      case 2:
        square = 'c'
      break;
      case 3:
        square = 'd'
      break;
      case 4:
        square = 'e'
      break;
      case 5:
        square = 'f'
      break;
      case 6:
        square = 'g'
      break;
      case 7:
        square = 'h'
      break;
    }
    square = square + (coordinate.y + 1).toString()
    return square
  }
  
  
  //visual html board manipulation
  //I need identical function that manipulate the boardPosition value in the state
  removePieceVisually = (square) => {
    this._board.querySelector("#"+square).innerHTML = ""
  }
   changePieceVisually = (square, newPiece) => {
    this._board.querySelector("#"+square).innerHTML = newPiece
  }

  movePieceVisually = (start, end) => {
    let piece = this._board.querySelector("#"+start).innerHTML
    this.removePieceVisually(start)
    this.changePieceVisually(end, piece)
  }
  
  //boardObject Manipulation this function will be useful for doing calulation without actually changing the boardPosition in this.state
  removePieceFromBoardObject = (square, boardObject) => {
    boardObject[square] = ''
    return boardObject
  }

  changePieceFromBoardObject = (square, piece, boardObject) => {
    boardObject[square] = piece
    return boardObject
  }

  movePieceOnBoardObject = (start, end, boardObject) => {
    let piece = boardObject[start]
    boardObject = this.removePieceFromBoardObject(start, boardObject)
    boardObject = this.changePieceFromBoardObject(end, piece, boardObject)
    return boardObject
  }


  //boardPosition state manipulation & visual board syncro
  removePiece = (square) =>{
    this.removePieceVisually(square)
    this.setState({boardPosition: this.removePieceFromBoardObject(square, this.state.boardPosition)})
  }
  changePiece = (square, piece) =>{
    this.changePieceVisually(square, piece)
    this.setState({boardPosition: this.changePieceFromBoardObject(square, piece, this.state.boardPosition)})
  }
  movePiece = (start, end) =>{
    this.movePieceVisually(start, end)
    this.setState({boardPosition: this.movePieceOnBoardObject(start, end, this.state.boardPosition)})
  }

  //chess logic
  isSquareEmpty = (square, boardObject) =>{
    if(boardObject[square] === ""){
      return true
    }else{
      return false
    }
  }
  doesSquareContainWhitePiece = (square, boardObject) =>{
    if(boardObject[square] === whiteKing ||
    boardObject[square] === whiteQueen ||
    boardObject[square] === whitePawn ||
    boardObject[square] === whiteRook ||
    boardObject[square] === whiteKnight ||
    boardObject[square] === whiteBishop){
      return true
    }else{
      return false
    }
  }
  doesSquareContainBlackPiece = (square, boardObject) =>{
    if(boardObject[square] === blackKing ||
    boardObject[square] === blackQueen ||
    boardObject[square] === blackPawn ||
    boardObject[square] === blackRook ||
    boardObject[square] === blackKnight ||
    boardObject[square] === blackBishop){
      return true
    }else{
      return false
    }
  }

  //these function find all the legal moves a piece could make without accounting for checks
  findPawnMoves = (square, isWhite, boardObject) => {
    let coordinate = this.convertChessNotation(square)
    let legalMoves = []
    let tempCoordinate = {}
    let tempSquare = ''
    //we multiply movements with this value to reverse movements when playing with the black pawn
    let direction
    if(isWhite){
      direction = 1
    }else{
      direction = -1
    }

    //move forward 1 step
    if(this.isSquareEmpty(this.convertCoordinate({x:coordinate.x, y:(coordinate.y + (1 * direction))}), boardObject)){
      legalMoves.push(this.convertCoordinate({x:coordinate.x, y:(coordinate.y + (1 * direction))}))
      //2 steps forward
      if(this.isSquareEmpty(this.convertCoordinate({x:coordinate.x, y:(coordinate.y + (2 * direction))}), boardObject) && (( isWhite && coordinate.y === 1)||( !isWhite && coordinate.y === 6))){
        legalMoves.push(this.convertCoordinate({x:coordinate.x, y:(coordinate.y + (2 * direction))}))
      }
    }

    //diagonal capture
    //a-side
    tempCoordinate = {x: coordinate.x - 1, y:coordinate.y + (1 * direction)}
    tempSquare = this.convertCoordinate(tempCoordinate)
    if(tempSquare !== null){
      if(isWhite && this.doesSquareContainBlackPiece(tempSquare, boardObject)||!isWhite && this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        legalMoves.push(tempSquare)
      }
    }
    //h-side
    tempCoordinate = {x: coordinate.x + 1, y:coordinate.y + (1 * direction)}
    tempSquare = this.convertCoordinate(tempCoordinate)
    if(tempSquare !== null){
      if(isWhite && this.doesSquareContainBlackPiece(tempSquare, boardObject)||!isWhite && this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        legalMoves.push(tempSquare)
      }
    }
    //enpasant

    return legalMoves
  }

  findRookMoves = (square, isWhite, boardObject) => {
    let coordinate = this.convertChessNotation(square)
    let legalMoves = []
    let tempCoordinate = coordinate
    let tempSquare = ''

    //right
    while(true){
      tempCoordinate = {x: tempCoordinate.x+1, y:tempCoordinate.y}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    //left
    tempCoordinate = coordinate
    while(true){
      tempCoordinate = {x: tempCoordinate.x-1, y:tempCoordinate.y}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    //up
    tempCoordinate = coordinate
    while(true){
      tempCoordinate = {x: tempCoordinate.x, y:tempCoordinate.y+1}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    //down
    tempCoordinate = coordinate
    while(true){
      tempCoordinate = {x: tempCoordinate.x, y:tempCoordinate.y-1}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    
    return legalMoves
  }

  findBishopMoves = (square, isWhite, boardObject) => {
    let coordinate = this.convertChessNotation(square)
    let legalMoves = []
    let tempCoordinate = coordinate
    let tempSquare = ''

    //right-down
    while(true){
      tempCoordinate = {x: tempCoordinate.x+1, y:tempCoordinate.y-1}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    //right-up
    tempCoordinate = coordinate
    while(true){
      tempCoordinate = {x: tempCoordinate.x+1, y:tempCoordinate.y+1}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    //left-down
    tempCoordinate = coordinate
    while(true){
      tempCoordinate = {x: tempCoordinate.x-1, y:tempCoordinate.y-1}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    //left-up
    tempCoordinate = coordinate
    while(true){
      tempCoordinate = {x: tempCoordinate.x-1, y:tempCoordinate.y+1}
      tempSquare = this.convertCoordinate(tempCoordinate)
      

      if(tempSquare === null){
        break
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          break
        }else{
          legalMoves.push(tempSquare)
          break
        }
      }
      legalMoves.push(tempSquare)
    }
    
    return legalMoves
  }

  findQueenMoves = (square, isWhite, boardObject) =>{
    let legalMoves = this.findRookMoves(square, isWhite, boardObject).concat(this.findBishopMoves(square, isWhite, boardObject))
    return legalMoves
  }

  findKnightMoves = (square, isWhite, boardObject) =>{
    const coordinate = this.convertChessNotation(square)
    let tempSquare = ''
    let tempCoordinate = {}
    let legalMoves = []
    let movements = [{x:1,y:2},{x:2,y:1},{x:2,y:-1},{x:1,y:-2},{x:-1,y:-2},{x:-2,y:-1},{x:-2,y:1},{x:-2,y:2}]

    for(let i = 0; i<movements.length; i++) {
      let movement = movements[i]
      tempCoordinate = {x:coordinate.x+movement.x, y:coordinate.y+movement.y}
      tempSquare = this.convertCoordinate(tempCoordinate)

      if(tempSquare === null){
        continue
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          continue
        }else{
          legalMoves.push(tempSquare)
          continue
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          continue
        }else{
          legalMoves.push(tempSquare)
          continue
        }
      }
      legalMoves.push(tempSquare)
    }

    return legalMoves
  }

  findKingMoves = (square, isWhite, boardObject) =>{
    const coordinate = this.convertChessNotation(square)
    let tempSquare = ''
    let tempCoordinate = {}
    let legalMoves = []
    let movements = [{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1}]

    for(let i = 0; i<movements.length; i++) {
      let movement = movements[i]
      tempCoordinate = {x:coordinate.x+movement.x, y:coordinate.y+movement.y}
      tempSquare = this.convertCoordinate(tempCoordinate)

      if(tempSquare === null){
        continue
      }
      if(this.doesSquareContainWhitePiece(tempSquare, boardObject)){
        if(isWhite){
          continue
        }else{
          legalMoves.push(tempSquare)
          continue
        }
      }else if(this.doesSquareContainBlackPiece(tempSquare, boardObject)){
        if(!isWhite){
          continue
        }else{
          legalMoves.push(tempSquare)
          continue
        }
      }
      legalMoves.push(tempSquare)
    }

    return legalMoves
  }

  isSquareInCheck = (square, isWhite, boardObject) => {
    //making constants of opposing pieces based on king color
    let queen
    let rook
    let pawn
    let bishop
    let knight
    let king

    if(isWhite){
      queen = blackQueen
      rook = blackRook
      pawn = blackPawn
      bishop = blackBishop
      knight = blackKnight
      king = blackKing
    }else{
      queen = whiteQueen
      rook = whiteRook
      pawn = whitePawn
      bishop = whiteBishop
      knight = whiteKnight
      king = whiteKing
    }

    let squareQueue
    let inCheck = false

    //looking for rook and lateral queen checks
    squareQueue = this.findRookMoves(square, isWhite, boardObject)
    for(let i=0; i<squareQueue.length; i++){
      if(boardObject[squareQueue[i]] === queen || boardObject[squareQueue[i]] === rook){
        return true
      }
    }

    //looking for bishop and diagonal queen checks
    squareQueue = this.findBishopMoves(square, isWhite, boardObject)
    for(let i=0; i<squareQueue.length; i++){
      if(boardObject[squareQueue[i]] === queen || boardObject[squareQueue[i]] === bishop){
        return true
      }
    }

    //looking for knight checks
    squareQueue = this.findKnightMoves(square, isWhite, boardObject)
    for(let i=0; i<squareQueue.length; i++){
      if(boardObject[squareQueue[i]] === knight){
        return true
      }
    }

    //looking for king checks
    squareQueue = this.findKingMoves(square, isWhite, boardObject)
    for(let i=0; i<squareQueue.length; i++){
      if(boardObject[squareQueue[i]] === king){
        return true
      }
    }

    //looking for pawn checks
    squareQueue = this.findPawnMoves(square, isWhite, boardObject)
    for(let i=0; i<squareQueue.length; i++){
      if(boardObject[squareQueue[i]] === pawn){
        return true
      }
    }
    return false
  }
 
  handleClick = (event) => {
      /*if(this.state.whiteToPlay){
        if(this.doesSquareContainWhitePiece(event.target.id, this.state.boardPosition)){
          this.setState({selectedSquare: event.target.id})
          console.log(this.findKnightMoves(event.target.id, true, this.state.boardPosition))
        }else{
          this.setState({selectedSquare: ''})
        }
      }else{
        if(this.doesSquareContainBlackPiece(event.target.id, this.state.boardPosition)){
          this.setState({selectedSquare: ''})
          console.log(this.findKnightMoves(event.target.id, false, this.state.boardPosition))
        }
      } */
      console.log(this.isSquareInCheck(event.target.id, true, this.state.boardPosition))
  }

  //this function is called on render for each square after "class="
  addSelectedCSSClass = (square) =>{
    if(square === this.state.selectedSquare){
      return ' selected'
    }else{
      return ''
    }
  }

  componentDidMount(){
    this.setupChessBoard(startingPosition)
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
              <div onClick={this.handleClick} id="a8" class={"box"+this.addSelectedCSSClass("a8")}></div>
              <div onClick={this.handleClick} id="b8" class={"box black"+this.addSelectedCSSClass("b8")}></div>
              <div onClick={this.handleClick} id="c8" class={"box"+this.addSelectedCSSClass("c8")}></div>
              <div onClick={this.handleClick} id="d8" class={"box black"+this.addSelectedCSSClass("d8")}></div>
              <div onClick={this.handleClick} id="e8" class={"box"+this.addSelectedCSSClass("e8")}></div>
              <div onClick={this.handleClick} id="f8" class={"box black"+this.addSelectedCSSClass("f8")}></div>
              <div onClick={this.handleClick} id="g8" class={"box"+this.addSelectedCSSClass("g8")}></div>
              <div onClick={this.handleClick} id="h8" class={"box black"+this.addSelectedCSSClass("h8")}></div>
          </div>
          <div class="row">
              <div onClick={this.handleClick} id="a7" class={"box black"+this.addSelectedCSSClass("a7")}></div>
              <div onClick={this.handleClick} id="b7" class={"box"+this.addSelectedCSSClass("b7")}></div>
              <div onClick={this.handleClick} id="c7" class={"box black"+this.addSelectedCSSClass("c7")}></div>
              <div onClick={this.handleClick} id="d7" class={"box"+this.addSelectedCSSClass("d7")}></div>
              <div onClick={this.handleClick} id="e7" class={"box black"+this.addSelectedCSSClass("e7")}></div>
              <div onClick={this.handleClick} id="f7" class={"box"+this.addSelectedCSSClass("f7")}></div>
              <div onClick={this.handleClick} id="g7" class={"box black"+this.addSelectedCSSClass("g7")}></div>
              <div onClick={this.handleClick} id="h7" class={"box"+this.addSelectedCSSClass("h7")}></div>
          </div>
          <div class="row">
              <div onClick={this.handleClick} id="a6" class={"box"+this.addSelectedCSSClass("a6")}></div>
              <div onClick={this.handleClick} id="b6" class={"box black"+this.addSelectedCSSClass("b6")}></div>
              <div onClick={this.handleClick} id="c6" class={"box"+this.addSelectedCSSClass("c6")}></div>
              <div onClick={this.handleClick} id="d6" class={"box black"+this.addSelectedCSSClass("d6")}></div>
              <div onClick={this.handleClick} id="e6" class={"box"+this.addSelectedCSSClass("e6")}></div>
              <div onClick={this.handleClick} id="f6" class={"box black"+this.addSelectedCSSClass("f6")}></div>
              <div onClick={this.handleClick} id="g6" class={"box"+this.addSelectedCSSClass("g6")}></div>
              <div onClick={this.handleClick} id="h6" class={"box black"+this.addSelectedCSSClass("h6")}></div>
          </div>
          <div class="row">
              <div onClick={this.handleClick} id="a5" class={"box black"+this.addSelectedCSSClass("a5")}></div>
              <div onClick={this.handleClick} id="b5" class={"box"+this.addSelectedCSSClass("b5")}></div>
              <div onClick={this.handleClick} id="c5" class={"box black"+this.addSelectedCSSClass("c5")}></div>
              <div onClick={this.handleClick} id="d5" class={"box"+this.addSelectedCSSClass("d5")}></div>
              <div onClick={this.handleClick} id="e5" class={"box black"+this.addSelectedCSSClass("e5")}></div>
              <div onClick={this.handleClick} id="f5" class={"box"+this.addSelectedCSSClass("f5")}></div>
              <div onClick={this.handleClick} id="g5" class={"box black"+this.addSelectedCSSClass("g5")}></div>
              <div onClick={this.handleClick} id="h5" class={"box"+this.addSelectedCSSClass("h5")}></div>
          </div>
          <div class="row">
              <div onClick={this.handleClick} id="a4" class={"box"+this.addSelectedCSSClass("a4")}></div>
              <div onClick={this.handleClick} id="b4" class={"box black"+this.addSelectedCSSClass("b4")}></div>
              <div onClick={this.handleClick} id="c4" class={"box"+this.addSelectedCSSClass("c4")}></div>
              <div onClick={this.handleClick} id="d4" class={"box black"+this.addSelectedCSSClass("d4")}></div>
              <div onClick={this.handleClick} id="e4" class={"box"+this.addSelectedCSSClass("e4")}></div>
              <div onClick={this.handleClick} id="f4" class={"box black"+this.addSelectedCSSClass("f4")}></div>
              <div onClick={this.handleClick} id="g4" class={"box"+this.addSelectedCSSClass("g4")}></div>
              <div onClick={this.handleClick} id="h4" class={"box black"+this.addSelectedCSSClass("h4")}></div>
          </div>
          <div class="row">
              <div onClick={this.handleClick} id="a3" class={"box black"+this.addSelectedCSSClass("a3")}></div>
              <div onClick={this.handleClick} id="b3" class={"box"+this.addSelectedCSSClass("b3")}></div>
              <div onClick={this.handleClick} id="c3" class={"box black"+this.addSelectedCSSClass("c3")}></div>
              <div onClick={this.handleClick} id="d3" class={"box"+this.addSelectedCSSClass("d3")}></div>
              <div onClick={this.handleClick} id="e3" class={"box black"+this.addSelectedCSSClass("e3")}></div>
              <div onClick={this.handleClick} id="f3" class={"box"+this.addSelectedCSSClass("f3")}></div>
              <div onClick={this.handleClick} id="g3" class={"box black"+this.addSelectedCSSClass("g3")}></div>
              <div onClick={this.handleClick} id="h3" class={"box"+this.addSelectedCSSClass("h3")}></div>
          </div>
          <div class="row">
              <div onClick={this.handleClick} id="a2" class={"box"+this.addSelectedCSSClass("a2")}></div>
              <div onClick={this.handleClick} id="b2" class={"box black"+this.addSelectedCSSClass("b2")}></div>
              <div onClick={this.handleClick} id="c2" class={"box"+this.addSelectedCSSClass("c2")}></div>
              <div onClick={this.handleClick} id="d2" class={"box black"+this.addSelectedCSSClass("d2")}></div>
              <div onClick={this.handleClick} id="e2" class={"box"+this.addSelectedCSSClass("e2")}></div>
              <div onClick={this.handleClick} id="f2" class={"box black"+this.addSelectedCSSClass("f2")}></div>
              <div onClick={this.handleClick} id="g2" class={"box"+this.addSelectedCSSClass("g2")}></div>
              <div onClick={this.handleClick} id="h2" class={"box black"+this.addSelectedCSSClass("h2")}></div>
          </div>
          <div class="row">
              <div onClick={this.handleClick} id="a1" class={"box black"+this.addSelectedCSSClass("a1")}></div>
              <div onClick={this.handleClick} id="b1" class={"box"+this.addSelectedCSSClass("b1")}></div>
              <div onClick={this.handleClick} id="c1" class={"box black"+this.addSelectedCSSClass("c1")}></div>
              <div onClick={this.handleClick} id="d1" class={"box"+this.addSelectedCSSClass("d1")}></div>
              <div onClick={this.handleClick} id="e1" class={"box black"+this.addSelectedCSSClass("e1")}></div>
              <div onClick={this.handleClick} id="f1" class={"box"+this.addSelectedCSSClass("f1")}></div>
              <div onClick={this.handleClick} id="g1" class={"box black"+this.addSelectedCSSClass("g1")}></div>
              <div onClick={this.handleClick} id="h1" class={"box"+this.addSelectedCSSClass("h1")}></div>
          </div>
        </div>
      </>
    )
  }
}