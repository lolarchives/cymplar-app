import {SocketNotification} from '../../core/dto';

namespace socketIoCymplar {
	
	angular.module('app.socket-io-cymplar', [])
	.factory('socket', getSocket);
	
	/** @ngInject */
	function getSocket($rootScope: any) {
		const socket = io.connect();
		
		return {
			on: function(eventName: string, callback: Function){
				console.log('client on ' + eventName);
				socket.on(eventName, callback);
			},
			emit: function(eventName: string, data: SocketNotification) {
				console.log('client emit ' + JSON.stringify(eventName) + ' - ' + JSON.stringify(data));
				socket.emit(eventName, data);
			}
		};
	}

}