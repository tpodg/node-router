import {IncomingMessage} from 'http';

declare module 'http' {
    interface IncomingMessage {
        params: Map<string, string>;

        param(name: string): string;
    }
}

IncomingMessage.prototype.param = function (name: string): string {
    return this.params.get(name) || '';
};