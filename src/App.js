import React, { useEffect, useState } from 'react';
import FilterSelect from './components/FilterSelect/FilterSelect';
import { generateProbabilityOptions, generateClusterNumOptions, loadData, createGraph } from './utils/helpers';
import GraphAndRepresentatives from './components/GraphAndRepresentatives/GraphAndRepresentatives';

const App = () => {
  const [clusterNum, setClusterNum] = useState(4);
  const [probability, setProbability] = useState(0.35);
  const [data, setData] = useState({ links: {}, nodes: {}, simplifiedGraph: {}, representativeData: [] });


  useEffect(() => {
    const possibleChords = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'I♯', 'II♯', 'III♯', 'IV♯', 'V♯', 'VI♯', 'VII♯', 'i♯', 'ii♯', 'iii♯', 'iv♯', 'v♯', 'vi♯', 'vii♯', 'I♭', 'II♭', 'III♭', 'IV♭', 'V♭', 'VI♭', 'VII♭', 'i♭', 'ii♭', 'iii♭', 'iv♭', 'v♭', 'vi♭', 'vii♭'];
    loadData().then(graphData => {
      let { links, nodes, simplifiedGraph } = createGraph({ clusters: graphData[`${clusterNum}`][0], possibleChords: possibleChords, probability: probability })
      setData({ links: links, nodes: nodes, simplifiedGraph: simplifiedGraph, representativeData: graphData[`${clusterNum}`][1] });
    })
  }, [clusterNum, probability]);

  const handleProbabilityChange = (value) => {
    setProbability(value === '0' ? '0.0' : value);
  };

  const handleClusterNumChange = (value) => {
    setClusterNum(value);
  };
  return (
    <div>
      <div className='filters'>
        <FilterSelect
          jsonData={{
            id: 'probability',
            name: 'Transition probability',
            defaultValue: probability,
            options: generateProbabilityOptions()
          }}
          onChange={e => handleProbabilityChange(e.target.value)}
        />
        <FilterSelect
          jsonData={{
            id: 'clusternum',
            name: 'Cluster number',
            defaultValue: '4',
            options: generateClusterNumOptions()
          }}
          onChange={e => handleClusterNumChange(e.target.value)}
        />
      </div>
      <div className='graphAndRepresentativesView'>
        {data.representativeData[0] && Object.keys(data.links).map((key) => (
          <GraphAndRepresentatives
            key={key}
            links={data.links[key]} nodes={data.nodes[key]}
            representativesData={data.representativeData[key][probability]}
            simplifiedGraph={data.simplifiedGraph[key]} />
        ))}
      </div>


    </div>
  );
};

export default App;
