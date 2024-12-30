import { WebSocket }from "ws";
import { INT_GAME, MOVE } from "./messages";
import { Game } from "./Game";
// User, game class

export class GameManager {
    private games : Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];


    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        // stop the game here because user already left
    }

    //When the player wants to make a move
    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if(message.type === INT_GAME) {
                if(this.pendingUser) {
                    // start a game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE) {
                console.log("inside move"); // #1
                const game = this.games.find (game => game.player1 === socket || game.player2 === socket);
                if(game) {
                    console.log("inside makeMove");    // #2
                    game.makeMove(socket, message.move);
                }
            }
        }) 
    }
}