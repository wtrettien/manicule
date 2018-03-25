import React from 'react'
import PropTypes from 'prop-types'
import jsPlumb from 'jsplumb'

import { debounce } from 'underscore'

import { Grid, Row, Col, Button, Panel } from 'react-bootstrap'
import SiteContainer from '../SiteContainer'

import Quire from '../../components/quire'

import { metadata, getPageData } from '../../utils/metadata'

const j = jsPlumb.jsPlumb

export default class Structure extends React.Component {

  constructor(props) {
    super(props)
    this.structure = metadata[props.edition].structure

    // Generate some unique keys for the quires
    this.structure.quire.forEach((q) => { q.key = Math.random() }) // eslint-disable-line no-param-reassign

    this.pageData = getPageData(props.edition)

    this.onRender = this.onRender.bind(this)
    this.onFlip = this.onFlip.bind(this)

    this.j = jsPlumb.jsPlumb
    j.setContainer(document.getElementById('app'))
    j.importDefaults({
      ConnectionsDetachable: false,
    })

    this.reRender = debounce(() => {
      this.onRender()
      j.repaintEverything()
    }, 100)

    window.setTimeout(this.onRender, 100)
    this.state = {
      face: 'recto',
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.reRender)
  }

  componentDidUpdate() {
    this.j.reset()
    this.reRender()
  }
  componentWillUnmount() {
    this.j.reset()
    window.removeEventListener('resize', this.reRender)
  }

  onFlip() {
    this.setState({
      face: this.state.face === 'recto' ? 'verso' : 'recto',
    })
  }
  onRender() {
    const index = this.state.face === 'recto' ? 0 : 1

    window.requestAnimationFrame(() => {
      const quires = this.structure.quire
      quires.forEach((quire) => {
        quire.leaf.forEach((leaf) => {
          const conjoined = quire.leaf.filter((l) => (
            l.$.conjoin === leaf.$.n && parseInt(leaf.$.n, 10) < parseInt(l.$.n, 10)
          ))
          if (conjoined.length > 0) {
            this.drawConjoined(index, leaf, conjoined)
          } else {
            const page = leaf.page[index].$.index
            const data = this.pageData[page]
            if (data.signatures.includes('insertion')) {
              this.drawInsertion(page)
            }
          }
        })
      })
    })
  }

  // Draw an insertion line at a given point
  drawInsertion(page, length = 45, width = 86) {
    const pageEl = document.getElementById(`page-${page}`)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.classList.add('insertion-line')
    svg.setAttribute('width', width)
    svg.setAttribute('height', length)
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    marker.innerHTML = `<marker id="triangle"
    viewBox="0 0 10 10"
    markerWidth="7" markerHeight="7" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
    <path d="M0,0 L0,6 L9,3 z" />
    </marker>`
    svg.appendChild(marker)
    pageEl.parentNode.appendChild(svg)

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', width / 2)
    line.setAttribute('x2', width / 2)
    line.setAttribute('y2', length)
    svg.appendChild(line)
  }

  drawConjoined(index, leaf, conjoined) {
    // Get the leaf and its conjoined
    const page = leaf.page[index].$.index
    const conjoinedPage = conjoined[0].page[index].$.index
    const pageHtml = document.getElementById(`page-${page}`)
    const conjoinedHtml = document.getElementById(`page-${conjoinedPage}`)

    // Curviness is a function of the distance between the two pages, where
    // closer pages have a shallower arc
    const curviness = 50 - ((page - conjoinedPage) * 10)

    this.j.connect({
      // Target/source swapped for animation
      target: pageHtml.id,
      source: conjoinedHtml.id,
      connector: ['Bezier', { curviness }],
      endpointStyle: { radius: 0 },
      anchors: ['TopCenter', 'TopCenter'],
    })
  }

  // Return an English-language representation of the structure
  describeQuire(quire) {
    const folios = quire.leaf.length
    let inserts = 0

    quire.leaf.forEach((leaf) => {
      leaf.page.forEach((page) => {
        if (this.pageData[page.$.index].signatures.includes('insertion')) {
          inserts += 1
        }
      })
    })
    // Divide the number of inserts by 2 because each page is counted twice
    inserts /= 2

    return (<p>
      Contains {folios} folio{folios >= 2 ? 's' : ''}
      { inserts > 0 ? ` and ${inserts} insertion${inserts > 1 ? 's' : ''}` : ''}
    </p>)
  }
  render() {
    const quires = this.structure.quire

    return (<SiteContainer>
      <div className="structure">
        <Grid>
          <Row>
            <Col md={10}></Col>
            <Col md={2}>
              <Panel bsClass="structure-nav">
                <Button onClick={this.onFlip}>Showing {this.state.face} side</Button>
              </Panel>
            </Col>
          </Row>

          {
          quires.map((quire, index) => (<Row key={quire.key} id={`row-${index}`}>
            <Col md={2}>
              <h3>Quire: {quire.$.n}</h3>
              {this.describeQuire(quire)}
            </Col>
            <Col md={8} >
              <Quire quire={quire} edition={this.props.edition} face={this.state.face} />
            </Col>
          </Row>))
        }
        </Grid>
      </div>
    </SiteContainer>)
  }
}

Structure.propTypes = {
  edition: PropTypes.string.isRequired,
}

