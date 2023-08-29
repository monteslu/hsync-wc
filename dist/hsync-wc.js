/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./files.js":
/*!******************!*\
  !*** ./files.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst tcprelay = `\nimport net from 'net';\nimport rawr from 'rawr';\nimport { EventEmitter } from 'events';\n\nconst sockets = {};\nconst transport = new EventEmitter();\nfunction log(...message) {\n  console.log(JSON.stringify({message}));\n}\n\nlog('firing up tcprelay');\n\ntransport.send = (data) => {\n  const output = String(JSON.stringify(data));\n  process.stdout.write(output);\n};\n\nprocess.stdin.on('data', (data) => {\n  try {\n    const obj = JSON.parse(('' + data.toString()).trim());\n    transport.emit('rpc', obj);\n  } catch (e) {\n  }\n});\n\nfunction connect(port, host, socketId) {\n  log('connecting', port, host, socketId);\n  const socket = new net.Socket();\n  socket.id = socketId;\n  sockets[socketId] = socket;\n  socket.on('data', (data) => {\n    try {\n      const aData = data.toString('base64');\n      peer.notifiers.data(socket.id, aData);\n    } catch (e) {\n      log('error relaying data back to ', e);\n    }\n  });\n  return new Promise((resolve, reject) => {\n    let connected = false;\n    function errorHandler(err) {\n      reject(err);\n    }\n    socket.on('error', errorHandler);\n    socket.connect(port, host, (err) => {\n      socket.removeListener('error', errorHandler);\n      resolve({ ok: 'ok', socketId });\n    });\n  });\n  socket.on('close', () => {\n    log('socket closed', socket.id);\n  });\n}\n\nconst peer = rawr({ transport, methods: { connect } });\n\npeer.notifications.onwrite((socketId, data) => {\n  if (sockets[socketId]) {\n    log('socket available', socketId);\n    sockets[socketId].write(Buffer.from(data, 'base64')); //atob(data));\n  }\n});\n\nlog('tcprelay started');\n`;\n\nconst echoserver = `\nimport net from 'net';\n\nconst PORT = 9000;\n\nconst socketServer = net.createServer(async (socket) => {\n\n  console.log('new tcp connection');\n\n  socket.write(Buffer.from(\\`hello tcp client, what's good?\\\\n\\\\r\\`));\n\n  socket.on('data', async (data) => {\n    console.log('received', data.toString());\n    socket.write(Buffer.from('back atcha, ' + data.toString()));\n    // socket.close();\n  });\n\n  socket.on('close', () => {\n    console.log('closed');\n  });\n\n  socket.on('error', (error) => {\n    console.log('error', error);\n  });\n\n});\n\nsocketServer.listen(PORT);\n\nconsole.log('echo server listening on', PORT);\n\n`;\n\nconst files = {\n  tcprelay,\n  echoserver,\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (files);\n\n\n//# sourceURL=webpack://hsync-wc/./files.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createNet: () => (/* binding */ createNet),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var rawr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rawr */ \"./node_modules/rawr/index.js\");\n/* harmony import */ var rawr__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(rawr__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var b64id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! b64id */ \"./node_modules/b64id/index.js\");\n/* harmony import */ var b64id__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(b64id__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _files_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files.js */ \"./files.js\");\n/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./package.json */ \"./package.json\");\n\n\n\n\n\n\nasync function createNet(webcontainerInstance, shellPort = 2323, logOutput = false) {\n  \n  const events = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();\n  const listeners = {};\n  const sockets = {};\n\n  const transport = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();\n  let lastSent = '';\n  function log(...message) {\n    if (logOutput) {\n      console.log(...message);\n    }\n  }\n\n  async function tcprelay() {\n    // await webcontainerInstance.spawn('node', ['echoserver.js']);\n    async function installDependencies() {\n      // install dependencies\n      const installProcess = await webcontainerInstance.spawn('npm', ['install', 'rawr']);\n    \n      installProcess.output.pipeTo(\n        new WritableStream({\n          write(data) {\n            log(data);\n          },\n        })\n      );\n    \n      // wait for install command to exit\n      return installProcess.exit;\n    }\n    await installDependencies();\n    await webcontainerInstance.fs.writeFile('/tcprelay.js', _files_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].tcprelay);\n    const replayProcess = await webcontainerInstance.spawn('node', ['tcprelay.js']);\n    replayProcess.output.pipeTo(\n      new WritableStream({\n        write(rawData) {\n          log('FROM TCPRELAY:', rawData);\n          if (('' + rawData).trim() === lastSent) {\n            console.log('got an echo from relay', rawData);\n            return;\n          }\n          try {\n            const data = JSON.parse(('' + rawData).trim());\n            // console.log('FROM RELAY: parsed data', data);\n            if (data && (data.method || (data.id && ('result' in data || 'error' in data)))) {\n              transport.emit('rpc', data);\n            }\n          } catch (e) {\n            console.warn('unparsable', e);\n          }\n        },\n      })\n    );\n  \n    replayProcess.inputWriter = replayProcess.input.getWriter();\n    transport.send = (data) => {\n      \n      if (!replayProcess.inputWriter) {\n        replayProcess.inputWriter = replayProcess.input.getWriter();\n      }\n      const toSend = JSON.stringify(data) + '\\n';\n      lastSent = toSend.trim();\n      log('TO TCPRELAY:', lastSent);\n      replayProcess.inputWriter.write(toSend);\n    };\n  \n    return replayProcess;\n  };\n\n  await tcprelay();\n  const peer = rawr__WEBPACK_IMPORTED_MODULE_1___default()({ transport });\n\n  peer.notifications.ondata((socketId, data) => {\n    const socket = sockets[socketId];\n    // console.log('browser got data', socketId, typeof data, data, Buffer.from(data, 'base64').toString('utf-8'));\n    if (socket) {\n      socket.emit('data', Buffer.from(data, 'base64')); //atob(data));\n    }\n  });\n\n  peer.notifiers.onclose((socketId) => {\n    const socket = sockets[socketId];\n    if (socket) {\n      socket.emit('close', {});\n      delete sockets[socketId];\n    }\n  });\n\n  function Socket() {\n    const socket = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();\n    socket.id = b64id__WEBPACK_IMPORTED_MODULE_2___default().generateId();\n    sockets[socket.id] = socket;\n    socket.connect = async function(port, host, clientCallback) {\n      log('socket.connect', port, host);\n      try {\n        if (port === shellPort) {\n          async function startShellProcess() {\n            const t1Stream = new WritableStream({\n              write(data) {\n                log('data from shell', data);\n                socket.emit('data', data); //atob(data));\n              },\n            });\n            const shellProcess = await webcontainerInstance.spawn('jsh');\n            shellProcess.output.pipeTo(t1Stream);\n            socket.shellProcess = shellProcess;\n            socket.shellPort = port;\n            if (clientCallback) {\n              clientCallback();\n            }\n            return shellProcess.exit;\n          }\n          await startShellProcess();\n          socket.emit('close', {});\n          return;\n        } else {\n          log('connecting via relay...', port, host, socket.id);\n          const result = await peer.methods.connect(port, host, socket.id);\n          log('connected to linux port!', result);\n          // return result;\n        }\n        if (clientCallback) {\n          clientCallback();\n        }\n      } catch (e) {\n        // console.warn(e);\n        socket.emit('error', e);\n        delete sockets[socket.id];\n      }\n    }\n\n    socket.write = function(message) {\n      // if (socket.serverSocket) {\n      //   socket.serverSocket.emit('data', message);\n      // }\n      // console.log('WEBCONT-NET socket.write bin', message);\n      console.log('WEBCONT-NET socket.write utf8', Buffer.from(message).toString('utf-8'));\n      // console.log('WEBCONT-NET socket.write b64', Buffer.from(message).toString('base64'));\n      // console.log('WEBCONT-NET socket.write btoa', btoa(message));\n      if (socket.shellProcess) {\n        console.log('writing to shell process', message);\n        const str = new TextDecoder().decode(message);\n        if (!socket.shellProcess.inputWriter) {\n          socket.shellProcess.inputWriter = socket.shellProcess.input.getWriter();\n        }\n        socket.shellProcess.inputWriter.write(str);\n      } else {\n        peer.notifiers.write(socket.id, btoa(message));\n      }\n    };\n\n    socket.end = async function(clientCallback) {\n      console.log('socket.end', clientCallback);\n      // if (socket.serverSocket) {\n      //   socket.serverSocket.emit('close');\n      // }\n      try {\n        await peer.methods.end(socket.id);\n        if (clientCallback) {\n          clientCallback();\n        }\n      } catch (e) {\n        console.warn(e);\n        socket.emit('error', e);\n      }\n      delete sockets[socket.id];\n    }\n\n    return socket;\n  }\n\n  function createServer(cb) {\n    const server = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();\n    server.listen = (port) => {\n      // debug('server.listen', port);\n      listeners['l' + port] = server;\n      events.on('socket_connect_' + port, ({ clientSocket, clientCallback }) => {\n        // debug('socket_connect_' + port, clientSocket);\n        const serverSocket = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();\n        clientSocket.serverSocket = serverSocket;\n        if (server.cb) {\n          server.cb(serverSocket);\n        }\n        serverSocket.write = (data) => {\n          console.log('EMITTING DATA', data);\n          clientSocket.emit('data', data);\n        }\n        serverSocket.end = () => {\n          clientSocket.emit('close');\n        }\n        \n        if (clientCallback) {\n          clientCallback();\n        }\n      });\n    };\n    server.cb = cb;\n    return server;\n  }\n\n  return {\n    Socket,\n    createServer,\n    events,\n  };\n};\nconst hsyncWC = {\n  createNet,\n  files: _files_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  pack: _package_json__WEBPACK_IMPORTED_MODULE_4__,\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hsyncWC);\n\nglobalThis.hsyncWC = hsyncWC;\n\n//# sourceURL=webpack://hsync-wc/./index.js?");

