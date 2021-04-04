import ListingRepository from '../Interface/ListingRepository';
import { ILogger } from 'js-logger';
import Listing from '../../Domain/Model/Listing';
import BrokersWithMostListingsQuery from './BrokersWithMostListingsQuery';
import BrokerListings from '../Representation/BrokerListings';

export default class BrokerQueryHandler {
    public constructor(
        private readonly listingRepository: ListingRepository,
        private readonly logger: ILogger
    ) {}

    public async getBrokersWithMostListings(
        query: BrokersWithMostListingsQuery
    ): Promise<Array<BrokerListings>> {
        this.logger.debug('getBrokersWithMostListings method triggered with %o', query);

        const perPage = 25;
        let page = 1;
        let listingResult: Array<Listing>;
        let brokersMap: Record<string, BrokerListings> = {};

        do {
            this.logger.debug(
                'Fetching listings %s till %s that match keywords %s',
                perPage * (page - 1),
                perPage * page,
                query.keywords.join('/')
            );

            // fetch listings
            listingResult = await this.listingRepository.findAllByKeywords(query.keywords, perPage, page);
            // map listings by broker
            brokersMap = this.createBrokerMap(listingResult, brokersMap);

            page++;
        } while (listingResult.length > 0);

        // sort all brokers DESC based on listing count
        const sortedBrokers = this.sortBrokersByMostListings(brokersMap);

        // return the top x brokers, or less if there aren't that many brokers found
        return sortedBrokers.slice(0, query.amountOfBrokers);
    }

    private createBrokerMap(listingResult: Array<Listing>, brokersMap: Record<string, BrokerListings>) {
        for (const listing of listingResult) {
            // If the broker is not yet in our map add it
            if (brokersMap[listing.broker.brokerId] === undefined) {
                // Instead of using the Broker domain object we use a different BrokerListings object
                // We need this because we want to return additional information that does not belong to the Broker object
                brokersMap[listing.broker.brokerId] = new BrokerListings(
                    listing.broker.brokerId,
                    listing.broker.brokerName
                );
            }

            // Increment the counter
            (brokersMap[listing.broker.brokerId] as BrokerListings).listings++;
        }

        return brokersMap;
    }

    private sortBrokersByMostListings(brokersMap: Record<string, BrokerListings>): Array<BrokerListings> {
        return Object.values(brokersMap).sort((brokerA: BrokerListings, brokerB: BrokerListings) => {
            if (brokerA.listings > brokerB.listings) {
                return -1;
            } else if (brokerA.listings < brokerB.listings) {
                return 1;
            }

            return 0;
        });
    }
}
