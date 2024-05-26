import React from 'react';
import MoreButton from '../MoreButton/MoreButton.js';
import '../../styles/styles.css'
const GenerateRomanChordsSequence = ({ chords, simplifiedGraph }) => {
  if (chords.length === 0) return null;
  const chordsWithArrows = chords.map((chord, idx) => {
    if (idx === 0) {
      return <span style={{ fontSize: 24 }} key={`chord-${idx}`}>{chord}</span>;
    }
    const graphValue = simplifiedGraph[`${chords[idx - 1]} ${chords[idx]}`]
    const probability = graphValue ? parseFloat(simplifiedGraph[`${chords[idx - 1]} ${chords[idx]}`]) : 0;
    const opacity = [0.2, 0.4, 0.6, 0.8, 1][Math.min(Math.floor(probability * 5), 4)]
    return (
      <React.Fragment key={`fragment-${idx}`}>
        <span style={{ opacity: opacity, fontSize: 30, overflowWrap: 'break-word' }}>
          {probability > 0 ? "\u00A0→\u00A0" : "\u00A0\u00A0\u00A0"}
        </span>
        <span style={{ fontSize: 24 }}>{chord}</span>
      </React.Fragment>
    );
  });

  return <p>{chordsWithArrows}</p>;
}

const RepresentativeList = ({ representatives, simplifiedGraph }) => {
  return (
    <ol className="infoUnderCluster">
      {representatives.map((item, index) => (
        <li key={index}>
          <div>
            <p className="authorAndSong">
              <span style={{ fontWeight: '500', marginRight: '8px', fontSize: '24px' }}>
                {item.place ? `${item.place}.` : `${index + 1}.`}
              </span>
              {item.author} — {item.songName}</p>

            {/* Assuming GenerateRomanChordsSequence is a React component */}
            <div style={{ marginRight: 32 }}>
              <GenerateRomanChordsSequence chords={item.romanChords} simplifiedGraph={simplifiedGraph} />
            </div>
          </div>
          {/* Assuming GenerateMore is a React component */}
          <MoreButton id={'randomid'} textToShow={item.chords} />
        </li>
      ))}
    </ol>
  );
};

export default RepresentativeList;