/***/ }),

/***/ "./node_modules/b64id/index.js":
/*!*************************************!*\
  !*** ./node_modules/b64id/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const base64 = __webpack_require__(/*! base64-url */ \"./node_modules/base64-url/index.js\");\nconst uuidv4 = (__webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/commonjs-browser/index.js\").v4);\n\nfunction uuidToB64(uuidStr) {\n  const buf = Buffer.from(uuidStr.replace(/\\-/g, ''), 'hex');\n  return base64.encode(buf);\n}\n\nfunction b64ToUuid(b64Str) {\n  const uuid = Buffer.from(base64.unescape(b64Str), 'base64').toString('hex');\n  return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;\n}\n\nfunction generateId() {\n  return uuidToB64(uuidv4());\n}\n\nmodule.exports = {\n  b64ToUuid,\n  uuidToB64,\n  generateId\n};\n\n//# sourceURL=webpack://hsync-wc/./node_modules/b64id/index.js?");

/***/ }),

/***/ "./node_modules/base64-url/index.js":
/*!******************************************!*\
  !*** ./node_modules/base64-url/index.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = {\n  unescape: unescape,\n  escape: escape,\n  encode: encode,\n  decode: decode\n}\n\nfunction unescape (str) {\n  return (str + '==='.slice((str.length + 3) % 4))\n    .replace(/-/g, '+')\n    .replace(/_/g, '/')\n}\n\nfunction escape (str) {\n  return str.replace(/\\+/g, '-')\n    .replace(/\\//g, '_')\n    .replace(/=/g, '')\n}\n\nfunction encode (str, encoding) {\n  return escape(Buffer.from(str, encoding || 'utf8').toString('base64'))\n}\n\nfunction decode (str, encoding) {\n  return Buffer.from(unescape(str), 'base64').toString(encoding || 'utf8')\n}\n\n\n//# sourceURL=webpack://hsync-wc/./node_modules/base64-url/index.js?");

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar R = typeof Reflect === 'object' ? Reflect : null\nvar ReflectApply = R && typeof R.apply === 'function'\n  ? R.apply\n  : function ReflectApply(target, receiver, args) {\n    return Function.prototype.apply.call(target, receiver, args);\n  }\n\nvar ReflectOwnKeys\nif (R && typeof R.ownKeys === 'function') {\n  ReflectOwnKeys = R.ownKeys\n} else if (Object.getOwnPropertySymbols) {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target)\n      .concat(Object.getOwnPropertySymbols(target));\n  };\n} else {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target);\n  };\n}\n\nfunction ProcessEmitWarning(warning) {\n  if (console && console.warn) console.warn(warning);\n}\n\nvar NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {\n  return value !== value;\n}\n\nfunction EventEmitter() {\n  EventEmitter.init.call(this);\n}\nmodule.exports = EventEmitter;\nmodule.exports.once = once;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._eventsCount = 0;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nvar defaultMaxListeners = 10;\n\nfunction checkListener(listener) {\n  if (typeof listener !== 'function') {\n    throw new TypeError('The \"listener\" argument must be of type Function. Received type ' + typeof listener);\n  }\n}\n\nObject.defineProperty(EventEmitter, 'defaultMaxListeners', {\n  enumerable: true,\n  get: function() {\n    return defaultMaxListeners;\n  },\n  set: function(arg) {\n    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {\n      throw new RangeError('The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received ' + arg + '.');\n    }\n    defaultMaxListeners = arg;\n  }\n});\n\nEventEmitter.init = function() {\n\n  if (this._events === undefined ||\n      this._events === Object.getPrototypeOf(this)._events) {\n    this._events = Object.create(null);\n    this._eventsCount = 0;\n  }\n\n  this._maxListeners = this._maxListeners || undefined;\n};\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {\n  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {\n    throw new RangeError('The value of \"n\" is out of range. It must be a non-negative number. Received ' + n + '.');\n  }\n  this._maxListeners = n;\n  return this;\n};\n\nfunction _getMaxListeners(that) {\n  if (that._maxListeners === undefined)\n    return EventEmitter.defaultMaxListeners;\n  return that._maxListeners;\n}\n\nEventEmitter.prototype.getMaxListeners = function getMaxListeners() {\n  return _getMaxListeners(this);\n};\n\nEventEmitter.prototype.emit = function emit(type) {\n  var args = [];\n  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);\n  var doError = (type === 'error');\n\n  var events = this._events;\n  if (events !== undefined)\n    doError = (doError && events.error === undefined);\n  else if (!doError)\n    return false;\n\n  // If there is no 'error' event listener then throw.\n  if (doError) {\n    var er;\n    if (args.length > 0)\n      er = args[0];\n    if (er instanceof Error) {\n      // Note: The comments on the `throw` lines are intentional, they show\n      // up in Node's output if this results in an unhandled exception.\n      throw er; // Unhandled 'error' event\n    }\n    // At least give some kind of context to the user\n    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));\n    err.context = er;\n    throw err; // Unhandled 'error' event\n  }\n\n  var handler = events[type];\n\n  if (handler === undefined)\n    return false;\n\n  if (typeof handler === 'function') {\n    ReflectApply(handler, this, args);\n  } else {\n    var len = handler.length;\n    var listeners = arrayClone(handler, len);\n    for (var i = 0; i < len; ++i)\n      ReflectApply(listeners[i], this, args);\n  }\n\n  return true;\n};\n\nfunction _addListener(target, type, listener, prepend) {\n  var m;\n  var events;\n  var existing;\n\n  checkListener(listener);\n\n  events = target._events;\n  if (events === undefined) {\n    events = target._events = Object.create(null);\n    target._eventsCount = 0;\n  } else {\n    // To avoid recursion in the case that type === \"newListener\"! Before\n    // adding it to the listeners, first emit \"newListener\".\n    if (events.newListener !== undefined) {\n      target.emit('newListener', type,\n                  listener.listener ? listener.listener : listener);\n\n      // Re-assign `events` because a newListener handler could have caused the\n      // this._events to be assigned to a new object\n      events = target._events;\n    }\n    existing = events[type];\n  }\n\n  if (existing === undefined) {\n    // Optimize the case of one listener. Don't need the extra array object.\n    existing = events[type] = listener;\n    ++target._eventsCount;\n  } else {\n    if (typeof existing === 'function') {\n      // Adding the second element, need to change to array.\n      existing = events[type] =\n        prepend ? [listener, existing] : [existing, listener];\n      // If we've already got an array, just append.\n    } else if (prepend) {\n      existing.unshift(listener);\n    } else {\n      existing.push(listener);\n    }\n\n    // Check for listener leak\n    m = _getMaxListeners(target);\n    if (m > 0 && existing.length > m && !existing.warned) {\n      existing.warned = true;\n      // No error code for this since it is a Warning\n      // eslint-disable-next-line no-restricted-syntax\n      var w = new Error('Possible EventEmitter memory leak detected. ' +\n                          existing.length + ' ' + String(type) + ' listeners ' +\n                          'added. Use emitter.setMaxListeners() to ' +\n                          'increase limit');\n      w.name = 'MaxListenersExceededWarning';\n      w.emitter = target;\n      w.type = type;\n      w.count = existing.length;\n      ProcessEmitWarning(w);\n    }\n  }\n\n  return target;\n}\n\nEventEmitter.prototype.addListener = function addListener(type, listener) {\n  return _addListener(this, type, listener, false);\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.prependListener =\n    function prependListener(type, listener) {\n      return _addListener(this, type, listener, true);\n    };\n\nfunction onceWrapper() {\n  if (!this.fired) {\n    this.target.removeListener(this.type, this.wrapFn);\n    this.fired = true;\n    if (arguments.length === 0)\n      return this.listener.call(this.target);\n    return this.listener.apply(this.target, arguments);\n  }\n}\n\nfunction _onceWrap(target, type, listener) {\n  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };\n  var wrapped = onceWrapper.bind(state);\n  wrapped.listener = listener;\n  state.wrapFn = wrapped;\n  return wrapped;\n}\n\nEventEmitter.prototype.once = function once(type, listener) {\n  checkListener(listener);\n  this.on(type, _onceWrap(this, type, listener));\n  return this;\n};\n\nEventEmitter.prototype.prependOnceListener =\n    function prependOnceListener(type, listener) {\n      checkListener(listener);\n      this.prependListener(type, _onceWrap(this, type, listener));\n      return this;\n    };\n\n// Emits a 'removeListener' event if and only if the listener was removed.\nEventEmitter.prototype.removeListener =\n    function removeListener(type, listener) {\n      var list, events, position, i, originalListener;\n\n      checkListener(listener);\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      list = events[type];\n      if (list === undefined)\n        return this;\n\n      if (list === listener || list.listener === listener) {\n        if (--this._eventsCount === 0)\n          this._events = Object.create(null);\n        else {\n          delete events[type];\n          if (events.removeListener)\n            this.emit('removeListener', type, list.listener || listener);\n        }\n      } else if (typeof list !== 'function') {\n        position = -1;\n\n        for (i = list.length - 1; i >= 0; i--) {\n          if (list[i] === listener || list[i].listener === listener) {\n            originalListener = list[i].listener;\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0)\n          return this;\n\n        if (position === 0)\n          list.shift();\n        else {\n          spliceOne(list, position);\n        }\n\n        if (list.length === 1)\n          events[type] = list[0];\n\n        if (events.removeListener !== undefined)\n          this.emit('removeListener', type, originalListener || listener);\n      }\n\n      return this;\n    };\n\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\n\nEventEmitter.prototype.removeAllListeners =\n    function removeAllListeners(type) {\n      var listeners, events, i;\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      // not listening for removeListener, no need to emit\n      if (events.removeListener === undefined) {\n        if (arguments.length === 0) {\n          this._events = Object.create(null);\n          this._eventsCount = 0;\n        } else if (events[type] !== undefined) {\n          if (--this._eventsCount === 0)\n            this._events = Object.create(null);\n          else\n            delete events[type];\n        }\n        return this;\n      }\n\n      // emit removeListener for all listeners on all events\n      if (arguments.length === 0) {\n        var keys = Object.keys(events);\n        var key;\n        for (i = 0; i < keys.length; ++i) {\n          key = keys[i];\n          if (key === 'removeListener') continue;\n          this.removeAllListeners(key);\n        }\n        this.removeAllListeners('removeListener');\n        this._events = Object.create(null);\n        this._eventsCount = 0;\n        return this;\n      }\n\n      listeners = events[type];\n\n      if (typeof listeners === 'function') {\n        this.removeListener(type, listeners);\n      } else if (listeners !== undefined) {\n        // LIFO order\n        for (i = listeners.length - 1; i >= 0; i--) {\n          this.removeListener(type, listeners[i]);\n        }\n      }\n\n      return this;\n    };\n\nfunction _listeners(target, type, unwrap) {\n  var events = target._events;\n\n  if (events === undefined)\n    return [];\n\n  var evlistener = events[type];\n  if (evlistener === undefined)\n    return [];\n\n  if (typeof evlistener === 'function')\n    return unwrap ? [evlistener.listener || evlistener] : [evlistener];\n\n  return unwrap ?\n    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);\n}\n\nEventEmitter.prototype.listeners = function listeners(type) {\n  return _listeners(this, type, true);\n};\n\nEventEmitter.prototype.rawListeners = function rawListeners(type) {\n  return _listeners(this, type, false);\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  if (typeof emitter.listenerCount === 'function') {\n    return emitter.listenerCount(type);\n  } else {\n    return listenerCount.call(emitter, type);\n  }\n};\n\nEventEmitter.prototype.listenerCount = listenerCount;\nfunction listenerCount(type) {\n  var events = this._events;\n\n  if (events !== undefined) {\n    var evlistener = events[type];\n\n    if (typeof evlistener === 'function') {\n      return 1;\n    } else if (evlistener !== undefined) {\n      return evlistener.length;\n    }\n  }\n\n  return 0;\n}\n\nEventEmitter.prototype.eventNames = function eventNames() {\n  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];\n};\n\nfunction arrayClone(arr, n) {\n  var copy = new Array(n);\n  for (var i = 0; i < n; ++i)\n    copy[i] = arr[i];\n  return copy;\n}\n\nfunction spliceOne(list, index) {\n  for (; index + 1 < list.length; index++)\n    list[index] = list[index + 1];\n  list.pop();\n}\n\nfunction unwrapListeners(arr) {\n  var ret = new Array(arr.length);\n  for (var i = 0; i < ret.length; ++i) {\n    ret[i] = arr[i].listener || arr[i];\n  }\n  return ret;\n}\n\nfunction once(emitter, name) {\n  return new Promise(function (resolve, reject) {\n    function errorListener(err) {\n      emitter.removeListener(name, resolver);\n      reject(err);\n    }\n\n    function resolver() {\n      if (typeof emitter.removeListener === 'function') {\n        emitter.removeListener('error', errorListener);\n      }\n      resolve([].slice.call(arguments));\n    };\n\n    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });\n    if (name !== 'error') {\n      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });\n    }\n  });\n}\n\nfunction addErrorHandlerIfEventEmitter(emitter, handler, flags) {\n  if (typeof emitter.on === 'function') {\n    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);\n  }\n}\n\nfunction eventTargetAgnosticAddListener(emitter, name, listener, flags) {\n  if (typeof emitter.on === 'function') {\n    if (flags.once) {\n      emitter.once(name, listener);\n    } else {\n      emitter.on(name, listener);\n    }\n  } else if (typeof emitter.addEventListener === 'function') {\n    // EventTarget does not have `error` event semantics like Node\n    // EventEmitters, we do not listen for `error` events here.\n    emitter.addEventListener(name, function wrapListener(arg) {\n      // IE does not have builtin `{ once: true }` support so we\n      // have to do it manually.\n      if (flags.once) {\n        emitter.removeEventListener(name, wrapListener);\n      }\n      listener(arg);\n    });\n  } else {\n    throw new TypeError('The \"emitter\" argument must be of type EventEmitter. Received type ' + typeof emitter);\n  }\n}\n\n\n//# sourceURL=webpack://hsync-wc/./node_modules/events/events.js?");

/***/ }),

