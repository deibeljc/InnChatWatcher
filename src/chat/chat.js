const xmpp = require('simple-xmpp');
const fs = require('fs');
const path = require('path');

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

class ChatServer {

  constructor() {
    // Get the connection info
    this.options = getConnectionInfo();
  }

  connect() {
    // Listen to the events before attempting to connect
    this.listenToEvents();
    xmpp.connect({
      jid: this.options.jid,
      password: this.options.password,
      host: this.options.host,
      port: 5222
    });
  }

  listenToEvents() {
    // Connected to the server
    xmpp.on('online', (data) => {
      xmpp.join(`general@channels.robertsspaceindustries.com/${this.options.nick}`);
      console.log(`I'm connected to general@${this.options.host}/${this.options.nick}`);
    });

    xmpp.on('subscribe', (from) => {
      console.log(from);
    });

    xmpp.on('groupchat', (conference, from, message, stamp) => {
      console.log(`${from} says \n\t ${message}`);
    });

    xmpp.on('error', (err) => {
      console.error(err);
    });
  }
}

module.exports = ChatServer;
