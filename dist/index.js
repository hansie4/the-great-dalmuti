"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cardUtils_1 = require("./cardUtils");
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
app.get('/', (_, res) => {
    res.send((0, cardUtils_1.shuffleDeck)((0, cardUtils_1.getStartingDeck)()));
});
io.on('connection', (socket) => {
    console.log(`a user connected: ${JSON.stringify(socket)}`);
});
server.listen(3000, () => {
    console.log(`The Great Dalmuti server up and running on port ${process.env['PORT']}.`);
});
//# sourceMappingURL=index.js.map