/***/ "./node_modules/rawr/index.js":
/*!************************************!*\
  !*** ./node_modules/rawr/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { EventEmitter } = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\nconst transports = __webpack_require__(/*! ./transports */ \"./node_modules/rawr/transports/index.js\");\n\nfunction rawr({ transport, timeout = 0, handlers = {}, methods, idGenerator }) {\n  let callId = 0;\n  // eslint-disable-next-line no-param-reassign\n  methods = methods || handlers; // backwards compat\n  const pendingCalls = {};\n  const methodHandlers = {};\n  const notificationEvents = new EventEmitter();\n  notificationEvents.on = notificationEvents.on.bind(notificationEvents);\n\n  transport.on('rpc', (msg) => {\n    if (msg.id) {\n      // handle an RPC request\n      if (msg.params && methodHandlers[msg.method]) {\n        methodHandlers[msg.method](msg);\n        return;\n      }\n      // handle an RPC result\n      const promise = pendingCalls[msg.id];\n      if (promise) {\n        if (promise.timeoutId) {\n          clearTimeout(promise.timeoutId);\n        }\n        delete pendingCalls[msg.id];\n        if (msg.error) {\n          promise.reject(msg.error);\n        }\n        return promise.resolve(msg.result);\n      }\n      return;\n    }\n    // handle a notification\n    msg.params.unshift(msg.method);\n    notificationEvents.emit(...msg.params);\n  });\n\n  function addHandler(methodName, handler) {\n    methodHandlers[methodName] = (msg) => {\n      Promise.resolve()\n        .then(() => {\n          return handler.apply(this, msg.params);\n        })\n        .then((result) => {\n          transport.send({\n            id: msg.id,\n            result\n          });\n        })\n        .catch((error) => {\n          const serializedError = { message: error.message };\n          if (error.code) {\n            serializedError.code = error.code;\n          }\n          transport.send({\n            id: msg.id,\n            error: serializedError\n          });\n        });\n    };\n  }\n\n  Object.keys(methods).forEach((m) => {\n    addHandler(m, methods[m]);\n  });\n\n  const methodsProxy = new Proxy({}, {\n    get: (target, name) => {\n      return (...args) => {\n        const id = idGenerator ? idGenerator() : ++callId;\n        const msg = {\n          jsonrpc: '2.0',\n          method: name,\n          params: args,\n          id\n        };\n\n        let timeoutId;\n        if (timeout) {\n          timeoutId = setTimeout(() => {\n            if (pendingCalls[id]) {\n              const err = new Error('RPC timeout');\n              err.code = 504;\n              pendingCalls[id].reject(err);\n              delete pendingCalls[id];\n            }\n          }, timeout);\n        }\n\n        const response = new Promise((resolve, reject) => {\n          pendingCalls[id] = { resolve, reject, timeoutId };\n        });\n\n        transport.send(msg);\n\n        return response;\n      };\n    }\n  });\n\n  const notifiers = new Proxy({}, {\n    get: (target, name) => {\n      return (...args) => {\n        const msg = {\n          jsonrpc: '2.0',\n          method: name,\n          params: args\n        };\n        transport.send(msg);\n      };\n    }\n  });\n\n  const notifications = new Proxy({}, {\n    get: (target, name) => {\n      return (callback) => {\n        notificationEvents.on(name.substring(2), (...args) => {\n          return callback.apply(callback, args);\n        });\n      };\n    }\n  });\n\n  return {\n    methods: methodsProxy,\n    addHandler,\n    notifications,\n    notifiers,\n    transport,\n  };\n}\n\nrawr.transports = transports;\n\nmodule.exports = rawr;\n\n\n//# sourceURL=webpack://hsync-wc/./node_modules/rawr/index.js?");

