import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

//TODO: move together, there's code repetition here
export const INT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    useEffect(() => {
        if(!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INT_GAME:
                    // setChess(new Chess());  ****working after removing this
                    setBoard(chess.board());
                    console.log("Game initialization");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board);
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;

            }
        }
    },[socket])


    if(!socket) return <div>Connecting...</div>

    return <div className="justify-center flex">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4 w-full">
                <div className="col-span-4 w-full flex justify-center">
                    <ChessBoard socket={socket} board= {board}/>
                </div>
                <div className="col-span-2 bg-slate-900 w-full flex justify-center">
                    <div className="pt-8">
                    <Button onClick={()  =>{
                            socket.send(JSON.stringify({
                                type: INT_GAME
                            }))
                        }}>
                            Play 
                        </Button>      
                    </div>             
                </div>
            </div>
        </div>
    </div>
}