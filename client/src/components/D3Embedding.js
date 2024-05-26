import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import pcaData from './pca_embedding.json';

const scaleX = 3;
const scaleY = 3;

const createChart = (container, data) => {
    d3.select(container).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 960 * 2 - margin.left - margin.right,
        height = 500 * 2 - margin.top - margin.bottom;
    const svg = d3.select(container)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]).domain(d3.extent(data, d => d.x)).nice();
    const y = d3.scaleLinear().range([height, 0]).domain(d3.extent(data, d => d.y)).nice();

    const dots = chart.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 4)
        .attr('cx', d => x(d.x * scaleX))
        .attr('cy', d => y(d.y * scaleY))
        .style('fill', '#69b3a2')
        .on('click', (event, d) => {
            console.log(`Clicked on ${d.id}`);
        });

    const labels = chart.selectAll('.text')
        .data(data)
        .enter().append('text')
        .attr('x', d => x(d.x * scaleX))
        .attr('y', d => y(d.y * scaleY))
        .text(d => d.artist_and_title)
        .style('font-size', '24px')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden');

    dots.on('mouseover', (event, d) => {
        d3.select(event.currentTarget).style('fill', 'orange');
        labels.style('visibility', ld => (ld.artist_and_title === d.artist_and_title) ? 'visible' : 'hidden');
    })
        .on('mouseout', (event, d) => {
            d3.select(event.currentTarget).style('fill', '#69b3a2');
            labels.style('visibility', 'hidden');
        });

    chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    chart.append('g')
        .call(d3.axisLeft(y));

}


const PCAEmbedding = () => {
    const d3Container = useRef(null);

    useEffect(() => {
        console.log(pcaData);
        if (d3Container.current) {
            createChart(d3Container.current, pcaData);
        }
    }, []);

    return (
        <div>
            <svg className="d3-component" ref={d3Container} />
        </div>
    );
};

export default PCAEmbedding;
