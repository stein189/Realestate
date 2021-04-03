import assert from 'assert';

export default class Broker {
    private _brokerId: number;
    private _brokerName: string;
    private _listingCount: number = 0;

    public constructor(brokerId: number, brokerName: string) {
        // These values are asserted to make sure that they have the correct type on runetime.
        assert(typeof brokerId === 'number', `BrokerId must be a number ${JSON.stringify(brokerId)} given`);
        assert(typeof brokerName === 'string', `BrokerName must be a string ${JSON.stringify(brokerName)} given`);

        assert(brokerName.length > 0, `BrokerName cannot be an empty string`);
        
        this._brokerId = brokerId;
        this._brokerName = brokerName;
    }

    public get brokerId(): number {
        return this._brokerId;
    }

    public get brokerName(): string {
        return this._brokerName;
    }

    public incrementListingCount() {
        this._listingCount++;
    }

    public get listingCount(): number {
        return this._listingCount;
    }
}
