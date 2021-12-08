import React from 'react'
// import { Motion, spring, presets } from 'react-motion'

import { Well, ButtonGroup } from 'react-bootstrap'

import Thumbnail from './thumbnail'
import { EditionName, Page } from '../utils/metadata'
import { pageDir } from './reader'

const OFFSET_SPEED = 400 // Pixels by which the filmstrip nav will slide on each keypress

interface NavStripProps {
    currentPage: number
    pages: Page[]
    edition: EditionName
}
interface NavStripState {
    items: any
    offset: number
    lastOffset: number
}

class NavStrip extends React.Component<NavStripProps, NavStripState> {
    public scrollTimeout: number
    public scrollTimer: number
    public scrollCounter: number

    constructor(props: NavStripProps) {
        super(props)

        const { currentPage } = props
        const before = Array.from(
            { length: currentPage - 1 },
            (v, k) => props.pages[currentPage - 1 - k]
        ).reverse()

        const after = Array.from(
            { length: props.pages.length - currentPage - 2 },
            (v, k) => props.pages[currentPage + 2 + k]
        )
        const current = [props.pages[currentPage]]
        if (props.pages[currentPage + 1]) {
            // Is there one more page? If so add it to the current spread
            current.push(props.pages[currentPage + 1])
        }
        let items = before.concat(current)
        if (after) {
            items = items.concat(after)
        }
        this.scrollTimeout = -1
        this.scrollTimer = 100
        this.scrollCounter = -1
        this.state = {
            items,
            offset: 0,
            lastOffset: 0
        }
    }

    componentDidMount() {
        this.setState({
            // eslint-disable-line react/no-did-mount-set-state
            offset: this.computeCenteredPage(this.props.currentPage)
        })
    }
    UNSAFE_componentWillReceiveProps(newProps: NavStripProps) {
        this.setState({
            offset: this.computeCenteredPage(newProps.currentPage),
            lastOffset: this.state.offset
        })
    }

    // onScroll(motion) {
    //     if ($('.nav-group')) {
    //         $('.nav-group').scrollLeft(motion.offset)
    //     }
    //     return null
    // }
    // When the arrow is held, change the offset value
    onTriggerScroll = (dir: pageDir) => {
        let offset = this.state.offset
        if (dir === 'next') {
            offset += OFFSET_SPEED
        } else {
            offset -= OFFSET_SPEED
        }
        this.setState({
            lastOffset: this.state.offset,
            offset
        })
        this.scrollTimeout = window.setTimeout(() => this.onTriggerScroll(dir), this.scrollCounter)
        this.scrollCounter /= 2
    }
    onTriggerEnd = () => {
        clearTimeout(this.scrollTimeout)
        this.scrollCounter = 100
    }
    computeCenteredPage(currentPage: number) {
        // Take the natural horizontal position of the current page element...
        let offset = 100
        const currentThumbnail = document.getElementsByClassName(`.thumbnail-${currentPage + 1}`)[0]
        // if (currentThumbnail.position()) {
        //     offset = currentThumbnail.position().left
        //     offset -= $('.nav-group').width() / 2 // divide the current filmstrip in half
        // }
        return offset
    }

    render() {
        return (
            <div className="nav-strip-container">
                {this.props.currentPage > 1 && (
                    <NavArrow
                        dir="prev"
                        onTriggerScroll={this.onTriggerScroll}
                        onTriggerEnd={this.onTriggerEnd}
                    />
                )}

                {/* <Motion
                    defaultStyle={{ offset: this.state.lastOffset }}
                    style={{ offset: spring(this.state.offset, presets.stiff) }}>
                    {this.onScroll}
                </Motion> */}
                <Well bsClass="nav-group">
                    <NavGroup
                        data={this.state.items}
                        currentPage={this.props.currentPage}
                        edition={this.props.edition}
                    />
                </Well>
                {this.props.currentPage < this.state.items.length && (
                    <NavArrow
                        dir="next"
                        onTriggerScroll={this.onTriggerScroll}
                        onTriggerEnd={this.onTriggerEnd}
                    />
                )}
            </div>
        )
    }
}

interface NavArrowProps {
    dir: pageDir
    onTriggerScroll: any
    onTriggerEnd: any
}
export const NavArrow = ({ dir, onTriggerScroll, onTriggerEnd }: NavArrowProps) => (
    <div className={`nav-strip-button ${dir}`}>
        <div
            role="link"
            tabIndex={0}
            className="button"
            onMouseDown={() => onTriggerScroll(dir)}
            onMouseUp={onTriggerEnd}>
            {dir === 'prev' ? '≪' : '≫'}
        </div>
    </div>
)

interface NavGroupProps {
    data: any
    currentPage: number
    edition: EditionName
}
const NavGroup = ({ data, currentPage, edition }: NavGroupProps) => (
    <ButtonGroup>
        {data.map((p: any) => (
            <Thumbnail pageData={p} currentPage={currentPage} edition={edition} key={p.index} />
        ))}
    </ButtonGroup>
)

export default NavStrip
