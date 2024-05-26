import { MongoClient, ServerApiVersion } from 'mongodb';

export async function fetchTopNByProbability(uri, dbName, collectionName, sortKey, secondSortKey, n, cluster, numberOfClusters, numberOfChords) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const aggregationPipeline = [
      {
        $match: {
          $expr: {
            $eq: [
              { $arrayElemAt: ["$clusters", numberOfClusters - 1] },
              cluster
            ],
          },
          "romanChords": { $exists: true, $not: { $size: 0 } },
        }
      },
      {
        $addFields: {
          primarySortValue: {
            $toDouble: `$probabilityArray.${sortKey}`
          },
          secondarySortValue: {
            $size: {
              $filter: {
                input: "$romanChords",
                as: "chord",
                cond: { $eq: ["$$chord", secondSortKey] }
              }
            }
          }
        }
      },
      {
        $match: {
          $expr: {
            $gt: [{ $size: "$romanChords" }, numberOfChords]
          }
        }
      },
      { $sort: { primarySortValue: -1, secondarySortValue: -1 } },
      { $limit: n }
    ];

    const result = await collection.aggregate(aggregationPipeline).toArray();
    console.log(result);
    return result;
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}


export async function fetchArtistSongs(uri, dbName, collectionName, artist) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const query = { "artist": artist };
    const entries = await collection.find(query).toArray();
    return entries;
  } finally {
    await client.close();
  }
}