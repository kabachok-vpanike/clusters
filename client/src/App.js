import React, { useEffect, useState } from 'react';
import FilterSelect from './components/FilterSelect/FilterSelect.js';
import FilterSlider from './components/FilterSlider/FilterSlider.js';
import { generateProbabilityOptions, generateClusterNumOptions, loadData, createGraph, generateChordsNumOptions } from './utils/helpers.js';
import GraphAndRepresentatives from './components/GraphAndRepresentatives/GraphAndRepresentatives.js';
import { possibleChords } from './constants/constants.js';
// import { fetchData } from './utils/fetchData.js';
import { sendDataToServer } from './utils/sendDataToServer.js';
import { SearchBar } from './components/SearchBar/SearchBar.js';
// import PCAEmbedding from './components/D3Embedding.js';
import TSNEScatterPlot from './components/D3VisualizationChords.js'

const App = () => {

  const [isLoading, setIsLoading] = useState(null);
  const [isLoadingAllSongs, setIsLoadingAllSongs] = useState(null);
  const [clusterNum, setClusterNum] = useState(4);
  const [probability, setProbability] = useState(0.35);
  const [chordsNum, setChordsNum] = useState(0);
  const [songsNum, setSongsNum] = useState({});
  const [data, setData] = useState({ links: {}, nodes: {}, simplifiedGraph: {}, representativeData: [] });


  useEffect(() => {
    loadData().then(graphData => {
      let { links, nodes, simplifiedGraph } = createGraph({ clusters: graphData[`${clusterNum}`][0], possibleChords: possibleChords, probability: probability })
      setData({ links: links, nodes: nodes, simplifiedGraph: simplifiedGraph, representativeData: graphData[`${clusterNum}`][1] });
      setSongsNum({ ...graphData[`${clusterNum}`][2], "all": Object.values(graphData[`${clusterNum}`][2]).reduce((accumulator, currentValue) => accumulator + currentValue, 0) })
      console.log(graphData[`${clusterNum}`][1])
    })
  }, [clusterNum, probability]);

  const handleProbabilityChange = (value) => {
    setProbability(value === '0' ? '0.0' : value);
  };

  const handleClusterNumChange = (value) => {
    setClusterNum(value);
  };

  const handleChordsNumChange = (value) => {
    setChordsNum(value);
  };

  const handleSearch = (query) => {
    alert(`Search query: ${query}`);
  };

  const handleEdgeClick = async (identifier, args) => {
    setIsLoading(identifier);
    // const apiUrl = `/api/data`;
    args['cluster'] = +identifier;
    args['numberOfClusters'] = clusterNum;
    args['numberOfChords'] = chordsNum;
    args['queryType'] = "getTransitionRelatedSongs";
    console.log(args);
    const responseData = await sendDataToServer(args);
    const formattedResponse = responseData.map((value, index) => [responseData[index]['rawChords'], responseData[index]['artist'], responseData[index]['title'], responseData[index]['romanChords']]);
    console.log("got:", formattedResponse);
    identifier = parseInt(identifier, 10);
    setData(prevData => {
      const updatedRepresentativeData = prevData.representativeData.map((item, idx) => {
        if (idx === identifier) {
          console.log(item);
          return { ...item, [probability]: formattedResponse };
        }
        return item;
      });
      return {
        ...prevData,
        representativeData: updatedRepresentativeData,
      };
    });
    setIsLoading(null);
  };

  const handleOptionClick = async (artist) => {
    setIsLoadingAllSongs(true);
    // alert(artist);
    let args = {};
    args['queryType'] = "getArtistSongs";
    args['artist'] = artist;
    const responseData = await sendDataToServer(args);
    console.log(responseData);
    let formatted = {}
    for (let entry of responseData) {
      let cluster = entry['clusters'][clusterNum - 1];
      if (!(cluster in formatted)) {
        formatted[cluster] = [[entry['rawChords'], entry['artist'], entry['title'], entry['romanChords'], entry['songID'], entry['placeInCluster'][clusterNum][Math.round(probability / 0.05)]]];
      }
      else {
        formatted[cluster].push([entry['rawChords'], entry['artist'], entry['title'], entry['romanChords'], entry['songID'], entry['placeInCluster'][clusterNum][Math.round(probability / 0.05)]]);
      }
    }

    for (let cluster in formatted) {
      formatted[cluster].sort((a, b) => {
        return a[a.length - 1] - b[b.length - 1];
      });
    }

    for (const [cluster, formattedSongs] of Object.entries(formatted)) {
      let identifier = +cluster;
      setData(prevData => {
        const updatedRepresentativeData = prevData.representativeData.map((item, idx) => {
          if (idx === identifier) {
            console.log(item);
            return { ...item, [probability]: formattedSongs };
          }
          return item;
        });
        return {
          ...prevData,
          representativeData: updatedRepresentativeData,
        };
      });
    }
    setIsLoadingAllSongs(null);
  }

  /*
  let identifier = 0;
  setData(prevData => {
    const updatedRepresentativeData = prevData.representativeData.map((item, idx) => {
      if (idx === identifier) {
        console.log(item);
        return { ...item, [probability]: ' ' };
      }
      return item;
    });
    return {
      ...prevData,
      representativeData: updatedRepresentativeData,
    };
  });*/




  return (
    <div>
      <TSNEScatterPlot />
      <SearchBar onSearch={handleSearch} onOptionClick={handleOptionClick} />

      <div className='filters'>
        <FilterSlider
          jsonData={{
            id: 'probability',
            name: 'Transition probability',
            defaultValue: probability,
            options: generateProbabilityOptions(),
            step: 0.05,
            float: true
          }}
          onChange={e => handleProbabilityChange(e)}
        />
        {false && <FilterSlider
          jsonData={{
            id: 'chordsnum',
            name: 'Number of chords',
            defaultValue: 0,
            options: generateChordsNumOptions(),
            step: 10,
            float: false
          }}
          onChange={e => handleChordsNumChange(e)}
        />}
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
      <p className='totalSongsCounter'>Total number of songs: <span style={{ marginLeft: 8, fontWeight: 500 }}>{songsNum['all']}</span></p>
      <div className='graphAndRepresentativesView'>
        {data.representativeData[0] && Object.keys(data.links).map((key) => (
          <GraphAndRepresentatives
            key={key}
            identifier={key}
            links={data.links[key]} nodes={data.nodes[key]}
            representativesData={data.representativeData[key][probability]}
            simplifiedGraph={data.simplifiedGraph[key]}
            isLoading={isLoading === key || isLoadingAllSongs}
            handleEdgeClick={handleEdgeClick}
            songsNum={songsNum}
          />
        ))}
      </div>


    </div>
  );
};

export default App;
