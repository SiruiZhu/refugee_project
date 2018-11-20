import * as d3 from 'd3'
var margin = {
  top: 50,
  right: 20,
  bottom: 30,
  left: 50
}

let height = 400 - margin.top - margin.bottom

let width = 800 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0.25)

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 8000])
  .range([height, 0])

const colorScale = d3.scaleOrdinal().range(['#3182bd', '#9ecae1'])

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

d3.csv(require('./data/refugee_track_number.csv'))
  .then(ready)
  .catch(function(err) {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  // console.log(datapoints)

  const years = datapoints.map(function(d) {
    // console.log(d.Year)
    return d.Year
  })

  xPositionScale.domain(years)

  svg
    .selectAll('.track-graph')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => xPositionScale(d.Year))
    .attr('y', d => yPositionScale(d.track_number))
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => height - yPositionScale(d.track_number))
    .attr('fill', '#b379ce')
    .attr('id', function(d, i) {
      return 'Year' + i
    })
    .on('mousemove', function(d) {
      div
        .html('Year: ' + d.Year + '<br>' + 'Track number is: ' + d.track_number)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
        .style('display', 'block')
    })
    .on('mouseover', function(d, i) {
      div.transition().style('opacity', 0.9)
      div
        .html('Year: ' + d.Year + '<br>' + 'Track number is: ' + d.track_number)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')

      d3.select('#Year' + i)
        .transition()
        .style('stroke', 'white')
        .style('stroke-width', 1.8)
    })
    .on('mouseout', function(d, i) {
      div.transition().style('opacity', 0)
      d3.select('#Year' + i)
        .transition()
        .style('stroke', 'none')
        .style('stroke-width', 0)
    })

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickValues([1975, 1985, 1995, 2005, 2015])

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}

  function topFunction() {
        // console.log('GOT CLICKED')
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
      }

d3.select('#myBtn').on('click', topFunction)
