import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { topSongsByTransition, getArtistSongs } from './App.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const reactAppBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(reactAppBuildPath));
app.use(express.json());

app.post('/api/data', async (req, res) => {
    try {
        console.log(req.body);
       if (req.body["queryType"] === "getTransitionRelatedSongs") {
            const clientData = req.body;
            const dataFromDb = await topSongsByTransition(clientData['chordFrom'], clientData['chordTo'], clientData['cluster'], clientData['numberOfClusters'], clientData['numberOfChords']);
            res.json(dataFromDb);
        }
        else if (req.body["queryType"] === "getArtistSongs") {
            const clientData = req.body;
            console.log(clientData['artist']);
            const dataFromDb = await getArtistSongs(clientData['artist']);
            res.json(dataFromDb);
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'This is data from the server.' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(reactAppBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));