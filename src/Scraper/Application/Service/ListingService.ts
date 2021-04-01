
import BrokerRepository from '../Interface/BrokerRepository';
import ListingRepository from '../Interface/ListingRepository';
import { ILogger } from 'js-logger';

export default class ListingService {
    public constructor(
        private readonly listingRepository: ListingRepository,
        private readonly brokerRepository: BrokerRepository,
        private readonly logger: ILogger
    ) {}

    public async countListingsByBrokerInAmsterdam() {
        this.logger.debug('countListingsByBrokerInAmsterdam method triggered');

        const listings = await this.listingRepository.allListingsInAmsterdam(25, 1);

        this.logger.info(listings);
    }
}