/***/ }),

/***/ "./node_modules/rawr/transports/index.js":
/*!***********************************************!*\
  !*** ./node_modules/rawr/transports/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mqtt = __webpack_require__(/*! ./mqtt */ \"./node_modules/rawr/transports/mqtt/index.js\");\nconst socketio = __webpack_require__(/*! ./socketio */ \"./node_modules/rawr/transports/socketio/index.js\");\nconst websocket = __webpack_require__(/*! ./websocket */ \"./node_modules/rawr/transports/websocket/index.js\");\nconst worker = __webpack_require__(/*! ./worker */ \"./node_modules/rawr/transports/worker/index.js\");\n\nmodule.exports = {\n    mqtt,\n    socketio,\n    websocket,\n    worker\n};\n\n//# sourceURL=webpack://hsync-wc/./node_modules/rawr/transports/index.js?");

/***/ }),

/***/ "./node_modules/rawr/transports/mqtt/index.js":
/*!****************************************************!*\
  !*** ./node_modules/rawr/transports/mqtt/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { EventEmitter } = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n\nfunction transport({ connection, subTopic, pubTopic, subscribe = true }) {\n  const emitter = new EventEmitter();\n  if (subscribe) {\n    connection.subscribe(subTopic);\n  }\n  connection.on('message', (topic, message) => {\n    if (topic === subTopic) {\n      try {\n        const msg = JSON.parse(message.toString());\n        if (msg.method || (msg.id && ('result' in msg || 'error' in msg))) {\n          emitter.emit('rpc', msg);\n        }\n      } catch (err) {\n        console.error(err);\n      }\n    }\n  });\n  emitter.send = (msg) => {\n    connection.publish(pubTopic, JSON.stringify(msg));\n  };\n  return emitter;\n}\n\nmodule.exports = transport;\n\n\n//# sourceURL=webpack://hsync-wc/./node_modules/rawr/transports/mqtt/index.js?");

/***/ }),

