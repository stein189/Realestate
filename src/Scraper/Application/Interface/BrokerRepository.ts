export default interface BrokerRepository {
    store(): Promise<void>;
}
