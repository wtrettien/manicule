import React from 'react'
// import { Motion, spring, presets } from 'react-motion'

import { Well, ButtonGroup } from 'react-bootstrap'

import Thumbnail from './thumbnail'
import { EditionName, Page } from '../utils/metadata'
import { pageDir } from './reader'
import styles from '../styles/Nav.module.css'

const OFFSET_SPEED = 400 // Pixels by which the filmstrip nav will slide on each keypress

interface NavStripProps {
    page: number
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

        const { page } = props
        const before = Array.from(
            { length: page - 1 },
            (v, k) => props.pages[page - 1 - k]
        ).reverse()

        const after = Array.from(
            { length: props.pages.length - page - 2 },
            (v, k) => props.pages[page + 2 + k]
        )
        const current = [props.pages[page]]
        if (props.pages[page + 1]) {
            // Is there one more page? If so add it to the current spread
            current.push(props.pages[page + 1])
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
            offset: this.computeCenteredPage(this.props.page)
        })
    }
    UNSAFE_componentWillReceiveProps(newProps: NavStripProps) {
        this.setState({
            offset: this.computeCenteredPage(newProps.page),
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
    computeCenteredPage(page: number) {
        // Take the natural horizontal position of the current page element...
        const currentThumbnail = document.getElementsByClassName(
            `.thumbnail-${page + 1}`
        )[0] as HTMLElement
        if (currentThumbnail) {
            const offset = currentThumbnail.offsetLeft
            const group = document.getElementsByClassName(styles.navGroup)[0] as HTMLElement
            return offset - group.clientWidth / 2
        }
        return -1
    }

    render() {
        return (
            <div className={styles.navStripContainer}>
                {this.props.page > 1 && (
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
                <Well bsClass={styles.navGroup}>
                    <NavGroup data={this.state.items} page={this.props.page} />
                </Well>
                {this.props.page < this.state.items.length && (
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
    <div className={`${styles.navStripButton} ${dir === 'next' ? styles.next : styles.prev}`}>
        <div
            role="link"
            tabIndex={0}
            className={styles.button}
            onMouseDown={() => onTriggerScroll(dir)}
            onMouseUp={onTriggerEnd}>
            {dir === 'prev' ? '≪' : '≫'}
        </div>
    </div>
)

interface NavGroupProps {
    data: any
    page: number
}
const NavGroup = ({ data, page }: NavGroupProps) => (
    <ButtonGroup>
        {data.map((p: any) => (
            <Thumbnail pageData={p} page={page} key={p.index} />
        ))}
    </ButtonGroup>
)

export default NavStrip
