import { connectToRedis } from "./connections";
import { db } from "./db/db";


export async function handler() {
    console.log("Pushing jobs to queue");
    const redis = await connectToRedis();
    const jobs = await db.endPoints.findMany({
        where: {
            nextPing: {
                lte: new Date()
            }
        }
    })

    for (const job of jobs) {
        const { id, interval, url } = job;
        const jobObject = {
            id: id,
            endPoint: url
        }
        await redis.lpush("jobs", JSON.stringify(jobObject));
        const nextPingDate = new Date(Date.now() + (interval ?? 5) * 60 * 1000);
        await db.endPoints.update({
            where: {
                id: id
            },
            data: {
                nextPing: nextPingDate
            }
        })
    }
    console.log("Jobs pushed to queue", jobs.length);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: `${jobs.length} jobs pushed to queue 🚀.` }),
    };

}

