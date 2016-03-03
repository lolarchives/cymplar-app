
export class SocketIOCymplarService {

        constructor(io: SocketIO.Server) {
                io.on('connection', (socket: SocketIO.Socket) => {
                        console.log('someone is connected');
                        socket.on('message', function (data: any) {
                        
                                console.log('received message ' + JSON.stringify(data));
                                console.log('broadcasting message');
                                
                                io.sockets.emit('broadcast', {
                                        payload: data
                                });
                                console.log('broadcast complete');
                        });
                });
	}
}
