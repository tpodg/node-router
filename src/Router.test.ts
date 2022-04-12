import {Router} from './Router';
import supertest from 'supertest';
import {createServer} from 'http';

describe('Http methods', () => {
    it('Should configure DELETE', async () => {
        const router = new Router();
        router.delete('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.delete('/request');
        expect(response.text).toBe('response');
    });

    it('Should configure GET', async () => {
        const router = new Router();
        router.get('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/request');
        expect(response.text).toBe('response');
    });

    it('Should configure PATCH', async () => {
        const router = new Router();
        router.patch('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.patch('/request');
        expect(response.text).toBe('response');
    });

    it('Should configure POSY', async () => {
        const router = new Router();
        router.post('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.post('/request');
        expect(response.text).toBe('response');
    });

    it('Should configure PUT', async () => {
        const router = new Router();
        router.put('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.put('/request');
        expect(response.text).toBe('response');
    });

    it('Should match correct method', async () => {
        const router = new Router();
        router.put('/request', (req, res) => {
            res.end('put');
        });
        router.delete('/request', (req, res) => {
            res.end('delete');
        });

        const request = supertest(createServer(router.init()));

        let response = await request.put('/request');
        expect(response.text).toBe('put');

        response = await request.delete('/request');
        expect(response.text).toBe('delete');
    });
});

describe('Path matching', () => {
    it('Should match static path', async () => {
        const router = new Router();
        router.get('/some/path', (req, res) => {
            res.end('path response');
        });
        router.get('/some/path/static', (req, res) => {
            res.end('static response');
        });

        const request = supertest(createServer(router.init()));

        let response = await request.get('/some/path');
        expect(response.text).toBe('path response');

        response = await request.get('/some/path/static');
        expect(response.text).toBe('static response');
    });

    it('Should match dynamic path', async () => {
        const router = new Router();
        router.get('/path/:id', (req, res) => {
            res.end('id response');
        });
        router.get('/path/:id/nest/:param', (req, res) => {
            res.end('nested response');
        });

        const request = supertest(createServer(router.init()));

        let response = await request.get('/path/1234');
        expect(response.text).toBe('id response');

        response = await request.get('/path/abcd/nest/1234');
        expect(response.text).toBe('nested response');
    });

    it('Should match fixed path before dynamic', async () => {
        const router = new Router();
        router.get('/path/fixed', (req, res) => {
            res.end('fixed response');
        });
        router.get('/path/:id', (req, res) => {
            res.end('dynamic response');
        });
        router.get('/path/another', (req, res) => {
            res.end('another fixed response');
        });

        const request = supertest(createServer(router.init()));

        let response = await request.get('/path/fix');
        expect(response.text).toBe('dynamic response');

        response = await request.get('/path/fixed');
        expect(response.text).toBe('fixed response');

        response = await request.get('/path/another');
        expect(response.text).toBe('another fixed response');
    });
});

describe('Ending slash', () => {
    it('Should match without ending slash', async () => {
        const router = new Router();
        router.get('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/request');
        expect(response.text).toBe('response');
    });

    it('Should match with ending slash', async () => {
        const router = new Router();
        router.get('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/request/');
        expect(response.text).toBe('response');
    });
});

describe('Request parameters', () => {
    it('Should return blank string if no params', async () => {
        const router = new Router();
        router.get('/request', (req, res) => {
            expect(req.param('param')).toEqual('');
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/request');
        expect(response.text).toBe('response');
    });

    it('Should successfully map params', async () => {
        const router = new Router();
        router.get('/path/:id/nest/:param', (req, res) => {
            expect(req.param('id')).toEqual('1234');
            expect(req.param('param')).toEqual('abcd');
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/path/1234/nest/abcd');
        expect(response.text).toBe('response');
    });
});

describe('Default route', () => {
    it('Should return default route', async () => {
        const router = new Router();
        router.get('/request', (req, res) => {
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/404');
        expect(response.text).toBe('');
    });

    it('Should customize default route', async () => {
        const router = new Router();
        router.fallback((req, res) => {
            res.end('404');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/404');
        expect(response.text).toBe('404');
    });
});

describe('Request properties', () => {
    it('Should be set', async () => {
        const router = new Router();
        router.get('/request', (req, res) => {
            expect(req.method).toEqual('GET');
            expect(req.url).toEqual('/request');
            res.end('response');
        });

        const request = supertest(createServer(router.init()));
        const response = await request.get('/request');
        expect(response.text).toBe('response');
    });
});