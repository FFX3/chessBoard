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
  a4:"", b4:"", c4:"", d4:"", e4:"", f4:"", g4:"", h4:"",
  a5:"", b5:"", c5:"", d5:"", e5:"", f5:"", g5:"", h5:"",
  a6:"", b6:"", c6:"", d6:"", e6:"", f6:"", g6:"", h6:"",
  a7:blackPawn, b7:blackPawn, c7:blackPawn, d7:blackPawn, e7:blackPawn, f7:blackPawn, g7:blackPawn, h7:blackPawn,
  a8:blackRook, b8:blackKnight, c8:blackBishop, d8:blackQueen, e8:blackKing, f8:blackBishop, g8:blackKnight, h8:blackRook,
}
const testPosition = {
  a1:whiteKing,
  b3:blackQueen
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
      selectedPiece: '',
      legalMovesOfSelectedPiece: [],

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

  //this function creates a clone of a board object
  cloneBoardObject = (boardObject) => {
    let clone = {}
    
    for(let key in boardObject){
      clone[key] = boardObject[key]
    }
    return clone
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
    let boardPosition = boardObject
    boardPosition[square] = ''
    return boardObject
  }

  changePieceFromBoardObject = (square, piece, boardObject) => {
    let boardPosition = boardObject
    boardPosition[square] = piece
    return boardObject
  }

  movePieceOnBoardObject = (start, end, boardObject) => {
    let boardPosition = boardObject
    let piece = boardPosition[start]
    boardObject = this.removePieceFromBoardObject(start, boardPosition)
    boardObject = this.changePieceFromBoardObject(end, piece, boardPosition)
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
    let piece = this.state.boardPosition[start]
    this.movePieceVisually(start, end)
    let newBoardObject = this.movePieceOnBoardObject(start, end, this.state.boardPosition)
    newBoardObject.lastMove = {piece:piece, start:start, end:end,}
    this.setState({
      boardPosition: newBoardObject,
      legalMovesOfSelectedPiece: [],
      selectedPiece: '',
      selectedSquare: ''
    })
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
    if(boardObject.lastMove){
      if((boardObject.lastMove.piece === whitePawn || boardObject.lastMove.piece === blackPawn)){
        let lastMoveCoordinate = this.convertChessNotation(boardObject.lastMove.end)
        let leftOfLastMoveCoordinate = {x:lastMoveCoordinate.x-1, y:lastMoveCoordinate.y}
        let rightOfLastMoveCoordinate = {x:lastMoveCoordinate.x+1, y:lastMoveCoordinate.y}

        let leftOfLastMoveSquare = this.convertCoordinate(leftOfLastMoveCoordinate)
        let rightOfLastMoveSquare = this.convertCoordinate(rightOfLastMoveCoordinate)

        let behindLastMoveCoordinate = {x:lastMoveCoordinate.x, y:lastMoveCoordinate.y+direction}
        let behindLastMoveSquare = this.convertCoordinate(behindLastMoveCoordinate)
        //we are white
        if(direction === 1){
          if((boardObject.lastMove.start[1] === '7' && boardObject.lastMove.end[1] === '5') && (square === leftOfLastMoveSquare || square === rightOfLastMoveSquare)){
            legalMoves.push(`enpassant ${behindLastMoveSquare} x${boardObject.lastMove.end}`)
          }
        //we are black
        }else{
          if((boardObject.lastMove.start[1] === '2' && boardObject.lastMove.end[1] === '4') && (square === leftOfLastMoveSquare || square === rightOfLastMoveSquare)){
            legalMoves.push(`enpassant ${behindLastMoveSquare} x${boardObject.lastMove.end}`)
          }
        }
      }
    }
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
    let movements = [{x:1,y:2},{x:2,y:1},{x:2,y:-1},{x:1,y:-2},{x:-1,y:-2},{x:-2,y:-1},{x:-2,y:1},{x:-1,y:2}]

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

  findKingMoves = (square, isWhite, boardObject, lookForCastleMoves) =>{
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

    //castling
    if(lookForCastleMoves){
      if(isWhite){
        if(!this.state.whiteKingMoved && !this.isSquareInCheck('e1', true, boardObject)){
          if(!this.state.a1RookMoved && !this.isSquareInCheck('d1', true, boardObject) && !this.isSquareInCheck('c1', true, boardObject) && this.isSquareEmpty('b1', boardObject) && this.isSquareEmpty('c1', boardObject) && this.isSquareEmpty('d1', boardObject)){
            legalMoves.push('0-0-0')
          }
          if(!this.state.h1RookMoved && !this.isSquareInCheck('f1', true, boardObject) && !this.isSquareInCheck('g1', true, boardObject) && this.isSquareEmpty('f1', boardObject) && this.isSquareEmpty('g1', boardObject)){
            legalMoves.push('0-0')
          }
        }
      }else{
        if(!this.state.blackKingMoved && !this.isSquareInCheck('e8', false, boardObject)){
          if(!this.state.a8RookMoved && !this.isSquareInCheck('d8', false, boardObject) && !this.isSquareInCheck('c8', false, boardObject) && this.isSquareEmpty('b8', boardObject) && this.isSquareEmpty('c8', boardObject) && this.isSquareEmpty('d8', boardObject)){
            legalMoves.push('0-0-0')
          }
          if(!this.state.h8RookMoved && !this.isSquareInCheck('f8', false, boardObject) && !this.isSquareInCheck('g8', false, boardObject) && this.isSquareEmpty('f8', boardObject) && this.isSquareEmpty('g8', boardObject)){
            legalMoves.push('0-0')
          }
        }
      }
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
    squareQueue = this.findKingMoves(square, isWhite, boardObject, false)
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

  findLegalMovesOfSelectedPiece = (square, boardObject) =>{
    let piece = boardObject[square]

    switch (piece) {
      case whitePawn:
        return this.findPawnMoves(square, true, boardObject)
      case blackPawn:
        return this.findPawnMoves(square, false, boardObject)
      case whiteKnight:
        return this.findKnightMoves(square, true, boardObject)
      case blackKnight:
        return this.findKnightMoves(square, false, boardObject)
      case whiteBishop:
        return this.findBishopMoves(square, true, boardObject)
      case blackBishop:
        return this.findBishopMoves(square, false, boardObject)
      case whiteRook:
        return this.findRookMoves(square, true, boardObject)
      case blackRook:
        return this.findRookMoves(square, false, boardObject)
      case whiteQueen:
        return this.findQueenMoves(square, true, boardObject)
      case blackQueen:
        return this.findQueenMoves(square, false, boardObject)
      case whiteKing:
        return this.findKingMoves(square, true, boardObject, true)
      case blackKing:
        return this.findKingMoves(square, false, boardObject, true)
      default:
        console.log('invalid chess piece')
        break;
    }
  }

  //checks if the board position is legal, meaning is the king in check
  canKingBeCaputured = (isWhite, boardObject) =>{
    let squareList = Object.entries(boardObject)

    for(let i=0; i<squareList.length; i++){
      if(isWhite){
        if(squareList[i][1] === blackKing){
          return this.isSquareInCheck(squareList[i][0], !isWhite, boardObject)
        }
      }else{
        if(squareList[i][1] === whiteKing){
          return this.isSquareInCheck(squareList[i][0], !isWhite, boardObject)
        }
      }
    }
  }

  //returns 'stalemate', 'checkmate', and false otherwise
  findCheckmatesAndStalemates = (whiteToPlay, boardObject) =>{
    const inCheck = this.canKingBeCaputured(!whiteToPlay, boardObject)
    const squareList = Object.entries(boardObject)
    const boardPosition = this.cloneBoardObject(boardObject)
    let doesSquareContainCorrectPiece
    
    if(whiteToPlay){
      doesSquareContainCorrectPiece = this.doesSquareContainWhitePiece
    }else{
      doesSquareContainCorrectPiece = this.doesSquareContainBlackPiece
    }

    for(let i=0; i<squareList.length; i++){
      let piece = squareList[i][1]
      let square = squareList[i][0]

      if(doesSquareContainCorrectPiece(square, boardPosition)){
        let legalMoves = this.findLegalMovesOfSelectedPiece(square, boardPosition)
        for(let c=0; c<legalMoves.length; c++){
          let pieceOnTargetSquare = boardPosition[legalMoves[c]]
          this.movePieceOnBoardObject(square, legalMoves[c], boardPosition)
          if(!(this.canKingBeCaputured(!whiteToPlay, boardPosition))){
            return false
          }
          this.movePieceOnBoardObject(legalMoves[c], square, boardPosition)
          boardPosition[legalMoves[c]] = pieceOnTargetSquare
        }
      }
    }
    if(inCheck){
      return 'checkmate'
    }else{
      return 'stalemate'
    }
  }
 
  handleClick = (event) => {
    let findIndexEnpassant = this.state.legalMovesOfSelectedPiece.findIndex((moveString) => {
      if(moveString.slice(0, 9) === 'enpassant'){
        return true
      }
      return false
    })
      //white's turn
      if(this.state.whiteToPlay){
        //clicked on our own piece
        if(this.doesSquareContainWhitePiece(event.target.id, this.state.boardPosition)){
          let selectedPiece = this.state.boardPosition[event.target.id]
          let legalMoves = this.findLegalMovesOfSelectedPiece(event.target.id, this.state.boardPosition)

          this.setState({
            selectedSquare: event.target.id,
            selectedPiece: selectedPiece,
            legalMovesOfSelectedPiece: legalMoves,
          })
        
          //is this square I just clicked on a legal move for the last piece I clicked on
        }else if(this.state.legalMovesOfSelectedPiece.includes(event.target.id)){
          //cloneBoard to check for checkmates
          let boardClone = this.cloneBoardObject(this.state.boardPosition)
          //make move on imaginary board
          this.movePieceOnBoardObject(this.state.selectedSquare, event.target.id, boardClone)

          //check if this move leaves the whiteKing in check
          if(!this.canKingBeCaputured(false, boardClone)){
            //the move is leagal so move the piece
            this.movePiece(this.state.selectedSquare, event.target.id)
            this.setState({whiteToPlay:false,})

            //update rookedMoved and kingMoved variables
            if(this.state.selectedPiece === whiteKing){
              this.setState({whiteKingMoved: true,})
            }else if(this.state.selectedPiece === whiteRook){
              if(!this.state.a1RookMoved && this.state.selectedSquare === 'a1'){
                this.setState({a1RookMoved: true,})
              }else if(!this.state.h1RookMoved && this.state.selectedSquare === 'h1'){
                this.setState({h1RookMoved: true,})
              }
            }

            //check for checkmates and stalemates
            if(this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'checkmate'){
              alert("White wins by checkmate")
            }else if (this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'stalemate'){
              alert("Stalemate")
            }
          }
        }else if(this.state.legalMovesOfSelectedPiece.includes("0-0") && event.target.id === 'g1'){
          this.movePiece('h1', 'f1')
          this.movePiece('e1', 'g1')
          this.setState({
            whiteToPlay:false,
            whiteKingMoved:true,
            h1RookMoved:true,
          })
          //check for checkmates and stalemates
          if(this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'checkmate'){
            alert("White wins by checkmate")
          }else if (this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'stalemate'){
            alert("Stalemate")
          }
        }else if(this.state.legalMovesOfSelectedPiece.includes("0-0-0") && event.target.id === 'c1'){
          this.movePiece('a1', 'd1')
          this.movePiece('e1', 'c1')
          this.setState({
            whiteToPlay:false,
            whiteKingMoved:true,
            a1RookMoved:true,
          })
          //check for checkmates and stalemates
          if(this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'checkmate'){
            alert("White wins by checkmate")
          }else if (this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'stalemate'){
            alert("Stalemate")
          }
          //check if an Enpassant move was found
        }else if(findIndexEnpassant !== -1 && event.target.id === this.state.legalMovesOfSelectedPiece[findIndexEnpassant].slice(10, 12)){
          // make enpassant move 
          //cloneBoard to check for checkmates
          let boardClone = this.cloneBoardObject(this.state.boardPosition)
          //make move on imaginary board
          this.movePieceOnBoardObject(this.state.selectedSquare, event.target.id, boardClone)
          this.removePieceFromBoardObject(this.state.legalMovesOfSelectedPiece[findIndexEnpassant].slice(14), boardClone)

          //check if this move leaves the whiteKing in check
          if(!this.canKingBeCaputured(false, boardClone)){
            //the move is leagal so move the piece
            this.movePiece(this.state.selectedSquare, event.target.id)
            this.removePiece(this.state.legalMovesOfSelectedPiece[findIndexEnpassant].slice(14))
            this.setState({whiteToPlay:false,})


            //check for checkmates and stalemates
            if(this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'checkmate'){
              alert("White wins by checkmate")
            }else if (this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'stalemate'){
              alert("Stalemate")
            }
          }
        }else{
          this.setState({selectedSquare: ''})
        }
      }else{
        //clicked on our own piece
        if(this.doesSquareContainBlackPiece(event.target.id, this.state.boardPosition)){
          let selectedPiece = this.state.boardPosition[event.target.id]
          let legalMoves = this.findLegalMovesOfSelectedPiece(event.target.id, this.state.boardPosition)

          this.setState({
            selectedSquare: event.target.id,
            selectedPiece: selectedPiece,
            legalMovesOfSelectedPiece: legalMoves,
          })
        
          //is this square I just clicked on a legal move for the last piece I clicked on
        }else if(this.state.legalMovesOfSelectedPiece.includes(event.target.id)){
          //cloneBoard to check for checkmates
          let boardClone = this.cloneBoardObject(this.state.boardPosition)
          //make move on imaginary board
          this.movePieceOnBoardObject(this.state.selectedSquare, event.target.id, boardClone)

          //check if this move leaves the blackKing in check
          if(!this.canKingBeCaputured(true, boardClone)){
            //the move is leagal so move the piece
            this.movePiece(this.state.selectedSquare, event.target.id)
            this.setState({whiteToPlay:true,})

            //update rookedMoved and kingMoved variables
            if(this.state.selectedPiece === blackKing){
              this.setState({blackKingMoved: true,})
            }else if(this.state.selectedPiece === whiteRook){
              if(!this.state.a8RookMoved && this.state.selectedSquare === 'a8'){
                this.setState({a8RookMoved: true,})
              }else if(!this.state.h8RookMoved && this.state.selectedSquare === 'h8'){
                this.setState({h8RookMoved: true,})
              }
            }
            //check for checkmates and stalemates
            if(this.findCheckmatesAndStalemates(true, this.state.boardPosition) === 'checkmate'){
              alert("Black wins by checkmate")
            }else if (this.findCheckmatesAndStalemates(true, this.state.boardPosition) === 'stalemate'){
              alert("Stalemate")
            }
          }
        }else if(this.state.legalMovesOfSelectedPiece.includes("0-0") && event.target.id === 'g8'){
          this.movePiece('h8', 'f8')
          this.movePiece('e8', 'g8')
          this.setState({
            whiteToPlay:true,
            blackKingMoved:true,
            h8RookMoved:true,
          })
          //check for checkmates and stalemates
          if(this.findCheckmatesAndStalemates(true, this.state.boardPosition) === 'checkmate'){
            alert("Black wins by checkmate")
          }else if (this.findCheckmatesAndStalemates(true, this.state.boardPosition) === 'stalemate'){
            alert("Stalemate")
          }
        }else if(this.state.legalMovesOfSelectedPiece.includes("0-0-0") && event.target.id === 'c8'){
          this.movePiece('a8', 'd8')
          this.movePiece('e8', 'c8')
          this.setState({
            whiteToPlay:true,
            blackKingMoved:true,
            a8RookMoved:true,
          })
          //check for checkmates and stalemates
          if(this.findCheckmatesAndStalemates(true, this.state.boardPosition) === 'checkmate'){
            alert("Black wins by checkmate")
          }else if (this.findCheckmatesAndStalemates(true, this.state.boardPosition) === 'stalemate'){
            alert("Stalemate")
          }
        }else if(findIndexEnpassant !== -1 && event.target.id === this.state.legalMovesOfSelectedPiece[findIndexEnpassant].slice(10, 12)){
          // make enpassant move 
          //cloneBoard to check for checkmates
          let boardClone = this.cloneBoardObject(this.state.boardPosition)
          //make move on imaginary board
          this.movePieceOnBoardObject(this.state.selectedSquare, event.target.id, boardClone)
          this.removePieceFromBoardObject(this.state.legalMovesOfSelectedPiece[findIndexEnpassant].slice(14), boardClone)

          //check if this move leaves the whiteKing in check
          if(!this.canKingBeCaputured(false, boardClone)){
            //the move is leagal so move the piece
            this.movePiece(this.state.selectedSquare, event.target.id)
            this.removePiece(this.state.legalMovesOfSelectedPiece[findIndexEnpassant].slice(14))
            this.setState({whiteToPlay:true,})


            //check for checkmates and stalemates
            if(this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'checkmate'){
              alert("White wins by checkmate")
            }else if (this.findCheckmatesAndStalemates(false, this.state.boardPosition) === 'stalemate'){
              alert("Stalemate")
            }
          }
        }else{
          this.setState({selectedSquare: ''})
        }
      }
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
    this.setupChessBoard(this.state.boardPosition)
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