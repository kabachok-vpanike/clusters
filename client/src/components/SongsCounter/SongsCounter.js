import React from 'react';
import '../../styles/styles.css';

export const SongsCounter = ({ songsNum, cluster }) => {
    console.log(songsNum)
    return <p className='songsCounter'>{songsNum[cluster]} <span style={{fontWeight: 300, padding: '0 8px'}}>songs</span> ({(songsNum[cluster] / songsNum['all'] * 100).toFixed(2)}%)</p>
}