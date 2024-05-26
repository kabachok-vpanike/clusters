import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import tsneData from './tsne_results.json'; 
import chordData from './MostFrequentChords.json';
import artistGenre from './artist_to_best_genres.json';
import '../styles/styles.css';


const shapeFunctions = {
    "rock": d3.symbol().type(d3.symbolCircle).size(150),
    "pop": d3.symbol().type(d3.symbolDiamond).size(150),
    "pop rock": d3.symbol().type(d3.symbolTriangle).size(150),
    "country": d3.symbol().type(d3.symbolSquare).size(150),
    "alternative rock": d3.symbol().type(d3.symbolStar).size(150),
    "russian": d3.symbol().type(d3.symbolCross).size(150),
    "gospel": d3.symbol().type(d3.symbolWye).size(150),
    "Other": d3.symbol().type(d3.symbolCircle).size(10)
};

function getShape(artist) {
    if (artistGenre[artist] && artistGenre[artist]["best_genre"]) {
        const genre = artistGenre[artist]["best_genre"];
        return shapeFunctions[genre] ? shapeFunctions[genre]() : shapeFunctions["Other"]();
    } else {
        return shapeFunctions["Other"]();
    }
}



const formatTooltipContent = (artistData) => {
    console.log(artistData)
    const chordProgressionsArray = Object.keys(artistData).map(key => ({
        chords: JSON.parse(key).join(" "),
        probability: artistData[key].toFixed(1)
    }));
    const sortedChordProgressions = chordProgressionsArray.sort((a, b) => b.probability - a.probability);
    const topChordProgressions = sortedChordProgressions.slice(0, 10);

    const formattedChordProgressions = topChordProgressions.map(cp => {
        return `<tr><td style="font-weight:500">${cp.chords}</td><td>&nbsp;</td><td style="font-weight:500">${cp.probability}</td></tr>`;
    });

    return `<table><tbody>${formattedChordProgressions.join("")}</tbody></table>`;
};

const format_genres = (genres) => {
    console.log(genres);
    return genres.join('; ');
}

const TSNEScatterPlot = () => {
    const svgRef = useRef();
    const [visualType, setVisualType] = useState('t-SNE');
    const [category, setCategory] = useState('major');
    const [length, setLength] = useState('1');
    const [data, setData] = useState(tsneData[visualType][category][length]);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const uniqueGenres = [
        ["rock", 143],
        ["pop rock", 100],
        ["pop", 90],
        ["alternative rock", 69],
        ["country", 37],
        ["american", 33],
        ["indie rock", 31],
        ["british", 31],
        ["hard rock", 29],
        ["folk", 29],
        ["folk rock", 28],
        ["russian", 26],
        ["pop punk", 26],
        ["punk rock", 25],
        ["soft rock", 25],
        ["2008 universal fire victim", 24],
        ["punk", 23],
        ["power pop", 22],
        ["singer/songwriter", 21],
        ["dance-pop", 20],
        ["classic rock", 20],
        ["indie pop", 19],
        ["electropop", 18],
        ["country pop", 18],
        ["blues rock", 16],
        ["2010s", 16],
        ["art rock", 15],
        ["acoustic rock", 15],
        ["country rock", 15]
    ]


    useEffect(() => {
        if (tsneData[visualType] && tsneData[visualType][category] && tsneData[visualType][category][length]) {
            setData(tsneData[visualType][category][length]);
        }
    }, [visualType, category, length]);

    useEffect(() => {
        drawScatterPlot(data);
    }, [data]);

    useEffect(() => {
        if (data.length > 0) {
            drawScatterPlot(data);
        }
    }, [data, selectedGenre]);

    const drawScatterPlot = (data) => {
        const svg = d3.select(svgRef.current);
        const width = 1400;
        const height = 800;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        svg.selectAll("*").remove();

        const filteredData = selectedGenre === 'All' ? data : data.filter(d => artistGenre[d.artist]?.["all_genres"] && artistGenre[d.artist]["all_genres"].includes(selectedGenre));

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.x))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.y))
            .range([height - margin.bottom, margin.top]);

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', '#fff')
            .style('border', '1px solid #999')
            .style('padding', '10px')
            .style('display', 'none');


        const points = svg.append('g')
            .selectAll('path')
            .data(filteredData)
            .enter()
            .append('path')
            .attr('d', d => getShape(d.artist))
            .attr('transform', d => `translate(${x(d.x)}, ${y(d.y)})`)
            .attr('fill', 'blue')
            .on('mouseover', (event, d) => {
                console.log(chordData[d.artist])
                tooltip.style('display', 'block');
                tooltip.style('width', '160px');
                tooltip.html(`<b>${d.artist}</b><br>
                <i style="word-wrap: break-word; max-width: 160px;">${artistGenre[d.artist] && artistGenre[d.artist]["all_genres"]
                        ? format_genres(artistGenre[d.artist]["all_genres"]) : "Unknown genre"}</i><br />&nbsp;<br />
                 ${chordData[d.artist] && chordData[d.artist][category]
                        && chordData[d.artist][category][length]
                        ? formatTooltipContent(chordData[d.artist][category][length]) : ""}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.style('display', 'none');
            });

        const labels = svg.append('g')
            .selectAll('text')
            .data(filteredData)
            .enter()
            .append('text')
            .attr('x', d => x(d.x) + 10)
            .attr('y', d => y(d.y))
            // .text(d => d.artist) 
            .attr('font-size', '12px')
            .attr('alignment-baseline', 'middle')
            .style("pointer-events", "none");

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    };

    return <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div style={{ width: '200px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "red" }}>
                <label>
                    <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} style={{minWidth: '324px', fontSize: '20px', padding: '4px 8px'}}>
                        <option value="All">All</option>
                        {uniqueGenres.map(genre => (
                            <option key={genre[0]} value={genre[0]}>{genre[0]} {`(${genre[1]})`}</option>
                        ))}
                    </select>
                </label>
                <div className='secondRowOptions' style={{ display: 'flex', flexDirection: 'row', backgroundColor: "yellow"}}>
                    <select value={visualType} onChange={e => { setVisualType(e.target.value) }}>
                        <option value="t-SNE">t-SNE</option>
                        <option value="UMAP">UMAP</option>
                    </select>
                    <select value={category} onChange={e => { setCategory(e.target.value) }}>
                        <option value="minor">Minor</option>
                        <option value="major">Major</option>
                        <option value="all">All</option>
                    </select>
                    <select value={length} onChange={e => { setLength(e.target.value) }}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            </div>
        </div>
        <svg ref={svgRef} width={1500} height={900} style={{ border: '1px solid black' }} />;
    </div>
};

export default TSNEScatterPlot;
