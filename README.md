# hsync-wc

[WebContainer](https://webcontainers.io/) helpers for [hsync](https://github.com/monteslu/hsync)

## Installation

### npm

`npm install hsync-wc`

### or with a script tag

```
<script src="https://cdn.jsdelivr.net/npm/hsync-wc/dist/hsync-wc.min.js"></script>
```
this gives you a global `hsyncWC` variable.

## Relaying your WebContainer's shell to telnet

First import hsync and hsync-wc into your app:

```javascript
import hsync from 'hsync/hsync-web';
import hsyncWC from 'hsync-wc';
```

Then establish an hsync reverse proxy connection:

```javascript
const hsyncCon = await hsync.dynamicConnect();
const net = await hsyncWC.createNet(webcontainerInstance);
hsyncCon.setNet(net)
hsyncCon.addSocketRelay({ port: 2323 }); // shell port

console.log(hsyncCon.webUrl); // something like: https://xxxxxx.hsync.tech
```

Then in a terminal, connect to that webUrl:

```
npx hsync -llp 2323 -lth https://xxxxxx.hsync.tech
```

And in another terminal tab:

```
telnet localhost 2323
```

## Relaying ANY other TCP/IP port

Add the ports you want to relay from your app through hsync:

```javascript
hsyncCon.addSocketRelay({ port: 9000 }); // any service
```

Add a list ports you whatever ports you'd like to relay from your WebContainer:

```
npx hsync -llp 2323,9000,5432 -lth https://xxxxxx.hsync.tech
```

Simply connect to them on localhost using whatever client you'd like (telnet, postico, etc...)
