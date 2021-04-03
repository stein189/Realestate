import ListingRepository from '../../Application/Interface/ListingRepository';
import Listing from '../../Domain/Model/Listing';
import ListingFactory from '../Factory/ListingFactory';
import RetryableApiClientProvider from '../Provider/RetryableApiClientProvider';

export default class RestFundaListingRepository implements ListingRepository {
    public constructor(
        // This API is wrapped in a retry method, if it still fails after a couple attempts the error will be thrown.
        private readonly client: RetryableApiClientProvider,
        private readonly factory: ListingFactory,
        private readonly apiKey: string
    ) {}

    public async findAllByKeywords(
        keywords: Array<string>,
        take: number,
        page: number
    ): Promise<Array<Listing>> {
        // Build the search query based on the passed keywords
        let searchQuery = keywords.length ? `&zo=/${keywords.join('/')}/` : '';

        // Fetch the listings from the API endpoint
        const listingEntities = await this.client
            .retrieve()
            .get(
                `/feeds/Aanbod.svc/json/${this.apiKey}/?type=koop${searchQuery}&page=${page}&pagesize=${take}`
            );

        if (!listingEntities || !listingEntities.data) {
            return [];
        }

        // Map the API result into Listing objects
        return listingEntities.data?.Objects?.map((listing: object) => this.factory.create(listing)) || [];
    }
}
