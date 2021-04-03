import ListingRepository from '../Interface/ListingRepository';
import { ILogger } from 'js-logger';
import Broker from '../../Domain/Model/Broker';
import Listing from '../../Domain/Model/Listing';
import BrokersWithMostListingsQuery from './BrokersWithMostListingsQuery';

export default class BrokerQueryHandler {
    public constructor(
        private readonly listingRepository: ListingRepository,
        private readonly logger: ILogger
    ) {}

    public async getBrokersWithMostListings(query: BrokersWithMostListingsQuery): Promise<Array<Broker>> {
        this.logger.debug('getBrokersWithMostListings method triggered with %o', query);

        const perPage = 25;
        let page = 1;
        let listingResult: Array<Listing>;
        let brokersMap: Record<string, Broker> = {};

        do {
            this.logger.debug(
                'Fetching listings %s till %s that match keywords %s',
                perPage * (page - 1),
                perPage * page,
                query.keywords.join('/')
            );

            // fetch listings
            listingResult = await this.listingRepository.findAllByKeywords(
                query.keywords,
                perPage,
                page
            );
            // map listings by broker
            brokersMap = this.createBrokerMap(listingResult, brokersMap);

            page++;
        } while (listingResult.length > 0);

        // sort all brokers DESC based on listing count
        const sortedBrokers = this.sortBrokersByMostListings(brokersMap);

        // return the top x brokers, or less if there aren't that many brokers found
        return sortedBrokers.slice(0, query.amountOfBrokers);
    }

    private createBrokerMap(listingResult: Array<Listing>, brokersMap: Record<string, Broker>) {
        for (const listing of listingResult) {
            // If the broker is not yet in our map add it
            if (brokersMap[listing.broker.brokerId] === undefined) {
                brokersMap[listing.broker.brokerId] = listing.broker;
            }

            // Increment the counter
            (brokersMap[listing.broker.brokerId] as Broker).incrementListingCount();
        }

        return brokersMap;
    }

    private sortBrokersByMostListings(brokersMap: Record<string, Broker>): Array<Broker> {
        return Object.values(brokersMap).sort((brokerA: Broker, brokerB: Broker) => {
            if (brokerA.listingCount > brokerB.listingCount) {
                return -1;
            } else if (brokerA.listingCount < brokerB.listingCount) {
                return 1;
            }

            return 0;
        });
    }
}
