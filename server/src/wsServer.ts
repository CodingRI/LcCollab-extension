import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { IncomingMessage } from "http";

const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });
const rooms = new Map<string, Set<WebSocket>>();

type ChatMessage = {
    type: 'chat' | 'join';
    username: string;
    content: string;
    roomId?: string;
};

type SystemMessage = {
    type: 'system';
    content: string;
    roomId?: string;
}


type WsMessage = ChatMessage | SystemMessage

httpServer.listen(8080, () => {
    console.log("WebSocket server is listening on ws://localhost:8080");
});

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    console.log('New client connected');
    let currentRoom : string | null = null
    let username: string | null = null

    const sendSystemMessage = (content: string) => {
        const message: SystemMessage = {
            type: 'system',
            content,
            roomId: currentRoom || undefined
        };
        ws.send(JSON.stringify(message));
    };

    ws.on('message', (data) => {
        try {
            const message = data.toString();
            console.log(`Received raw: ${message}`);
            
            try {
                const msg: WsMessage = JSON.parse(message);
                
                switch(msg.type) {
                    case 'join' :
                        if(currentRoom && rooms.has(currentRoom)){
                            rooms.get(currentRoom)?.delete(ws)
                            console.log(`${username} left room ${currentRoom}`);
                            
                        }

                        currentRoom = msg.roomId || 'default-room'
                        username = msg.username

                        if(!rooms.has(currentRoom)){
                            rooms.set(currentRoom, new Set())
                            console.log(`Created new room: ${currentRoom}`);
                                                        
                        }


                        rooms.get(currentRoom)?.add(ws)
                        console.log(`${username} joined room ${currentRoom}`);
                        
                        sendSystemMessage(`Joined room ${currentRoom}`)
                        break

                    case 'chat':
                        if(!currentRoom || !username) {
                            sendSystemMessage('Please join a room first')
                            return
                        }
                    console.log(`[${currentRoom}][${username}]: ${msg.content}`);

                    if(rooms.has(currentRoom)) {
                        const roomClients = rooms.get(currentRoom);
                        if(roomClients) {
                            const chatMessage: ChatMessage = {
                                type: 'chat',
                                username: username,
                                content: msg.content,
                                roomId: currentRoom
                            }
                            roomClients.forEach(client => {
                                if(client !== ws && client.readyState === WebSocket.OPEN){
                                    client.send(JSON.stringify(chatMessage))
                                }
                            })
                        }
                    }
                    break
                
                default:
                    console.log('Unknown message type:', msg);
                }

            } catch(parseError){
                console.error('Error parsing message:', parseError);
                sendSystemMessage('Invalid message format');
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
    });

    ws.on('close', () => {
        console.log("Client disconnected");
        if (currentRoom && rooms.has(currentRoom)) {
            rooms.get(currentRoom)?.delete(ws);
            console.log(`${username} left room ${currentRoom} on disconnect`);
        }
    });

});