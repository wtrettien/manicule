import React from 'react'
import { animated, useSpring } from 'react-spring'

import { ButtonGroup } from 'react-bootstrap'

import { EditionName, Page, PageData } from '../utils/metadata'
import Thumbnail from './thumbnail'
import { pageDir } from './reader'
import styles from '../styles/Nav.module.css'

interface NavStripProps {
    page: number
    pageData: PageData
    edition: EditionName
}

const NavStrip = ({ page, pageData, edition }: NavStripProps) => {
    const onTriggerScroll = () => {}
    const onTriggerEnd = () => {}

    return (
        <div id="nav-strip" className={styles.navStripContainer}>
            {page > 1 && (
                <NavArrow
                    dir="prev"
                    onTriggerScroll={onTriggerScroll}
                    onTriggerEnd={onTriggerEnd}
                />
            )}

            <NavGroup pageData={pageData} page={page} />

            {page < Array.from(pageData.keys()).length && (
                <NavArrow
                    dir="next"
                    onTriggerScroll={onTriggerScroll}
                    onTriggerEnd={onTriggerEnd}
                />
            )}
        </div>
    )
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
    pageData: PageData
    page: number
}
const NavGroup = ({ pageData, page }: NavGroupProps) => {
    const [refs] = React.useState(
        Array.from(pageData.keys()).map(() => React.createRef<HTMLDivElement>())
    )
    const groupRef = React.useRef<HTMLDivElement>(null)
    const [, api] = useSpring(() => ({ from: { y: 0 }, to: { y: 0 } }))

    React.useLayoutEffect(() => {
        let index = -1
        pageData.forEach((p, i) => {
            if (p.index === page) {
                index = i
            }
        })
        const ref = refs[index]

        if (ref.current && groupRef.current) {
            const from = ref.current.getBoundingClientRect().x
            const center = window.innerWidth / 2
            const current = groupRef.current.scrollLeft
            api.start({
                reset: true,
                from: { y: groupRef.current.scrollLeft },
                to: { y: current - (center - from) },
                onChange: (props) => {
                    if (groupRef.current) {
                        groupRef.current.scrollLeft = props.value.y
                    }
                }
            })
        }
    })
    return (
        <animated.div className={styles.navGroup} ref={groupRef}>
            <ButtonGroup>
                {[...pageData.values()].map((p: Page, index: number) => (
                    <Thumbnail page={p} key={p.index} tref={refs[index]} />
                ))}
            </ButtonGroup>
        </animated.div>
    )
}

export default NavStrip
