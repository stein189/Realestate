import assert from 'assert';

export default class Listing {
    private _brokerId: number;
    private _brokerName: string;
    private _place: string;
    private _isForSale: boolean;

    public constructor(brokerId: number, brokerName: string, place: string, isForSale: boolean) {
        // Typescript is compiled to javascript and has no strict types on runtime.
        // Therefor we need to manually assert that the values are to correct type
        assert(typeof brokerId === 'number', `BrokerId must be a number ${JSON.stringify(brokerId)} given`);
        assert(typeof brokerName === 'string', `BrokerName must be a string ${JSON.stringify(brokerName)} given`);
        assert(typeof place === 'string', `Place must be a string ${JSON.stringify(place)} given`);
        assert(typeof isForSale === 'boolean', `IsForSale must be a boolean ${JSON.stringify(isForSale)} given`);

        assert(brokerName.length > 0, `BrokerName cannot be an empty string`);
        assert(place.length > 0, `Place cannot be an empty string`);

        this._brokerId = brokerId;
        this._brokerName = brokerName;
        this._place = place;
        this._isForSale = isForSale;
    }

    public get brokerId(): number {
        return this._brokerId;
    }

    public get brokerName(): string {
        return this._brokerName;
    }

    public get place(): string {
        return this._place;
    }

    public get isForSale(): boolean {
        return this._isForSale;
    }

    public isInAmsterdam() {
        return this._place.toLocaleLowerCase() === 'amsterdam';
    }
}
