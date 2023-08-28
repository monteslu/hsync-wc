const tcprelay = `
import net from 'net';
import rawr from 'rawr';
import { EventEmitter } from 'events';

const sockets = {};
const transport = new EventEmitter();
function log(...message) {
  console.log(JSON.stringify({message}));
}

log('firing up tcprelay');

transport.send = (data) => {
  const output = String(JSON.stringify(data));
  process.stdout.write(output);
};

process.stdin.on('data', (data) => {
  try {
    const obj = JSON.parse(('' + data.toString()).trim());
    transport.emit('rpc', obj);
  } catch (e) {
  }
});

function connect(port, host, socketId) {
  log('connecting', port, host, socketId);
  const socket = new net.Socket();
  socket.id = socketId;
  sockets[socketId] = socket;
  socket.on('data', (data) => {
    try {
      const aData = data.toString('base64');
      peer.notifiers.data(socket.id, aData);
    } catch (e) {
      log('error relaying data back to ', e);
    }
  });
  return new Promise((resolve, reject) => {
    let connected = false;
    function errorHandler(err) {
      reject(err);
    }
    socket.on('error', errorHandler);
    socket.connect(port, host, (err) => {
      socket.removeListener('error', errorHandler);
      resolve({ ok: 'ok', socketId });
    });
  });
  socket.on('close', () => {
    log('socket closed', socket.id);
  });
}

const peer = rawr({ transport, methods: { connect } });

peer.notifications.onwrite((socketId, data) => {
  if (sockets[socketId]) {
    log('socket available', socketId);
    sockets[socketId].write(Buffer.from(data, 'base64')); //atob(data));
  }
});

log('tcprelay started');
`;

const echoserver = `
import net from 'net';

const PORT = 9000;

const socketServer = net.createServer(async (socket) => {

  console.log('new tcp connection');

  socket.write(Buffer.from(\`hello tcp client, what's good?\\n\\r\`));

  socket.on('data', async (data) => {
    console.log('received', data.toString());
    socket.write(Buffer.from('back atcha, ' + data.toString()));
    // socket.close();
  });

  socket.on('close', () => {
    console.log('closed');
  });

  socket.on('error', (error) => {
    console.log('error', error);
  });

});

socketServer.listen(PORT);

console.log('echo server listening on', PORT);

`;

const files = {
  tcprelay,
  echoserver,
};

export default files;
