import Broker from './Broker';

export default class Listing {
    private _identifier: string;
    private _broker: Broker;

    public constructor(identifier: string, broker: Broker) {
        this._identifier = identifier;
        this._broker = broker;
    }

    public get identifier(): string {
        return this._identifier;
    }

    public get broker(): Broker {
        return this._broker;
    }
}
