import { MongoClient } from 'mongodb';
import { createReadStream } from 'fs';
import pkg from 'stream-json';
const { parser } = pkg;

import pkgArray from 'stream-json/streamers/StreamArray.js';
const { streamArray } = pkgArray;

const uri = "";
const client = new MongoClient(uri);
const dbName = 'songs';
const collectionName = 'romanChords';

async function run() {
    try {
        await client.connect();
        console.log("Connected to database");
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        await collection.createIndex({ songID: 1 }, { unique: true });

        const BATCH_SIZE = 10000;
        let documentsBatch = [];

        const jsonStream = createReadStream('data2.json')
            .pipe(parser())
            .pipe(streamArray());

        jsonStream.on('data', async ({ value }) => {
            jsonStream.pause();
            const document = {
                probabilityArray: value[0],
                rawChords: value[1],
                artist: value[2],
                title: value[3],
                romanChords: value[4],
                clusters: value[6],
                songID: value[5],
                placeInCluster: value[7]
            };

            const exists = await collection.findOne({ songID: document.songID });
            if (!exists) {
                documentsBatch.push(document);
            }

            if (documentsBatch.length >= BATCH_SIZE) {
                await collection.insertMany(documentsBatch, { ordered: false }).catch(e => console.log(e));
                documentsBatch = []; 
            }
            jsonStream.resume();
        });

        jsonStream.on('end', async () => {
            if (documentsBatch.length) {
                await collection.insertMany(documentsBatch, { ordered: false }).catch(e => console.log(e));
                console.log("Documents inserted");
            }
            await client.close();
        });

    } catch (err) {
        console.error("An error occurred:", err);
        await client.close();
    }
}

run().catch(console.dir);
