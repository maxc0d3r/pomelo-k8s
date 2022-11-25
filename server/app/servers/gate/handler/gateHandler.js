var logger = require('pomelo-logger').getLogger('gateHandler')

module.exports = function(app) {
  return new Handler(app)
};

var Handler = function(app) {
  this.app = app
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next step callback
 *
 */

handler.queryEntry = function(msg, session, next) {
	var uid = msg.uid;
	if(!uid) {
		next(null, {
			code: 500
		});
		return;
	}
  var connectors = this.app.getServersByType('connector')
  if(!connectors || connectors.length == 0){
    return next(new Error('no connector available'))
  }
  var randomIdx = Math.floor(Math.random() * connectors.length)
  var server = connectors[randomIdx]
  next(null, {host: server.clientHost, port: server.clientPort})
};
