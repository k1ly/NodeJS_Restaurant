import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer()
  private server: Server;

  notifyManagers(status: string) {
    this.server.emit("orders", status);
  }
}