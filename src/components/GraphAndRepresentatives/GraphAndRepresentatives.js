import React from 'react';
import D3Visualization from '../D3Visualization';
import RepresentativeList from '../RepresentativeList/RepresentativeList';
import '../../styles/styles.css'

const GraphAndRepresentatives = ({ links, nodes, representativesData, simplifiedGraph }) => {
    let representatives = representativesData.map(info => { return { "chords": info[0], "author": info[1], "songName": info[2], "romanChords": info[3] } });
    return <div className='graphAndRepresentatives'>
        <D3Visualization
            links={links}
            nodes={nodes}
        />
        <RepresentativeList representatives={representatives} simplifiedGraph={simplifiedGraph} />
    </div>
}

export default GraphAndRepresentatives;