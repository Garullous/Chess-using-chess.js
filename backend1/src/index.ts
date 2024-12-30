


// ws in node.js 
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  console.log('New connection established');
  ws.on('error', console.error);
  gameManager.addUser(ws);
  ws.on("close", () => {
    console.log('Connection closed');
    gameManager.removeUser(ws);
  });
});