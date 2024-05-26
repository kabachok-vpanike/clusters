import React from 'react';
import D3Visualization from '../D3Visualization.js';
import RepresentativeList from '../RepresentativeList/RepresentativeList.js';
import '../../styles/styles.css'
import { SongsCounter } from '../SongsCounter/SongsCounter.js';

const GraphAndRepresentatives = ({ identifier, links, nodes, representativesData, simplifiedGraph, handleEdgeClick, isLoading, songsNum }) => {
    let representatives = representativesData.map(info => { return { "chords": info[0], "author": info[1], "songName": info[2], "romanChords": info[3], "songid": info[4], "place": info[5] } });
    return <div className='graphAndRepresentatives'>
        <D3Visualization
            links={links}
            nodes={nodes}
            identifier={identifier}
            handleEdgeClick={handleEdgeClick}
        />
        <SongsCounter cluster={identifier} songsNum={songsNum} />
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <RepresentativeList representatives={representatives} simplifiedGraph={simplifiedGraph} />
                </div>
            )}
        </div>
    </div>
}

export default GraphAndRepresentatives;