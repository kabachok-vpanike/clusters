import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import '../styles/styles.css'
import { playChordFromRomanNumeral } from '../utils/romanNumeralsByChord.js';

const createD3Visualization = (svgRef, links, nodes, identifier, handleEdgeClick) => {

    const strokeWidthScale = d3.scaleQuantize()
        .domain([0, 1])
        .range([2, 4, 6, 8, 10]);

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    svg.append("defs").selectAll("marker")
        .data(["arrowhead"])
        .enter().append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "#cbcbcb")
        .attr("d", "M0,-5L10,0L0,5");



    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("stroke", "black")
        .attr("stroke-width", d => strokeWidthScale(d.weight))
        .attr("fill", "none")
        .attr("marker-end", "url(#arrowhead)")
        .each(function () {
            d3.select(this).attr("data-original-stroke-width", d => strokeWidthScale(d.weight));
            this.stroke = "black";
        });

    const invisibleLink = svg.append("g")
        .attr("class", "invisible-links")
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("stroke", "transparent") 
        .attr("stroke-width", d => strokeWidthScale(d.weight) + 30) 
        .attr("fill", "none")
        .style("pointer-events", "stroke")
        .on("mouseover", function (event, d, i) {
            const index = links.findIndex(link => link === d);
            svg.selectAll(".links path")
                .filter((data, i) => i === index)
                .transition()
                .duration(150)
                .attr("stroke-width", d => strokeWidthScale(d.weight) + 3);
        })
        .on("mouseout", function (event, d, i) {
            const index = links.findIndex(link => link === d);

            svg.selectAll(".links path")
                .filter((data, i) => i === index)
                .transition()
                .duration(150)
                .style("stroke", d => d.stroke)
                .attr("stroke-width", d => strokeWidthScale(d.weight));
        });

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node");

    node.append("circle")
        .attr("r", 30)
        .attr("fill", "#ADD8E6")
        .attr("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 32)
                .attr("fill", "#6495ED");
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 30)
                .attr("fill", "#ADD8E6");
        });

    node.append("text")
        .attr("class", "node-text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .text(d => d.name);


    const simulation = d3.forceSimulation(nodes)
        .velocityDecay(0.2)
        .force("link", d3.forceLink(links).id(d => d.id).distance(250).strength(0.1))
        .force("invisibleLink", d3.forceLink(invisibleLink).id(d => d.id).distance(250).strength(0.1))
        .force("charge", d3.forceManyBody()
            .strength(-50)
            .distanceMax(350))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(function (d) { return d.radius + d.radius / 2; }));


    simulation.on("tick", () => {
        link.attr("d", function (d) {
            var dx = (d.target.x - d.source.x),
                dy = (d.target.y - d.source.y),
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

        link.attr("d", function (d) {

            var pl = this.getTotalLength(),
                r = (32) + 10,
                m = this.getPointAtLength(pl - r);

            var dx = m.x - d.source.x,
                dy = m.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);

            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + m.x + "," + m.y;
        });

        invisibleLink.attr("d", function (d) {
            var dx = (d.target.x - d.source.x),
                dy = (d.target.y - d.source.y),
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

        invisibleLink.attr("d", function (d) {

            var pl = this.getTotalLength(),
                r = (32) + 10,
                m = this.getPointAtLength(pl - r);

            var dx = m.x - d.source.x,
                dy = m.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);

            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + m.x + "," + m.y;
        });

        node
            .attr("transform", d => {
                d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
                d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
                return `translate(${d.x}, ${d.y})`;
            });


    });

    const dragstarted = (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    };

    const dragged = (event, d) => {
        d.fx = Math.max(d.radius, Math.min(width - d.radius, event.x));
        d.fy = Math.max(d.radius, Math.min(height - d.radius, event.y));
    };

    const dragended = (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.on('click', async (event, d) => {
        d3.select(event.target).attr("fill", "#e6bbad");

        const revertColorTimeout = setTimeout(() => {
            d3.select(event.target).attr("fill", "#ADD8E6");
        }, 750);

        playChordFromRomanNumeral(d.name);
        return () => clearTimeout(revertColorTimeout);
    });

    let selectedEdgeId = null;

    function updateEdgeStyles() {
        d3.selectAll('.links path')
            .style('stroke', d => d.stroke);
    }

    link.on("click", async (event, d) => {
        await handleEdgeClick(identifier, { "chordFrom": d.source.name, "chordTo": d.target.name });
    });

    invisibleLink.on("click", function (event, d) {
        event.preventDefault();

        const index = links.findIndex(link => link === d);

        const visibleLink = svg.selectAll(".links path").nodes()[index];
        if (visibleLink) {
            visibleLink.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }
    });


    link.on("mouseover", function () {
        const originalStrokeWidth = parseFloat(d3.select(this).attr("data-original-stroke-width"));
        d3.select(this).transition()
            .duration(20)
            .attr("stroke-width", originalStrokeWidth + 1);
    }).on("mouseout", function () {
        const originalStrokeWidth = parseFloat(d3.select(this).attr("data-original-stroke-width"));
        d3.select(this).transition()
            .duration(200)
            .attr("stroke-width", originalStrokeWidth);
    });

    /*
        node.on('click', async (event, d) => {
            const element = d3.select(event.target);
            const currentColor = element.attr('fill');
            element.attr('fill', 'red');
    
            setTimeout(() => {
                if (document.body.contains(event.target)) {
                    element.attr('fill', currentColor);
                }
            }, 1000);
            playChordFromRomanNumeral(d.name);
        });*/
};

const D3Visualization = ({ links, nodes, identifier, handleEdgeClick }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (links && nodes) {
            createD3Visualization(svgRef, links, nodes, identifier, handleEdgeClick);
        }
    }, [links, nodes, identifier, handleEdgeClick]);

    return <svg ref={svgRef} width="600" height="600" />;
};

export default D3Visualization;