
import { MongoClient, ServerApiVersion } from 'mongodb';
import fs from 'fs';
import { Console } from 'console';
import { possibleChords } from '../../client/src/constants/constants.js';
import { fetchTopNByProbability, fetchArtistSongs } from './queryHelpers/queryHelper.js';

const dbName = 'songs';
const collectionName = 'romanChords';
const uri = "mongodb+srv://levalyadov86:FFu8oVo7gLOV4fUX@cluster.ku0sho9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"; // HIDE!
const topN = 5;

export async function topSongsByTransition(chordFrom, chordTo, cluster, numberOfClusters, numberOfChords) {
    const sortKey = `${possibleChords.indexOf(chordFrom)} ${possibleChords.indexOf(chordTo)}`;
    const secondSortKey = chordFrom;
    return await fetchTopNByProbability(uri, dbName, collectionName, sortKey, secondSortKey, topN, cluster, numberOfClusters, numberOfChords).catch(console.error);
}

export async function getArtistSongs(artist) {
    // console.log("getArtistSongs");
    return await fetchArtistSongs(uri, dbName, collectionName, artist).catch(console.error);
}

// console.log(topSongsByTransition('I', 'V'));