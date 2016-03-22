import {SocketNotification} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';

export class SocketIOCymplarService {

        constructor(io: SocketIO.Server) {
                io.on('connection', (socket: SocketIO.Socket) => {
                        
                        this.generateOrganizationConfiguration(socket);
                        
                        this.generateLeadLogConfiguration(socket);
                        
                        this.generateLeadChatConfiguration(socket);
                        
                        this.generateOrgChatConfiguration(socket);
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
                
                socket.on('leadLogDeleted', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'deleted log'
                        };
                        
                        socket.broadcast.to(room).emit('leadLogDeleted', sendFormat);
                });
	}
        
        generateLeadChatConfiguration(socket: SocketIO.Socket) {
                socket.on('leadChatJoin', (notification: SocketNotification) => {
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
                        
                        socket.broadcast.to(room).emit('joinedLeadChat', sendFormat);
                });
                
                socket.on('leadChatLeave', (notification: SocketNotification) => {
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
                        
                        socket.broadcast.to(room).emit('leftLeadChat', sendFormat);
                });
                
                socket.on('leadChatAdd', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'new log activity'
                        };
                        
                        socket.broadcast.to(room).emit('leadChatAdded', sendFormat);
                });
                
                socket.on('leadChatEdit', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'edited log'
                        };
                        
                        socket.broadcast.to(room).emit('leadChatEdited', sendFormat);
                });
                
                socket.on('leadChatDelete', (notification: SocketNotification) => {
                        const room = ObjectUtil.getStringUnionProperty(notification.lead);
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'deleted log'
                        };
                        
                        socket.broadcast.to(room).emit('leadChatDeleted', sendFormat);
                });
	}
        
        generateOrgChatConfiguration(socket: SocketIO.Socket) {
                socket.on('orgChatJoin', (notification: SocketNotification) => {
                       const room = notification.data.room;
                        
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
                        
                        socket.broadcast.to(room).emit('joinedOrgChat', sendFormat);
                });
                
                socket.on('orgChatLeave', (notification: SocketNotification) => {
                        const room = notification.data.room;
                        
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
                        
                        socket.broadcast.to(room).emit('leftOrgChat', sendFormat);
                });
                
                socket.on('orgChatAdd', (notification: SocketNotification) => {
                        const room = notification.data.room;
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'new log activity'
                        };
                        
                        socket.broadcast.to(room).emit('orgChatAdded', sendFormat);
                });
                
                socket.on('orgChatEdit', (notification: SocketNotification) => {
                        const room = notification.data.room;
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'edited log'
                        };
                        
                        socket.broadcast.to(room).emit('orgChatEdited', sendFormat);
                });
                
                socket.on('orgChatDelete', (notification: SocketNotification) => {
                        const room = notification.data.room;
                        
                        const sendFormat = {
                                success: true,
                                data: notification,
                                message: 'deleted log'
                        };
                        
                        socket.broadcast.to(room).emit('orgChatDeleted', sendFormat);
                });
	}
}
