import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Grid, Navbar } from 'react-bootstrap'

import cc from 'site-images/cc.svg'
import by from 'site-images/by.svg'
import manic from 'site-images/manicule-white.png'

import {
    PageData,
    Structure,
    TourData,
    EditionName,
    DEFAULT_EDITION,
    getMetadata
} from 'utils/metadata'

interface EditionContextProps {
    edition: EditionName
    pages: PageData
    structure: Structure
    tour: TourData
}

export const EditionContext = React.createContext<EditionContextProps>({
    edition: '',
    pages: new Map(),
    structure: { quire: [] },
    tour: []
})

const SiteContainer: React.FC = ({ children }) => {
    const { editionName } = useParams()

    const [edition] = React.useState<EditionName>(editionName || DEFAULT_EDITION)
    const [pages, setPages] = React.useState<PageData>()
    const [structure, setStructure] = React.useState<Structure>()
    const [tour, setTour] = React.useState<TourData>()

    React.useEffect(() => {
        getMetadata(edition).then((metadata) => {
            const m = metadata.get(edition)
            setPages(m?.pages)
            setStructure(m?.structure)
            setTour(m?.tour)
        })
    }, [edition])

    // Uncomment to force scroll-to-top when there's a navigation change
    //
    // const location = useLocation()
    // React.useEffect(() => {
    //     window.scrollTo(0, 0)
    // }, [location])
    return pages && structure && tour && edition ? (
        <EditionContext.Provider
            value={{
                edition,
                pages,
                structure,
                tour
            }}>
            <Grid>
                <Navbar inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <li>
                                <Link to="/">
                                    <img src={manic} alt="Manicule home page" /> Manicule
                                </Link>
                            </li>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <ul className="nav navbar-nav">
                        <li>
                            <Link to={`/reader/${edition}`}>Browse</Link>
                        </li>
                        <li>
                            <Link to={`/structure/${edition}`}>Structure</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                    </ul>
                </Navbar>

                {children}

                <footer>
                    This work is licensed under a{' '}
                    <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                        Creative Commons Attribution 4.0 International License
                    </a>{' '}
                    <img src={cc} alt="Creative Commons" style={{ height: '2em' }} />
                    <img src={by} alt="Attribution" style={{ height: '2em' }} />
                </footer>
            </Grid>
        </EditionContext.Provider>
    ) : (
        <>
            <h2>Loading {edition}...</h2>
        </>
    )
}
export default SiteContainer
