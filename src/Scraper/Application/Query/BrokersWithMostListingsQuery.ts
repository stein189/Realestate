export default class BrokersWithMostListingsQuery {
    public constructor(
        public readonly keywords: Array<string> = [],
        public readonly amountOfBrokers: number = 10
    ) {}
}
