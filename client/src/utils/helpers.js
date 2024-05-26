export const generateProbabilityOptions = () => {
  let options = [];
  for (let i = 0.0; i <= 1; i += 0.05) {
    let val = Math.round((i + Number.EPSILON) * 100) / 100;
    options.push({ value: val, text: `> ${val}` });
  }
  return options;
};

export const generateClusterNumOptions = () => {
  let options = [];
  for (let i = 1; i <= 10; i++) {
    options.push({ value: i, text: i.toString() });
  }
  return options;
};

export const generateChordsNumOptions = () => {
  let options = [];
  for (let i = 0; i <= 10; i++) {
    options.push({ value: i * 10, text: `> ${(i * 10).toString()}` });
  }
  return options;
};

export const loadData = async () => {
  try {
    const response = await fetch('/everyClustersGraph.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading the JSON file:', error);
  }
};

export const createGraph = ({ clusters, probability, possibleChords }) => {
  let stepCnt = 0;
  let links = {};
  let nodes = {};
  let simplifiedGraph = {};
  for (let cluster of clusters) {
    if (Object.keys(cluster).length === 0) continue;
    let nodeIds = new Set();
    for (const [chordFrom, chordsTo] of Object.entries(cluster)) {
      for (let [chordTo, weight] of chordsTo) {
        if (weight <= probability) continue;
        nodeIds.add(possibleChords.indexOf(chordFrom));
        nodeIds.add(possibleChords.indexOf(chordTo));
        if (!simplifiedGraph[stepCnt]) {
          simplifiedGraph[stepCnt] = {};
        }
        simplifiedGraph[stepCnt][`${chordFrom} ${chordTo}`] = weight;
        if (!links[stepCnt]) {
          links[stepCnt] = [];
        }
        links[stepCnt].push({ source: possibleChords.indexOf(chordFrom), target: possibleChords.indexOf(chordTo), weight: weight })
      }
    }
    if (nodeIds.size) {
      nodeIds = Array.from(nodeIds);
      nodes[stepCnt] = nodeIds.map(function (d) { return { name: possibleChords[d], id: d, radius: 30 }; });
    }
    stepCnt += 1;
  }
  return { links, nodes, simplifiedGraph };

}
