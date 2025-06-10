"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = require("http");
const httpServer = (0, http_1.createServer)();
const wss = new ws_1.WebSocketServer({ server: httpServer });
const rooms = new Map();
httpServer.listen(8080, () => {
    console.log("WebSocket server is listening on ws://localhost:8080");
});
wss.on('connection', (ws, req) => {
    console.log('New client connected');
    let currentRoom = null;
    let userName = null;
    const sendSystemMessage = (content) => {
        const message = {
            type: 'system',
            content,
            roomId: currentRoom || undefined
        };
        ws.send(JSON.stringify(message));
    };
    ws.on('message', (data) => {
        var _a, _b;
        try {
            const message = data.toString();
            console.log(`Received raw: ${message}`);
            try {
                const msg = JSON.parse(message);
                switch (msg.type) {
                    case 'join':
                        if (currentRoom && rooms.has(currentRoom)) {
                            (_a = rooms.get(currentRoom)) === null || _a === void 0 ? void 0 : _a.delete(ws);
                            console.log(`${userName} left room ${currentRoom}`);
                        }
                        currentRoom = msg.roomId || 'default-room';
                        userName = msg.username;
                        if (!rooms.has(currentRoom)) {
                            rooms.set(currentRoom, new Set());
                            console.log(`Created new room: ${currentRoom}`);
                        }
                        (_b = rooms.get(currentRoom)) === null || _b === void 0 ? void 0 : _b.add(ws);
                        console.log(`${userName} joined room ${currentRoom}`);
                        sendSystemMessage(`Joined room ${currentRoom}`);
                        break;
                    case 'chat':
                        if (!currentRoom || !userName) {
                            sendSystemMessage('Pkease join a room first');
                            return;
                        }
                        console.log(`[${currentRoom}][${userName}]: ${msg.content}`);
                        if (rooms.has(currentRoom)) {
                            const roomClients = rooms.get(currentRoom);
                            if (roomClients) {
                                const chatMessage = {
                                    type: 'chat',
                                    username: userName,
                                    content: msg.content,
                                    roomId: currentRoom
                                };
                                roomClients.forEach(client => {
                                    if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                                        client.send(JSON.stringify(chatMessage));
                                    }
                                });
                            }
                        }
                        break;
                    default:
                        console.log('Unknown message type:', msg);
                }
            }
            catch (parseError) {
                console.error('Error parsing message:', parseError);
                sendSystemMessage('Invalid message format');
            }
        }
        catch (err) {
            console.error('Error handling message:', err);
        }
    });
    ws.on('close', () => {
        var _a;
        console.log("Client disconnected");
        if (currentRoom && rooms.has(currentRoom)) {
            (_a = rooms.get(currentRoom)) === null || _a === void 0 ? void 0 : _a.delete(ws);
            console.log(`${userName} left room ${currentRoom} on disconnect`);
        }
    });
});
