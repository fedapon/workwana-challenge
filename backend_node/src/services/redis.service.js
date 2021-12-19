import ioredis from 'ioredis'
const redisConnection = new ioredis(6379, 'localhost')

export default redisConnection
