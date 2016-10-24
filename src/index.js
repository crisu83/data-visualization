import './index.css'

import rawFriendsData from '@data/friends.json'
import {normalizeFriendsData} from './helpers'

// Bar chart

const drawBarChart = (rawData) => {
  const data = normalizeFriendsData(rawData)

  const margin = {top: 20, right: 20, bottom: 70, left: 40}
  const width = 600 - margin.left - margin.right
  const height = 300 - margin.top - margin.bottom

  const color = d3.scaleOrdinal(d3.schemeCategory20c)

  const x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(.5)
  const y = d3.scaleLinear()
    .range([height, 0])

  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)

  const svg = d3.select('.bar-chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

  x.domain(data.map((d) => d.name))
  y.domain([0, d3.max(data, (d) => d.friends.length)])

  svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
    .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)')

  svg.append('g')
      .style('text-anchor', 'end')
      .call(yAxis)

  svg.selectAll('bar')
      .data(data)
    .enter().append('rect')
      .style('fill', (d, i) => color(i))
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.friends.length))
      .attr('height', (d) => height - y(d.friends.length))
}

// Network chart

const drawNetworkChart = (rawData) => {
  const margin = {top: 0, right: 0, bottom: 0, left: 0}
  const width = 600 - margin.left - margin.right
  const height = 300 - margin.top - margin.bottom

  const svg = d3.select('.network-chart')
    .append('svg')
      .attr('width', width)
      .attr('height', height)

  const color = d3.scaleOrdinal(d3.schemeCategory20c)

  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d) => d.id))
    .force('collide', d3.forceCollide((d) => 13).iterations(16))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

  const link = svg.append('g')
    .selectAll('line')
    .data(rawData.links)
    .enter().append('line')
      .style('stroke', '#000')

  const node = svg.append('g')
    .selectAll('circle')
    .data(rawData.nodes)
    .enter().append('circle')
      .style('stroke', '#000')
      .attr('r', 5)
      .attr('fill', (d, i) => color(i))
      .call(d3.drag()
        .on('start', (d) => dragStarted(d, simulation))
        .on('drag', dragged)
        .on('end', (d) => dragEnded(d, simulation)))

  node.append('title')
    .text((d) => d.name)

  const ticked = () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
  }

  simulation
    .nodes(rawData.nodes)
    .on('tick', ticked)

  simulation
    .force('link')
    .links(rawData.links)

  const dragStarted = (d, simulation) => {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart()
    }

    d.fx = d.x
    d.fy = d.y
  }

  const dragged = (d) => {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  const dragEnded = (d, simulation) => {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }

    d.fx = null
    d.fy = null
  }
}

drawBarChart(rawFriendsData)
drawNetworkChart(rawFriendsData)