import Listing from '../Listing';
import PaginatedResult from '../PaginatedResult';

export default interface ListingRepository {
    allListingsInAmsterdam(take: number, page: number): Promise<PaginatedResult<Array<Listing>>>;
}
