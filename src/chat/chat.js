const xmpp = require('simple-xmpp');
const fs = require('fs');
const path = require('path');
const Parser = require('./parser');

/**
 * The ChatServer class provides an easy way to spool up a connection
 * to the RSI xmpp server.
 */
class ChatServer {
  constructor() {
    // Get the connection info
    this.options = getConnectionInfo();
    this.parser = new Parser();
  }

  connect() {
    // Call internal connect method
    this._connect();
  }

  _connect() {
    this._listenToEvents();
    xmpp.connect({
      jid: this.options.jid,
      password: this.options.password,
      host: this.options.host,
      port: 5222
    });
  }

  _listenToEvents() {
    // Connected to the server
    xmpp.on('online', (data) => {
      xmpp.join(`general@channels.robertsspaceindustries.com/${this.options.nick}`);
      console.log(`I'm connected to general@${this.options.host}/${this.options.nick}`);
    });

    xmpp.on('groupchat', (conference, from, message, stamp) => {
      const parsedMessage = this.parser.parse(from, message);
      console.log(`${parsedMessage.name} says \n\t ${parsedMessage.message}
         Is CIG Employee: ${parsedMessage.isCigEmp}`);
    });

    xmpp.on('error', (err) => {
      // Will try to handle errors by reconnecting to the service non-stop.
      console.error(err);
      console.log(`Trying to re-connect to the service...`);
      xmpp.disconnect();
      this._connect();
    });
  }
}

/**
 * An internal method that gets the connection info from the connection.json
 * file and returns it as an object. This is only needed to be used in order
 * to connect to the xmpp server
 *
 * @return {[type]} [description]
 */
const getConnectionInfo = () => {
  let connectJson;
  try {
    connectJson = fs.readFileSync(path.join(__dirname, '../../config', 'connection.json'));
    connectJson = JSON.parse(connectJson);
    // Add the contructed nickname that comes from the host onto the object
    connectJson.nick = connectJson.jid.substr(0, connectJson.jid.indexOf('@'));
  } catch (err) {
    // If the file does not exist print a verbose explanation
    if (err.code === 'ENOENT') {
      throw new Error(`
        Expected projectRoot/config/connection.json to exist.
        To fix this error create connection.json with this but replace
        pertinent info
        {
          "jid": "handle@robertsspaceindustries.com",
          "password": "chatToken",
          "host": "xmpp.robertsspaceindustries.com"
        }
      `);
    }
    throw new Error(err);
  }
  return connectJson;
}

module.exports = ChatServer;
