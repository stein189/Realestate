import BrokerQueryHandler from '../../../src/Scraper/Application/Query/BrokerQueryHandler';
import BrokersWithMostListingsQuery from '../../../src/Scraper/Application/Query/BrokersWithMostListingsQuery';
import Broker from '../../../src/Scraper/Domain/Model/Broker';
import Listing from '../../../src/Scraper/Domain/Model/Listing';

const mockListingRepository = {
    findAllByKeywords: jest.fn<Promise<Listing[]>, any>(async () => {
        return [];
    }),
};

const mockLogger: any = {
    debug: jest.fn(),
    info: jest.fn(),
    warm: jest.fn(),
    error: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('BrokerQueryHandler', () => {
    test('Test if repository is called with correct parameters', async () => {
        const queryHandler = new BrokerQueryHandler(mockListingRepository, mockLogger);
        await queryHandler.getBrokersWithMostListings(
            new BrokersWithMostListingsQuery(['Amsterdam', '75+woonopp', '3+kamers'], 20)
        );

        expect(mockListingRepository.findAllByKeywords).toHaveBeenCalledTimes(1);
        expect(mockListingRepository.findAllByKeywords).toHaveBeenCalledWith(
            ['Amsterdam', '75+woonopp', '3+kamers'],
            25,
            1
        );
    });

    test('Test if repository is called till no more results are returned', async () => {
        mockListingRepository.findAllByKeywords.mockResolvedValueOnce([
            new Listing('listing-id', new Broker(1, 'broker-name')),
        ]);

        const queryHandler = new BrokerQueryHandler(mockListingRepository, mockLogger);
        await queryHandler.getBrokersWithMostListings(new BrokersWithMostListingsQuery());

        expect(mockListingRepository.findAllByKeywords).toHaveBeenCalledTimes(2);
        expect(mockListingRepository.findAllByKeywords).toHaveBeenNthCalledWith(1, [], 25, 1);
        expect(mockListingRepository.findAllByKeywords).toHaveBeenNthCalledWith(2, [], 25, 2);
    });

    test('Test if total listing count is calculated correctly', async () => {
        mockListingRepository.findAllByKeywords.mockResolvedValueOnce([
            new Listing('listing-id-1', new Broker(1, 'broker-name')),
            new Listing('listing-id-2', new Broker(1, 'broker-name')),
            new Listing('listing-id-3', new Broker(1, 'broker-name')),
            new Listing('listing-id-4', new Broker(1, 'broker-name')),
        ]);

        const queryHandler = new BrokerQueryHandler(mockListingRepository, mockLogger);
        const result = await queryHandler.getBrokersWithMostListings(new BrokersWithMostListingsQuery());

        expect(result).toEqual([
            {
                _brokerId: 1,
                _brokerName: 'broker-name',
                _listingCount: 4,
            },
        ]);
    });

    test('Test if brokers are returned in correct order', async () => {
        mockListingRepository.findAllByKeywords.mockResolvedValueOnce([
            new Listing('listing-id-1', new Broker(1, 'broker-name')),
            new Listing('listing-id-2', new Broker(1, 'broker-name')),
            new Listing('listing-id-3', new Broker(2, 'broker-name-2')),
            new Listing('listing-id-4', new Broker(3, 'broker-name-3')),
            new Listing('listing-id-5', new Broker(3, 'broker-name-3')),
            new Listing('listing-id-6', new Broker(3, 'broker-name-3')),
        ]);

        const queryHandler = new BrokerQueryHandler(mockListingRepository, mockLogger);
        const result = await queryHandler.getBrokersWithMostListings(new BrokersWithMostListingsQuery());

        expect(result).toEqual([
            {
                _brokerId: 3,
                _brokerName: 'broker-name-3',
                _listingCount: 3,
            },
           {
                _brokerId: 1,
                _brokerName: 'broker-name',
                _listingCount: 2,
            },
           {
                _brokerId: 2,
                _brokerName: 'broker-name-2',
                _listingCount: 1,
            },
        ]);
    });
});