/***/ "./node_modules/rawr/transports/socketio/index.js":
/*!********************************************************!*\
  !*** ./node_modules/rawr/transports/socketio/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { EventEmitter } = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n\nfunction transport({ connection, subTopic, pubTopic }) {\n  const emitter = new EventEmitter();\n  connection.on(subTopic, (msg) => {\n    if (msg.method || (msg.id && ('result' in msg || 'error' in msg))) {\n      emitter.emit('rpc', msg);\n    }\n  });\n  emitter.send = (msg) => {\n    connection.emit(pubTopic, msg);\n  };\n  return emitter;\n}\n\nmodule.exports = transport;\n\n\n//# sourceURL=webpack://hsync-wc/./node_modules/rawr/transports/socketio/index.js?");

/***/ }),

/***/ "./node_modules/rawr/transports/websocket/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/rawr/transports/websocket/index.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { EventEmitter } = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n\nfunction transport(socket, allowBinary = false) {\n  const emitter = new EventEmitter();\n  socket.addEventListener('message', async (evt) => {\n    let { data } = evt;\n    if (allowBinary && data instanceof Blob) {\n      data = await (new Response(data)).text().catch(() => null);\n    }\n    if (typeof evt.data === 'string') {\n      try {\n        const msg = JSON.parse(evt.data);\n        if (msg.method || (msg.id && ('result' in msg || 'error' in msg))) {\n          emitter.emit('rpc', msg);\n        }\n      } catch (err) {\n        // wasn't a JSON message\n      }\n    }\n  });\n  emitter.send = (msg) => {\n    socket.send(JSON.stringify(msg));\n  };\n  return emitter;\n}\n\nmodule.exports = transport;\n\n\n//# sourceURL=webpack://hsync-wc/./node_modules/rawr/transports/websocket/index.js?");

/***/ }),

