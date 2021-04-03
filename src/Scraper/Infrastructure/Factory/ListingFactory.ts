import Broker from '../../Domain/Model/Broker';
import Listing from '../../Domain/Model/Listing';

export default class ListingFactory {
    public create(listing: object): Listing {
        return new Listing(
            listing['Id'],
            new Broker(listing['MakelaarId'], listing['MakelaarNaam']),
        );
    }
}
