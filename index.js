import { EventEmitter } from 'events';
import rawr from 'rawr';
import b64Id from 'b64id';
import files from './files.js';

export default async function createNet(webcontainerInstance, shellPort = 2323, logOutput = false) {
  
  const events = new EventEmitter();
  const listeners = {};
  const sockets = {};

  const transport = new EventEmitter();
  let lastSent = '';
  function log(...message) {
    if (logOutput) {
      console.log(...message);
    }
  }

  async function tcprelay() {
    // await webcontainerInstance.spawn('node', ['echoserver.js']);
    async function installDependencies() {
      // install dependencies
      const installProcess = await webcontainerInstance.spawn('npm', ['install', 'rawr']);
    
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            log(data);
          },
        })
      );
    
      // wait for install command to exit
      return installProcess.exit;
    }
    await installDependencies();
    await webcontainerInstance.fs.writeFile('/tcprelay.js', files.tcprelay);
    const replayProcess = await webcontainerInstance.spawn('node', ['tcprelay.js']);
    replayProcess.output.pipeTo(
      new WritableStream({
        write(rawData) {
          log('FROM TCPRELAY:', rawData);
          if (('' + rawData).trim() === lastSent) {
            console.log('got an echo from relay', rawData);
            return;
          }
          try {
            const data = JSON.parse(('' + rawData).trim());
            // console.log('FROM RELAY: parsed data', data);
            if (data && (data.method || (data.id && ('result' in data || 'error' in data)))) {
              transport.emit('rpc', data);
            }
          } catch (e) {
            console.warn('unparsable', e);
          }
        },
      })
    );
  
    replayProcess.inputWriter = replayProcess.input.getWriter();
    transport.send = (data) => {
      
      if (!replayProcess.inputWriter) {
        replayProcess.inputWriter = replayProcess.input.getWriter();
      }
      const toSend = JSON.stringify(data) + '\n';
      lastSent = toSend.trim();
      log('TO TCPRELAY:', lastSent);
      replayProcess.inputWriter.write(toSend);
    };
  
    return replayProcess;
  };

  await tcprelay();
  const peer = rawr({ transport });

  peer.notifications.ondata((socketId, data) => {
    const socket = sockets[socketId];
    // console.log('browser got data', socketId, typeof data, data, Buffer.from(data, 'base64').toString('utf-8'));
    if (socket) {
      socket.emit('data', Buffer.from(data, 'base64')); //atob(data));
    }
  });

  peer.notifiers.onclose((socketId) => {
    const socket = sockets[socketId];
    if (socket) {
      socket.emit('close', {});
      delete sockets[socketId];
    }
  });

  function Socket() {
    const socket = new EventEmitter();
    socket.id = b64Id.generateId();
    sockets[socket.id] = socket;
    socket.connect = async function(port, host, clientCallback) {
      log('socket.connect', port, host);
      try {
        if (port === shellPort) {
          async function startShellProcess() {
            const t1Stream = new WritableStream({
              write(data) {
                log('data from shell', data);
                socket.emit('data', data); //atob(data));
              },
            });
            const shellProcess = await webcontainerInstance.spawn('jsh');
            shellProcess.output.pipeTo(t1Stream);
            socket.shellProcess = shellProcess;
            socket.shellPort = port;
            if (clientCallback) {
              clientCallback();
            }
            return shellProcess.exit;
          }
          await startShellProcess();
          socket.emit('close', {});
          return;
        } else {
          log('connecting via relay...', port, host, socket.id);
          const result = await peer.methods.connect(port, host, socket.id);
          log('connected to linux port!', result);
          // return result;
        }
        if (clientCallback) {
          clientCallback();
        }
      } catch (e) {
        // console.warn(e);
        socket.emit('error', e);
        delete sockets[socket.id];
      }
    }

    socket.write = function(message) {
      // if (socket.serverSocket) {
      //   socket.serverSocket.emit('data', message);
      // }
      // console.log('WEBCONT-NET socket.write bin', message);
      console.log('WEBCONT-NET socket.write utf8', Buffer.from(message).toString('utf-8'));
      // console.log('WEBCONT-NET socket.write b64', Buffer.from(message).toString('base64'));
      // console.log('WEBCONT-NET socket.write btoa', btoa(message));
      if (socket.shellProcess) {
        console.log('writing to shell process', message);
        const str = new TextDecoder().decode(message);
        if (!socket.shellProcess.inputWriter) {
          socket.shellProcess.inputWriter = socket.shellProcess.input.getWriter();
        }
        socket.shellProcess.inputWriter.write(str);
      } else {
        peer.notifiers.write(socket.id, btoa(message));
      }
    };

    socket.end = async function(clientCallback) {
      console.log('socket.end', clientCallback);
      // if (socket.serverSocket) {
      //   socket.serverSocket.emit('close');
      // }
      try {
        await peer.methods.end(socket.id);
        if (clientCallback) {
          clientCallback();
        }
      } catch (e) {
        console.warn(e);
        socket.emit('error', e);
      }
      delete sockets[socket.id];
    }

    return socket;
  }

  function createServer(cb) {
    const server = new EventEmitter();
    server.listen = (port) => {
      // debug('server.listen', port);
      listeners['l' + port] = server;
      events.on('socket_connect_' + port, ({ clientSocket, clientCallback }) => {
        // debug('socket_connect_' + port, clientSocket);
        const serverSocket = new EventEmitter();
        clientSocket.serverSocket = serverSocket;
        if (server.cb) {
          server.cb(serverSocket);
        }
        serverSocket.write = (data) => {
          console.log('EMITTING DATA', data);
          clientSocket.emit('data', data);
        }
        serverSocket.end = () => {
          clientSocket.emit('close');
        }
        
        if (clientCallback) {
          clientCallback();
        }
      });
    };
    server.cb = cb;
    return server;
  }

  return {
    Socket,
    createServer,
    events,
    files,
  };
};

globalThis.hsCreateNet = createNet;
