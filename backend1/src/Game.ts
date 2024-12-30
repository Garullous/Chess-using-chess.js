import {WebSocket} from "ws";
import { Chess } from 'chess.js';
import { GAME_OVER, MOVE, INT_GAME } from "./messages";

export class Game  {

    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        
        this.player1.send(JSON.stringify({
            type: INT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INT_GAME,
            payload: {
                color: "black"
            }
        }))
    }


    makeMove(socket: WebSocket, move: {
        from: string;
        to  : string;
    }) {
        // validate the type of move using zod
        console.log(this.board.moves().length);
        console.log(this.board.moves());
        if(this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("early return 1");
            return;
        }
        if(this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("early return 2");
            return;
        }
        console.log("did not early return");                    //#2


        try {
            this.board.move(move);                              //#1
        } catch(e) {
            console.log(e);        
            return;    
        }
        console.log("move successful!");                        //#3
        

        if(this.board.isGameOver()) { 

            // Send the game over message to both players
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w"? "black" : "white"
                }
            }))
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w"? "black" : "white"
                }
            }))
            return;
        }

        console.log(this.board.moves().length % 2);               //********************* */  
        if(this.board.moves().length % 2 === 0) {
            console.log("sent1");                               //#4
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            // Send the updated board to both players
            console.log("sent2");                             //#5
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move                
            }))
        }    
        this.moveCount++;
    }
}
  
