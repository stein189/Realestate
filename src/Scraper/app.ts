import { Container } from 'inversify';
import BrokerQueryHandler from './Application/Query/BrokerQueryHandler';
import ScraperServiceProvider from './Infrastructure/Provider/ScraperServiceProvider';
import Symbols from './Infrastructure/Provider/Symbols';
import { ILogger } from 'js-logger';
import BrokersWithMostListingsQuery from './Application/Query/BrokersWithMostListingsQuery';

// Dependency injection using an IoC container might be a bit overkill for a simple cron
// But setting it up now could safe a lot of effort when this service is growing
const container = new Container();
const serviceProvider = new ScraperServiceProvider(container);
serviceProvider.bindServices();

(async () => {
    const logger = container.get<ILogger>(Symbols.logger);
    const brokerQueryHandler = container.get<BrokerQueryHandler>(Symbols.service.query.broker);

    logger.info('Executing job');

    // Using the promise all method we can execute both task asynchronise.
    // We do however wait till we get both results before printing it
    const [
        brokersWithListingsInAmsterdam,
        brokersWithListingsInAmsterdamThatHaveAGraden,
    ] = await Promise.all([
        brokerQueryHandler.getBrokersWithMostListings(new BrokersWithMostListingsQuery(['Amsterdam'])),
        brokerQueryHandler.getBrokersWithMostListings(
            new BrokersWithMostListingsQuery(['Amsterdam', 'tuin'])
        ),
    ]);

    logger.info('Top 10 brokers based on number of listings in Amsterdam');
    console.table(brokersWithListingsInAmsterdam);
    logger.info('Top 10 brokers based on number of listings in Amsterdam that include a graden');
    console.table(brokersWithListingsInAmsterdamThatHaveAGraden);

    // Exit the program
    process.exit(0);
})();
