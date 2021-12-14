import React from 'react'
import { animated, SpringRef, useSpring } from 'react-spring'

import { ButtonGroup } from 'react-bootstrap'

import { Page, PageData } from '../utils/metadata'
import Thumbnail from './thumbnail'
import { pageDir } from './reader'
import styles from '../styles/Nav.module.css'

interface NavStripProps {
    page: number
    pageData: PageData
}
type Dir = 'next' | 'prev'

const NavStrip = ({ page, pageData }: NavStripProps) => {
    const groupRef = React.useRef<HTMLDivElement>(null)
    const [, api] = useSpring(() => ({ from: { y: 0 }, to: { y: 0 } }))

    const onTriggerScroll = (dir: Dir) => {
        if (groupRef.current) {
            const center = window.innerWidth / 2
            const current = groupRef.current.scrollLeft
            api.start({
                reset: true,
                from: { y: groupRef.current.scrollLeft },
                to: { y: dir === 'prev' ? current - center : current + center },
                onChange: (props) => {
                    if (groupRef.current) {
                        groupRef.current.scrollLeft = props.value.y
                    }
                }
            })
        }
    }

    return (
        <div id="nav-strip" className={styles.navStripContainer}>
            {page > 1 && <NavArrow dir="prev" onTriggerScroll={onTriggerScroll} />}

            <NavGroup pageData={pageData} page={page} groupRef={groupRef} api={api} />

            {page < Array.from(pageData.keys()).length && (
                <NavArrow dir="next" onTriggerScroll={onTriggerScroll} />
            )}
        </div>
    )
}

interface NavArrowProps {
    dir: pageDir
    onTriggerScroll: (dir: Dir) => void
}
export const NavArrow = ({ dir, onTriggerScroll }: NavArrowProps) => (
    <div className={`${styles.navStripButton} ${dir === 'next' ? styles.next : styles.prev}`}>
        <div
            role="link"
            tabIndex={0}
            className={styles.button}
            onMouseDown={() => onTriggerScroll(dir)}>
            {dir === 'prev' ? '≪' : '≫'}
        </div>
    </div>
)

interface NavGroupProps {
    pageData: PageData
    page: number
    groupRef: React.RefObject<HTMLDivElement>
    api: SpringRef<{ y: number }>
}
const NavGroup = ({ pageData, page, groupRef, api }: NavGroupProps) => {
    const [refs] = React.useState(
        Array.from(pageData.keys()).map(() => React.createRef<HTMLDivElement>())
    )

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
