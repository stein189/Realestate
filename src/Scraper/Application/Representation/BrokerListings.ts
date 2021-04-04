export default class BrokerListings {
    public constructor(
        public readonly brokerId: number,
        public readonly brokerName: string,
        public listings: number = 0
    ) {}
}
