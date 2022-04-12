# Node Router

Simple RegEx based Node.js router written in TypeScript.

## Features
* Support for path parameters
* Precedence of exact match over parameterized match
* Zero 3rd party dependencies

## How to use
```shell
npm install @tpodg/node-router
```

### JavaScript
```javascript
const http = require('http');
const _ = require('@tpodg/node-router');

const router = new _.Router();
router.get('/parameter/:id', (req, res) => {
    res.end(`Param id: ${req.param('id')}`);
});

const server = http.createServer(router.init());
server.listen(3000);
```

### TypeScript
```typescript
import {createServer} from 'http'
import {Router} from '@tpodg/node-router'

const router = new Router();
router.get('/parameter/:id', (req, res) => {
    res.end(`Param id: ${req.param('id')}`);
});

const server = createServer(router.init());
server.listen(3000);
```
