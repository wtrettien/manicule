import React from 'react'
import PropTypes from 'prop-types'
import jsPlumb from 'jsplumb'

import { debounce } from 'underscore'

import { Grid, Row, Col, Button, Panel } from 'react-bootstrap'
import SiteContainer from '../SiteContainer'

import Quire from '../../components/quire'

import { metadata } from '../../utils/metadata'

const j = jsPlumb.jsPlumb
j.setContainer(document.getElementById('page-container'))
j.importDefaults({
  ConnectionsDetachable: false,
})

export default class Structure extends React.Component {

  constructor(props) {
    super(props)
    this.structure = metadata[props.edition].structure
    // Generate some unique keys for the quires
    this.structure.quire.forEach((q) => { q.key = Math.random() }) // eslint-disable-line no-param-reassign

    this.onRender = this.onRender.bind(this)
    this.onFlip = this.onFlip.bind(this)

    this.reRender = debounce(() => {
      this.onRender()
      j.repaintEverything()
    }, 100)

    window.setTimeout(this.onRender, 200)
    this.state = {
      face: 'recto',
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.reRender)
  }

  componentDidUpdate() {
    j.reset()
    this.reRender()
  }
  componentWillUnmount() {
    j.reset()
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
            // Get the leaf and its conjoined
            const page = leaf.page[index].$.index
            const conjoinedPage = conjoined[0].page[index].$.index
            const pageHtml = document.getElementById(`page-${page}`)
            const conjoinedHtml = document.getElementById(`page-${conjoinedPage}`)

            j.connect({
              // Target/source swapped for animation
              target: pageHtml.id,
              source: conjoinedHtml.id,
              connector: 'Bezier',
              endpointStyle: { radius: 125 },
              anchors: ['TopCenter', 'TopCenter'],
            })
          }
        })
      })
    }, 1009)
  }


  render() {
    const quires = this.structure.quire

    return (<SiteContainer>
      <Panel bsClass="structure-nav">
        <Button onClick={this.onFlip}>Showing {this.state.face} side</Button>
      </Panel>

      <Grid>
        {
          quires.map((quire) => (<Row key={quire.key}>
            <Col>
              <Quire quire={quire} edition={this.props.edition} face={this.state.face} />
            </Col>
          </Row>))
        }
      </Grid>
    </SiteContainer>)
  }
}

Structure.propTypes = {
  edition: PropTypes.string.isRequired,
}