/***/ "./node_modules/rawr/transports/worker/index.js":
/*!******************************************************!*\
  !*** ./node_modules/rawr/transports/worker/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { EventEmitter } = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n\nfunction dom(webWorker) {\n  const emitter = new EventEmitter();\n  webWorker.addEventListener('message', (msg) => {\n    const { data } = msg;\n    if (data && (data.method || (data.id && ('result' in data || 'error' in data)))) {\n      emitter.emit('rpc', data);\n    }\n  });\n  emitter.send = (msg) => {\n    webWorker.postMessage(msg);\n  };\n  return emitter;\n}\n\nfunction worker() {\n  const emitter = new EventEmitter();\n  self.onmessage = (msg) => {\n    const { data } = msg;\n    if (data && (data.method || (data.id && ('result' in data || 'error' in data)))) {\n      emitter.emit('rpc', data);\n    }\n  };\n  emitter.send = (msg) => {\n    self.postMessage(msg);\n  };\n  return emitter;\n}\n\nfunction transport(webWorker) {\n  if (webWorker) {\n    return dom(webWorker);\n  }\n  return worker();\n}\n\n// backwards compat\ntransport.dom = dom;\ntransport.worker = worker;\n\nmodule.exports = transport;\n\n\n//# sourceURL=webpack://hsync-wc/./node_modules/rawr/transports/worker/index.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nObject.defineProperty(exports, \"NIL\", ({\n  enumerable: true,\n  get: function get() {\n    return _nil.default;\n  }\n}));\nObject.defineProperty(exports, \"parse\", ({\n  enumerable: true,\n  get: function get() {\n    return _parse.default;\n  }\n}));\nObject.defineProperty(exports, \"stringify\", ({\n  enumerable: true,\n  get: function get() {\n    return _stringify.default;\n  }\n}));\nObject.defineProperty(exports, \"v1\", ({\n  enumerable: true,\n  get: function get() {\n    return _v.default;\n  }\n}));\nObject.defineProperty(exports, \"v3\", ({\n  enumerable: true,\n  get: function get() {\n    return _v2.default;\n  }\n}));\nObject.defineProperty(exports, \"v4\", ({\n  enumerable: true,\n  get: function get() {\n    return _v3.default;\n  }\n}));\nObject.defineProperty(exports, \"v5\", ({\n  enumerable: true,\n  get: function get() {\n    return _v4.default;\n  }\n}));\nObject.defineProperty(exports, \"validate\", ({\n  enumerable: true,\n  get: function get() {\n    return _validate.default;\n  }\n}));\nObject.defineProperty(exports, \"version\", ({\n  enumerable: true,\n  get: function get() {\n    return _version.default;\n  }\n}));\n\nvar _v = _interopRequireDefault(__webpack_require__(/*! ./v1.js */ \"./node_modules/uuid/dist/commonjs-browser/v1.js\"));\n\nvar _v2 = _interopRequireDefault(__webpack_require__(/*! ./v3.js */ \"./node_modules/uuid/dist/commonjs-browser/v3.js\"));\n\nvar _v3 = _interopRequireDefault(__webpack_require__(/*! ./v4.js */ \"./node_modules/uuid/dist/commonjs-browser/v4.js\"));\n\nvar _v4 = _interopRequireDefault(__webpack_require__(/*! ./v5.js */ \"./node_modules/uuid/dist/commonjs-browser/v5.js\"));\n\nvar _nil = _interopRequireDefault(__webpack_require__(/*! ./nil.js */ \"./node_modules/uuid/dist/commonjs-browser/nil.js\"));\n\nvar _version = _interopRequireDefault(__webpack_require__(/*! ./version.js */ \"./node_modules/uuid/dist/commonjs-browser/version.js\"));\n\nvar _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/commonjs-browser/validate.js\"));\n\nvar _stringify = _interopRequireDefault(__webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/commonjs-browser/stringify.js\"));\n\nvar _parse = _interopRequireDefault(__webpack_require__(/*! ./parse.js */ \"./node_modules/uuid/dist/commonjs-browser/parse.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/index.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/md5.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/md5.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\n/*\n * Browser-compatible JavaScript MD5\n *\n * Modification of JavaScript MD5\n * https://github.com/blueimp/JavaScript-MD5\n *\n * Copyright 2011, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * https://opensource.org/licenses/MIT\n *\n * Based on\n * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message\n * Digest Algorithm, as defined in RFC 1321.\n * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009\n * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet\n * Distributed under the BSD License\n * See http://pajhome.org.uk/crypt/md5 for more info.\n */\nfunction md5(bytes) {\n  if (typeof bytes === 'string') {\n    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape\n\n    bytes = new Uint8Array(msg.length);\n\n    for (let i = 0; i < msg.length; ++i) {\n      bytes[i] = msg.charCodeAt(i);\n    }\n  }\n\n  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));\n}\n/*\n * Convert an array of little-endian words to an array of bytes\n */\n\n\nfunction md5ToHexEncodedArray(input) {\n  const output = [];\n  const length32 = input.length * 32;\n  const hexTab = '0123456789abcdef';\n\n  for (let i = 0; i < length32; i += 8) {\n    const x = input[i >> 5] >>> i % 32 & 0xff;\n    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);\n    output.push(hex);\n  }\n\n  return output;\n}\n/**\n * Calculate output length with padding and bit length\n */\n\n\nfunction getOutputLength(inputLength8) {\n  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;\n}\n/*\n * Calculate the MD5 of an array of little-endian words, and a bit length.\n */\n\n\nfunction wordsToMd5(x, len) {\n  /* append padding */\n  x[len >> 5] |= 0x80 << len % 32;\n  x[getOutputLength(len) - 1] = len;\n  let a = 1732584193;\n  let b = -271733879;\n  let c = -1732584194;\n  let d = 271733878;\n\n  for (let i = 0; i < x.length; i += 16) {\n    const olda = a;\n    const oldb = b;\n    const oldc = c;\n    const oldd = d;\n    a = md5ff(a, b, c, d, x[i], 7, -680876936);\n    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);\n    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);\n    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);\n    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);\n    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);\n    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);\n    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);\n    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);\n    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);\n    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);\n    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);\n    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);\n    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);\n    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);\n    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);\n    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);\n    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);\n    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);\n    b = md5gg(b, c, d, a, x[i], 20, -373897302);\n    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);\n    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);\n    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);\n    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);\n    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);\n    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);\n    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);\n    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);\n    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);\n    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);\n    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);\n    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);\n    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);\n    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);\n    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);\n    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);\n    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);\n    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);\n    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);\n    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);\n    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);\n    d = md5hh(d, a, b, c, x[i], 11, -358537222);\n    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);\n    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);\n    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);\n    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);\n    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);\n    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);\n    a = md5ii(a, b, c, d, x[i], 6, -198630844);\n    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);\n    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);\n    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);\n    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);\n    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);\n    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);\n    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);\n    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);\n    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);\n    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);\n    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);\n    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);\n    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);\n    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);\n    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);\n    a = safeAdd(a, olda);\n    b = safeAdd(b, oldb);\n    c = safeAdd(c, oldc);\n    d = safeAdd(d, oldd);\n  }\n\n  return [a, b, c, d];\n}\n/*\n * Convert an array bytes to an array of little-endian words\n * Characters >255 have their high-byte silently ignored.\n */\n\n\nfunction bytesToWords(input) {\n  if (input.length === 0) {\n    return [];\n  }\n\n  const length8 = input.length * 8;\n  const output = new Uint32Array(getOutputLength(length8));\n\n  for (let i = 0; i < length8; i += 8) {\n    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;\n  }\n\n  return output;\n}\n/*\n * Add integers, wrapping at 2^32. This uses 16-bit operations internally\n * to work around bugs in some JS interpreters.\n */\n\n\nfunction safeAdd(x, y) {\n  const lsw = (x & 0xffff) + (y & 0xffff);\n  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n  return msw << 16 | lsw & 0xffff;\n}\n/*\n * Bitwise rotate a 32-bit number to the left.\n */\n\n\nfunction bitRotateLeft(num, cnt) {\n  return num << cnt | num >>> 32 - cnt;\n}\n/*\n * These functions implement the four basic operations the algorithm uses.\n */\n\n\nfunction md5cmn(q, a, b, x, s, t) {\n  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);\n}\n\nfunction md5ff(a, b, c, d, x, s, t) {\n  return md5cmn(b & c | ~b & d, a, b, x, s, t);\n}\n\nfunction md5gg(a, b, c, d, x, s, t) {\n  return md5cmn(b & d | c & ~d, a, b, x, s, t);\n}\n\nfunction md5hh(a, b, c, d, x, s, t) {\n  return md5cmn(b ^ c ^ d, a, b, x, s, t);\n}\n\nfunction md5ii(a, b, c, d, x, s, t) {\n  return md5cmn(c ^ (b | ~d), a, b, x, s, t);\n}\n\nvar _default = md5;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/md5.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/native.js":
