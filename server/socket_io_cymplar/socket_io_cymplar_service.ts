import {SocketNotification} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';

export class SocketIOCymplarService {

        constructor(io: SocketIO.Server) {
                io.on('connection', (socket: SocketIO.Socket) => {
                        console.log('someone is connected');
 
                        this.generateOrganizationConfiguration(socket);
                        
                        this.generateLeadLogConfiguration(socket);
                });
	}
        
        generateOrganizationConfiguration(socket: SocketIO.Socket) {
                socket.on('orgJoin', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.organization);
                        const member = ObjectUtil.getStringUnionProperty(notification.member);
                        
                        const sendFormat = {
                                success: true,
                                data: notification
                        };
                                        
                        socket.join(room, (err: Error) => {
                                if (err) {
                                    sendFormat.success = false;             
                                }   
                        });
                        
                        socket.broadcast.to(room).emit('joinedOrg', sendFormat);
                });
                
                socket.on('orgLeave', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.organization);
                        
                        const sendFormat = {
                                success: true,
                                data: notification
                        };
                                        
                        socket.leave(room, (err: Error) => {
                                if (err) {
                                    sendFormat.success = false;             
                                }   
                        });
                        
                        socket.broadcast.to(room).emit('leftOrg', sendFormat);
                });
                
	}
        
        generateLeadLogConfiguration(socket: SocketIO.Socket) {
                socket.on('leadLogJoin', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'Someone joined to the room'
                        };
                                        
                        socket.join(room, (err: Error) => {
                                if (err) {
                                    sendFormat.success = false;             
                                }   
                        });
                        
                        socket.broadcast.to(room).emit('joinedLeadLog', sendFormat);
                });
                
                socket.on('leadLogLeave', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'Someone left the room'
                        };
                                        
                        socket.leave(room, (err: Error) => {
                                if (err) {
                                    sendFormat.success = false;             
                                }   
                        });
                        
                        socket.broadcast.to(room).emit('leftLeadLog', sendFormat);
                });
                
                socket.on('leadLogAdd', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'new log activity'
                        };
                        
                        socket.broadcast.to(room).emit('leadLogAdded', sendFormat);
                });
                
                socket.on('leadLogEdit', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'edited log'
                        };
                        
                        socket.broadcast.to(room).emit('leadLogEdited', sendFormat);
                });
	}
        
        generateLeadChatConfiguration(socket: SocketIO.Socket) {
                socket.on('leadChatJoin', (room: string) => {
                        socket.join(room);
                });
	}
}
