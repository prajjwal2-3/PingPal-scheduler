export async function connectToRedis() {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    return redis
}