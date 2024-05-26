import { MongoClient } from 'mongodb';
import fs from 'fs';

const uri = "";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const database = client.db("songs");
        const collection = database.collection("romanChords");
        const uniqueEntries = [];
        await new Promise((resolve, reject) => {
            const cursor = collection.find({}).limit(100000);
            const stream = cursor.stream();
            let cnt = 0;
            stream.on('data', (doc) => {
                if (doc.probabilityArray) {
                    cnt++;
                    if (cnt % 10000 === 0) {
                        console.log(cnt);
                    }
                    const uniqueKey = JSON.stringify(doc.probabilityArray);
                    if (!uniqueEntries.some(entry => entry.uniqueKey === uniqueKey)) {
                        uniqueEntries.push(JSON.stringify({
                            artist: doc.artist,
                            title: doc.title,
                            probabilityArray: doc.probabilityArray
                        }));
                    }
                }
            });

            stream.on('error', (err) => {
                console.error('Stream error:', err);
                reject(err); 
            });

            stream.on('end', () => {
                console.log('Stream ended. Unique values collected.');
                resolve();
            });
        });

        const uniqueArray = Array.from(uniqueEntries).map(item => JSON.parse(item));

        fs.writeFileSync('uniqueProbabilities.json', JSON.stringify(uniqueArray, null, 2));
        console.log('Data successfully written to file');

    } catch (err) {
        console.error('An error occurred', err);
    } finally {
        await client.close();
        console.log("Connection closed.");
    }
}

run().catch(console.dir);
