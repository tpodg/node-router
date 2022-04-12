import {IncomingMessage, RequestListener, ServerResponse} from 'http';
import './IncomingMessage';

export class Router {
    private routes: Map<Method, Set<Route>> = new Map<Method, Set<Route>>([
        [Method.DELETE, new Set<Route>()],
        [Method.GET, new Set<Route>()],
        [Method.OPTIONS, new Set<Route>()],
        [Method.PATCH, new Set<Route>()],
        [Method.POST, new Set<Route>()],
        [Method.PUT, new Set<Route>()],
    ]);

    private defaultRoute = Route.of(Method.ALL, '', (req, res) => {
        res.end('');
    });

    delete(path: string, listener: RequestListener) {
        this.routes.get(Method.DELETE)?.add(Route.of(Method.DELETE, path, listener));
    }

    get(path: string, listener: RequestListener) {
        this.routes.get(Method.GET)?.add(Route.of(Method.GET, path, listener));
    }

    patch(path: string, listener: RequestListener) {
        this.routes.get(Method.PATCH)?.add(Route.of(Method.PATCH, path, listener));
    }

    post(path: string, listener: RequestListener) {
        this.routes.get(Method.POST)?.add(Route.of(Method.POST, path, listener));
    }

    put(path: string, listener: RequestListener) {
        this.routes.get(Method.PUT)?.add(Route.of(Method.PUT, path, listener));
    }

    fallback(listener: RequestListener): void {
        this.defaultRoute = Route.of(Method.ALL, '', listener);
    }

    init(): (req: IncomingMessage, res: ServerResponse) => void {
        return (req, res) => {
            const route = this.findRoute(req);
            req.params = route.path.params;
            route.listener(req, res);
        };
    }

    private findRoute(request: IncomingMessage): Route {
        let found: Route | null = null;
        for (const route of this.routes.get(Method[request.method as Method]) || []) {
            const result = request.url?.match(route.path.pattern);
            if (result) {
                if (result.groups) {
                    for (const [key] of route.path.params.entries()) {
                        route.path.params.set(key, result.groups[key]);
                    }
                    found = route;
                } else {
                    return route;
                }
            }
        }
        return found || this.defaultRoute;
    }
}

class Route {
    private constructor(public method: Method, public path: Path, public listener: RequestListener) {
    }

    static of(method: Method, path: string, listener: RequestListener) {
        return new Route(method, this.parsePath(path), listener);
    }

    private static parsePath(path: string): Path {
        const params = path.match(/(:\w+)/g) || [];
        const paramsMap = new Map<string, string>();
        for (let i = 0; i < params.length; i++) {
            const paramName = params[i].slice(1);
            paramsMap.set(paramName, '');
            path = path?.replace(params[i], `(?<${paramName}>\\w+)?`);
        }
        return new Path(new RegExp(`^${path}[/]*$`), paramsMap);
    }
}

class Path {
    constructor(public pattern: RegExp, public params: Map<string, string>) {
    }

    param(name: string): string | undefined {
        return this.params.get(name) || undefined;
    }
}

enum Method {
    ALL = 'ALL',
    DELETE = 'DELETE',
    GET = 'GET',
    OPTIONS = 'OPTIONS',
    PATCH = 'PATCH',
    POST = 'POST',
    PUT = 'PUT'
}