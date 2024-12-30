import { Color, PieceSymbol, Square } from "chess.js";
import { useState, useEffect } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ board, socket }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null);
    const [to, setTo] = useState<null | Square>(null);

    useEffect(() => {
        if (from && to) {
            console.log('Sending move:', { from, to });
            socket.send(JSON.stringify({
                type: MOVE,
                payload: {
                    from,
                    to
                }
            }));
            setFrom(null);
            setTo(null);
        }
    }, [from, to, socket]);

    useEffect(() => {
        socket.addEventListener('open', () => {
            console.log('WebSocket connection opened');
        });

        socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return () => {
            socket.removeEventListener('open', () => {});
            socket.removeEventListener('close', () => {});
            socket.removeEventListener('error', () => {});
        };
    }, [socket]);

    return <div className="text-white-200">
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    return <div onClick={() => {
                        if (!from) {
                            console.log('Setting from:', square?.square);
                            setFrom(square?.square ?? null);
                        } else {
                            console.log('Setting to:', square?.square);
                            setTo(square?.square ?? null);
                        }
                    }} key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-white '}`}>
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col">
                                {square ? square.type : ""}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
};