/*!***********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/native.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\nconst randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);\nvar _default = {\n  randomUUID\n};\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/native.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/nil.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/nil.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\nvar _default = '00000000-0000-0000-0000-000000000000';\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/nil.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/parse.js":
/*!**********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/parse.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\nvar _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/commonjs-browser/validate.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction parse(uuid) {\n  if (!(0, _validate.default)(uuid)) {\n    throw TypeError('Invalid UUID');\n  }\n\n  let v;\n  const arr = new Uint8Array(16); // Parse ########-....-....-....-............\n\n  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;\n  arr[1] = v >>> 16 & 0xff;\n  arr[2] = v >>> 8 & 0xff;\n  arr[3] = v & 0xff; // Parse ........-####-....-....-............\n\n  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;\n  arr[5] = v & 0xff; // Parse ........-....-####-....-............\n\n  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;\n  arr[7] = v & 0xff; // Parse ........-....-....-####-............\n\n  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;\n  arr[9] = v & 0xff; // Parse ........-....-....-....-############\n  // (Use \"/\" to avoid 32-bit truncation when bit-shifting high-order bytes)\n\n  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;\n  arr[11] = v / 0x100000000 & 0xff;\n  arr[12] = v >>> 24 & 0xff;\n  arr[13] = v >>> 16 & 0xff;\n  arr[14] = v >>> 8 & 0xff;\n  arr[15] = v & 0xff;\n  return arr;\n}\n\nvar _default = parse;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/parse.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/regex.js":
/*!**********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/regex.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\nvar _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/regex.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/rng.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/rng.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = rng;\n// Unique ID creation requires a high quality random # generator. In the browser we therefore\n// require the crypto API and do not support built-in fallback to lower quality random number\n// generators (like Math.random()).\nlet getRandomValues;\nconst rnds8 = new Uint8Array(16);\n\nfunction rng() {\n  // lazy load so that environments that need to polyfill have a chance to do so\n  if (!getRandomValues) {\n    // getRandomValues needs to be invoked in a context where \"this\" is a Crypto implementation.\n    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);\n\n    if (!getRandomValues) {\n      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');\n    }\n  }\n\n  return getRandomValues(rnds8);\n}\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/rng.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/sha1.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/sha1.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\n// Adapted from Chris Veness' SHA1 code at\n// http://www.movable-type.co.uk/scripts/sha1.html\nfunction f(s, x, y, z) {\n  switch (s) {\n    case 0:\n      return x & y ^ ~x & z;\n\n    case 1:\n      return x ^ y ^ z;\n\n    case 2:\n      return x & y ^ x & z ^ y & z;\n\n    case 3:\n      return x ^ y ^ z;\n  }\n}\n\nfunction ROTL(x, n) {\n  return x << n | x >>> 32 - n;\n}\n\nfunction sha1(bytes) {\n  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];\n  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];\n\n  if (typeof bytes === 'string') {\n    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape\n\n    bytes = [];\n\n    for (let i = 0; i < msg.length; ++i) {\n      bytes.push(msg.charCodeAt(i));\n    }\n  } else if (!Array.isArray(bytes)) {\n    // Convert Array-like to Array\n    bytes = Array.prototype.slice.call(bytes);\n  }\n\n  bytes.push(0x80);\n  const l = bytes.length / 4 + 2;\n  const N = Math.ceil(l / 16);\n  const M = new Array(N);\n\n  for (let i = 0; i < N; ++i) {\n    const arr = new Uint32Array(16);\n\n    for (let j = 0; j < 16; ++j) {\n      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];\n    }\n\n    M[i] = arr;\n  }\n\n  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);\n  M[N - 1][14] = Math.floor(M[N - 1][14]);\n  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;\n\n  for (let i = 0; i < N; ++i) {\n    const W = new Uint32Array(80);\n\n    for (let t = 0; t < 16; ++t) {\n      W[t] = M[i][t];\n    }\n\n    for (let t = 16; t < 80; ++t) {\n      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);\n    }\n\n    let a = H[0];\n    let b = H[1];\n    let c = H[2];\n    let d = H[3];\n    let e = H[4];\n\n    for (let t = 0; t < 80; ++t) {\n      const s = Math.floor(t / 20);\n      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;\n      e = d;\n      d = c;\n      c = ROTL(b, 30) >>> 0;\n      b = a;\n      a = T;\n    }\n\n    H[0] = H[0] + a >>> 0;\n    H[1] = H[1] + b >>> 0;\n    H[2] = H[2] + c >>> 0;\n    H[3] = H[3] + d >>> 0;\n    H[4] = H[4] + e >>> 0;\n  }\n\n  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];\n}\n\nvar _default = sha1;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/sha1.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/stringify.js":
/*!**************************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/stringify.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\nexports.unsafeStringify = unsafeStringify;\n\nvar _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/commonjs-browser/validate.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nconst byteToHex = [];\n\nfor (let i = 0; i < 256; ++i) {\n  byteToHex.push((i + 0x100).toString(16).slice(1));\n}\n\nfunction unsafeStringify(arr, offset = 0) {\n  // Note: Be careful editing this code!  It's been tuned for performance\n  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434\n  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();\n}\n\nfunction stringify(arr, offset = 0) {\n  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one\n  // of the following:\n  // - One or more input array values don't map to a hex octet (leading to\n  // \"undefined\" in the uuid)\n  // - Invalid input values for the RFC `version` or `variant` fields\n\n  if (!(0, _validate.default)(uuid)) {\n    throw TypeError('Stringified UUID is invalid');\n  }\n\n  return uuid;\n}\n\nvar _default = stringify;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/stringify.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v1.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v1.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\nvar _rng = _interopRequireDefault(__webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/commonjs-browser/rng.js\"));\n\nvar _stringify = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/commonjs-browser/stringify.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// **`v1()` - Generate time-based UUID**\n//\n// Inspired by https://github.com/LiosK/UUID.js\n// and http://docs.python.org/library/uuid.html\nlet _nodeId;\n\nlet _clockseq; // Previous uuid creation time\n\n\nlet _lastMSecs = 0;\nlet _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details\n\nfunction v1(options, buf, offset) {\n  let i = buf && offset || 0;\n  const b = buf || new Array(16);\n  options = options || {};\n  let node = options.node || _nodeId;\n  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not\n  // specified.  We do this lazily to minimize issues related to insufficient\n  // system entropy.  See #189\n\n  if (node == null || clockseq == null) {\n    const seedBytes = options.random || (options.rng || _rng.default)();\n\n    if (node == null) {\n      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)\n      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];\n    }\n\n    if (clockseq == null) {\n      // Per 4.2.2, randomize (14 bit) clockseq\n      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;\n    }\n  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,\n  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so\n  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'\n  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.\n\n\n  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock\n  // cycle to simulate higher resolution clock\n\n  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)\n\n  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression\n\n  if (dt < 0 && options.clockseq === undefined) {\n    clockseq = clockseq + 1 & 0x3fff;\n  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new\n  // time interval\n\n\n  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {\n    nsecs = 0;\n  } // Per 4.2.1.2 Throw error if too many uuids are requested\n\n\n  if (nsecs >= 10000) {\n    throw new Error(\"uuid.v1(): Can't create more than 10M uuids/sec\");\n  }\n\n  _lastMSecs = msecs;\n  _lastNSecs = nsecs;\n  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch\n\n  msecs += 12219292800000; // `time_low`\n\n  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;\n  b[i++] = tl >>> 24 & 0xff;\n  b[i++] = tl >>> 16 & 0xff;\n  b[i++] = tl >>> 8 & 0xff;\n  b[i++] = tl & 0xff; // `time_mid`\n\n  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;\n  b[i++] = tmh >>> 8 & 0xff;\n  b[i++] = tmh & 0xff; // `time_high_and_version`\n\n  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version\n\n  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)\n\n  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`\n\n  b[i++] = clockseq & 0xff; // `node`\n\n  for (let n = 0; n < 6; ++n) {\n    b[i + n] = node[n];\n  }\n\n  return buf || (0, _stringify.unsafeStringify)(b);\n}\n\nvar _default = v1;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/v1.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v3.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v3.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\nvar _v = _interopRequireDefault(__webpack_require__(/*! ./v35.js */ \"./node_modules/uuid/dist/commonjs-browser/v35.js\"));\n\nvar _md = _interopRequireDefault(__webpack_require__(/*! ./md5.js */ \"./node_modules/uuid/dist/commonjs-browser/md5.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst v3 = (0, _v.default)('v3', 0x30, _md.default);\nvar _default = v3;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/v3.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v35.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v35.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.URL = exports.DNS = void 0;\nexports[\"default\"] = v35;\n\nvar _stringify = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/commonjs-browser/stringify.js\");\n\nvar _parse = _interopRequireDefault(__webpack_require__(/*! ./parse.js */ \"./node_modules/uuid/dist/commonjs-browser/parse.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction stringToBytes(str) {\n  str = unescape(encodeURIComponent(str)); // UTF8 escape\n\n  const bytes = [];\n\n  for (let i = 0; i < str.length; ++i) {\n    bytes.push(str.charCodeAt(i));\n  }\n\n  return bytes;\n}\n\nconst DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';\nexports.DNS = DNS;\nconst URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';\nexports.URL = URL;\n\nfunction v35(name, version, hashfunc) {\n  function generateUUID(value, namespace, buf, offset) {\n    var _namespace;\n\n    if (typeof value === 'string') {\n      value = stringToBytes(value);\n    }\n\n    if (typeof namespace === 'string') {\n      namespace = (0, _parse.default)(namespace);\n    }\n\n    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {\n      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');\n    } // Compute hash of namespace and value, Per 4.3\n    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =\n    // hashfunc([...namespace, ... value])`\n\n\n    let bytes = new Uint8Array(16 + value.length);\n    bytes.set(namespace);\n    bytes.set(value, namespace.length);\n    bytes = hashfunc(bytes);\n    bytes[6] = bytes[6] & 0x0f | version;\n    bytes[8] = bytes[8] & 0x3f | 0x80;\n\n    if (buf) {\n      offset = offset || 0;\n\n      for (let i = 0; i < 16; ++i) {\n        buf[offset + i] = bytes[i];\n      }\n\n      return buf;\n    }\n\n    return (0, _stringify.unsafeStringify)(bytes);\n  } // Function#name is not settable on some platforms (#270)\n\n\n  try {\n    generateUUID.name = name; // eslint-disable-next-line no-empty\n  } catch (err) {} // For CommonJS default export support\n\n\n  generateUUID.DNS = DNS;\n  generateUUID.URL = URL;\n  return generateUUID;\n}\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/v35.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v4.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v4.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\nvar _native = _interopRequireDefault(__webpack_require__(/*! ./native.js */ \"./node_modules/uuid/dist/commonjs-browser/native.js\"));\n\nvar _rng = _interopRequireDefault(__webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/commonjs-browser/rng.js\"));\n\nvar _stringify = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/commonjs-browser/stringify.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction v4(options, buf, offset) {\n  if (_native.default.randomUUID && !buf && !options) {\n    return _native.default.randomUUID();\n  }\n\n  options = options || {};\n\n  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n\n\n  rnds[6] = rnds[6] & 0x0f | 0x40;\n  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided\n\n  if (buf) {\n    offset = offset || 0;\n\n    for (let i = 0; i < 16; ++i) {\n      buf[offset + i] = rnds[i];\n    }\n\n    return buf;\n  }\n\n  return (0, _stringify.unsafeStringify)(rnds);\n}\n\nvar _default = v4;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/v4.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v5.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v5.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\nvar _v = _interopRequireDefault(__webpack_require__(/*! ./v35.js */ \"./node_modules/uuid/dist/commonjs-browser/v35.js\"));\n\nvar _sha = _interopRequireDefault(__webpack_require__(/*! ./sha1.js */ \"./node_modules/uuid/dist/commonjs-browser/sha1.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst v5 = (0, _v.default)('v5', 0x50, _sha.default);\nvar _default = v5;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/v5.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/validate.js":
/*!*************************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/validate.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\nvar _regex = _interopRequireDefault(__webpack_require__(/*! ./regex.js */ \"./node_modules/uuid/dist/commonjs-browser/regex.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction validate(uuid) {\n  return typeof uuid === 'string' && _regex.default.test(uuid);\n}\n\nvar _default = validate;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/validate.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/version.js":
/*!************************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/version.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\n\nvar _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/commonjs-browser/validate.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction version(uuid) {\n  if (!(0, _validate.default)(uuid)) {\n    throw TypeError('Invalid UUID');\n  }\n\n  return parseInt(uuid.slice(14, 15), 16);\n}\n\nvar _default = version;\nexports[\"default\"] = _default;\n\n//# sourceURL=webpack://hsync-wc/./node_modules/uuid/dist/commonjs-browser/version.js?");

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"name\":\"hsync-wc\",\"version\":\"0.3.0\",\"description\":\"Webcontainer helpers for hsync\",\"main\":\"index.js\",\"scripts\":{\"test\":\"echo \\\\\"Error: no test specified\\\\\" && exit 1\",\"build\":\"webpack && BUILD_MODE=production webpack\"},\"keywords\":[],\"author\":\"\",\"license\":\"ISC\",\"dependencies\":{\"b64id\":\"^1.0.1\",\"rawr\":\"^0.15.1\"},\"devDependencies\":{\"webpack\":\"^5.88.2\",\"webpack-cli\":\"^5.1.4\"}}');\n\n//# sourceURL=webpack://hsync-wc/./package.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;