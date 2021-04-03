import Listing from '../../Domain/Model/Listing';

export default interface ListingRepository {
    findAllByKeywords(keywords: Array<string>, take: number, page: number): Promise<Array<Listing>>;
}
