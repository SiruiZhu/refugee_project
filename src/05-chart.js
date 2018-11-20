import * as d3 from 'd3'

var margin = {
  top: 50,
  right: 100,
  bottom: 30,
  left: 30
}

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0.25)

const yPositionScale = d3.scaleLinear().range([height, 0])
const colorScale = d3
  .scaleOrdinal()
  .range(['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8856a7', '#810f7c'])

// var area = d3
//   .area()
//   .x(function(d) {
//     return xPositionScale(d.Year)
//   })
//   .y0(function(d) {
//     console.log(d)
//     return yPositionScale(d.y0)
//   })
//   .y1(function(d) {
//     console.log(d)
//     return yPositionScale(d.y0 + d.y)
//   })
//   .curve(d3.curveCatmullRom)

// Create line function
const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.Year)
  })
  .y(d => {
    return yPositionScale(d.number)
  })

d3.csv(require('./data/continent_year.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log('datapoint look like', datapoints)

  datapoints.forEach(d => {
    d.number = +d.number
  })

  const values = datapoints.map(d => +d.number)
  yPositionScale.domain(d3.extent(values))
  // console.log(values)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.continent
    })
    .entries(datapoints)

  // console.log('nested data look like', nested)

  const years = datapoints.map(function(d) {
    // console.log(d.Year)
    return d.Year
  })
  xPositionScale.domain(years)

  // var stack = d3
  //   .stack()
  //   .keys([
  //     'Aisa',
  //     'Africa',
  //     'Oceania',
  //     'Europe',
  //     'North America',
  //     'South America'
  //   ])
  //   .order(d3.stackOrderInsideOut)
  //   .offset(d3.stackOffsetWiggle)
  // console.log(stack)

  // var stackedSeries = stack(nested)
  // console.log(stackedSeries)

  function tweenDash() {
    var l = this.getTotalLength()

    var i = d3.interpolateString('0,' + l, l + ',' + l)
    return function(t) {
      return i(t)
    }
  }

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('d', d => {
      return line(d.values)
    })
    .attr('class', 'line')
    .attr('id', d => {
      // console.log(d.key.toLowerCase().replace(' ', '') + 'label')
      return d.key.toLowerCase().replace(' ', '')
    })
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .style('visibility', 'hidden')

  function translateAlong(path) {
    var l = path.node().getTotalLength()
    return function(d, i, a) {
      return function(t) {
        var p = path.node().getPointAtLength(t * l)
        return 'translate(' + p.x + ',' + p.y + ')'
      }
    }
  }

  var numberLine = d3.selectAll('.line')
  // add text for each line
  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('y', function(d) {
      // console.log(d.values.slice(-1)[0].number)
      return yPositionScale(d.values.slice(-1)[0].number)
    })
    .attr('x', function(d) {
      // console.log(d.values[4].Year)
      return xPositionScale(d.values.slice(-1)[0].Year)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', d => {
      // console.log(d)
      if (d.key === 'Europe') {
        return -16
      } else if (d.key === 'South America') {
        return -10
      } else if (d.key === 'North America') {
        return -4
      } else if (d.key === 'Oceania') {
        return 0
      } else {
        return 4
      }
    })
    .attr('font-size', '12')
    .attr('fill', 'white')
    .attr('class', d => {
      return d.key.toLowerCase().replace(' ', '')
    })
    .classed('text-label', true)
    .style('visibility', 'hidden')

  // add points for each line
  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 3)
    .attr('cy', function(d) {
      return yPositionScale(d.values.slice(-1)[0].number)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values.slice(-1)[0].Year)
    })
    .attr('class', d => {
      return d.key.toLowerCase().replace(' ', '') + 'circle'
    })
    .classed('circles', true)
    .style('visibility', 'hidden')

  // add rectangle highlight differet period
  let rectWidth = xPositionScale(1991) - xPositionScale(1989)
  svg
    .append('rect')
    .attr('x', xPositionScale(1990))
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#4E4757')
    .attr('opacity', '0.6')
    .attr('class', 'rect-1990')
    .lower()
    .style('visibility', 'hidden')

  let rectWidth2 = xPositionScale(1994) - xPositionScale(1992)
  svg
    .append('rect')
    .attr('x', xPositionScale(1993))
    .attr('y', 0)
    .attr('width', rectWidth2)
    .attr('height', height)
    .attr('fill', ' #4E4757')
    .attr('opacity', '0.6')
    .attr('class', 'rect-1993')
    .lower()
    .style('visibility', 'hidden')

  let rectWidth3 = xPositionScale(2017) - xPositionScale(2015)
  svg
    .append('rect')
    .attr('x', xPositionScale(2015))
    .attr('y', 0)
    .attr('width', rectWidth2)
    .attr('height', height)
    .attr('fill', '#4E4757')
    .attr('opacity', '0.6')
    .attr('class', 'rect-2015')
    .lower()
    .style('visibility', 'hidden')

  // legend part
  svg
    .append('g')
    .attr('class', 'axis axis--y')
    .append('text')
    .attr('x', -26)
    .attr('dy', '-2em')
    .attr('text-anchor', 'start')
    .attr('fill', 'gray')
    .attr('font-size', '12')
    .text('Numbers in 10,000')

  let legend = svg.append('g').attr('transform', 'translate(10, 0)')

  legend
    .selectAll('.legend-entry')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${i * 25})`)
    .attr('class', 'legend-entry')
    .each(function(d) {
      let g = d3.select(this)

      g.append('rect')
        .attr('r', 8)
        .attr('x', 10)
        .attr('y', 0)
        .attr('width', 18)
        .attr('height', 9)
        .attr('fill', colorScale(d.key))

      g.append('text')
        .text(d.key.charAt(0).toUpperCase() + d.key.slice(1))
        .attr('x', 15)
        .attr('y', 5)
        .attr('dx', 17)
        .attr('font-size', 10)
        .attr('fill', 'white')
        .attr('alignment-baseline', 'middle')
    })
    .style('visibility', 'hidden')

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([0, 200, 400, 600, 800, 1000, 1200])
    .tickSize(-width)
    .ticks(6)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
  d3.select('.x-axis .domain').remove()

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickValues([1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015])

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  d3.select('#blank-graph').on('stepin', () => {
    svg.selectAll('.legend-entr').style('visibility', 'hidden')
    svg.selectAll('.line').style('visibility', 'hidden')
    svg.selectAll('.circles').style('visibility', 'hidden')
    svg.selectAll('.text-label').style('visibility', 'hidden')

    svg
      .selectAll('.line')
      .transition()
      .duration(1000)
      .attrTween('stroke-dasharray', tweenDash)
      .style('visibility', 'hidden')
    svg
      .select('.rect-1990')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-1993')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-2015')
      .transition()
      .style('visibility', 'hidden')
  })

  d3.select('#all-line').on('stepin', () => {
    svg
      .selectAll('.line')
      .attr('stroke', d => colorScale(d.key))
      .attr('stroke-width', 2)
      .transition()
      .duration(1000)
      .attrTween('stroke-dasharray', tweenDash)
      .style('visibility', 'visible')
    svg
      .select('.rect-1990')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-1993')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-2015')
      .transition()
      .style('visibility', 'hidden')
    svg.selectAll('.text-label').style('visibility', 'hidden')
    svg.selectAll('.circles').style('visibility', 'hidden')
    svg
      .selectAll('.legend-entry')
      .transition(200)
      .style('visibility', 'visible')
  })

  // step to hightlight Asia
  d3.select('#asia-line').on('stepin', () => {
    // console.log('I am step into asia line')
    svg
      .selectAll('.line')
      .transition()
      .attr('stroke', '#A9A9A9')
    svg.selectAll('.asia').attr('fill', 'white')

    svg
      .selectAll('#asia')
      .transition()
      .attr('stroke', '#f7545d')
      .attr('stroke-width', 3)

    svg
      .select('.rect-1990')
      .transition()
      .style('visibility', 'visible')
    svg
      .select('.rect-1993')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-2015')
      .transition()
      .style('visibility', 'hidden')

    svg.selectAll('.text-label').style('visibility', 'hidden')
    svg
      .selectAll('.asia')
      .style('visibility', 'visible')
      .attr('font-weight', 500)
    svg.selectAll('.circles').style('visibility', 'hidden')
    svg
      .selectAll('.asiacircle')
      .style('visibility', 'visible')
      .attr('fill', '#f7545d')
    svg.selectAll('.legend-entry').style('visibility', 'hidden')
  })

  // step to hightlight Africa
  d3.select('#africa-line').on('stepin', () => {
    // console.log('I am step into africa line')
    svg
      .selectAll('.line')
      .transition()
      .attr('stroke', '#A9A9A9')
      .attr('stroke-width', 2)
    svg
      .select('#africa')
      .transition()
      .attr('stroke', '#f7545d')
      .attr('stroke-width', 3)
    svg
      .select('.rect-1990')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-1993')
      .transition()
      .style('visibility', 'visible')
    svg
      .select('.rect-2015')
      .transition()
      .style('visibility', 'hidden')

    svg.selectAll('.asia').style('visibility', 'hidden')

    svg.selectAll('.text-label').style('visibility', 'hidden')
    svg
      .selectAll('.africa')
      .style('visibility', 'visible')
      .attr('font-weight', 500)
    svg.selectAll('.circles').style('visibility', 'hidden')
    svg
      .selectAll('.africacircle')
      .style('visibility', 'visible')
      .attr('fill', '#f7545d')
    svg.selectAll('.legend-entry').style('visibility', 'hidden')
  })

  // step to 2015 period
  d3.select('#period').on('stepin', () => {
    // console.log('I am step into 2015 period')
    svg
      .selectAll('.line')
      .transition()
      .attr('stroke', d => colorScale(d.key))
      .attr('stroke-width', 2)
    svg
      .select('.rect-1990')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-1993')
      .transition()
      .style('visibility', 'hidden')
    svg
      .select('.rect-2015')
      .transition()
      .style('visibility', 'visible')
    svg.selectAll('.text-label').style('visibility', 'visible')
    svg
      .selectAll('.circles')
      .style('visibility', 'visible')
      .attr('fill', function(d) {
        return colorScale(d.key)
      })
    svg
      .selectAll('.legend-entry')
      .transition(200)
      .style('visibility', 'visible')
  })
}
