import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import React from 'react'

import { Link } from 'react-router-dom'
import { Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap'
import SiteContainer from '../SiteContainer'
// import { setEdition } from '../../reducers/edition'

import im1 from '../../images/manoflaw.jpg'
import im2 from '../../images/page.png'

const HomePage = () => {
    return (
        <SiteContainer>
            <Grid
                className="home"
                style={{
                    backgroundSize: 'cover'
                }}>
                <Row>
                    <Col>
                        <Row>
                            <Col sm={8}>
                                <div className="home-text">
                                    <h1>Canterbury Tales</h1>
                                    <h2>Rosenbach MS 1084/2 (ca 1440)</h2>
                                    <img
                                        src={im1}
                                        className="img-circle"
                                        width="200"
                                        alt="drawing of the Man of Law"
                                        style={{ float: 'right' }}
                                    />
                                    <p>
                                        This manuscript is an eleven-leaf fragment of Geoffrey
                                        Chaucer’s <i>The Canterbury Tales</i>, held at the Rosenbach
                                        in Philadelphia, Pennsylvania. It includes portions of the{' '}
                                        <span
                                            style={{
                                                backgroundColor: '#2550a1'
                                            }}>
                                            Reeve’s Tale
                                        </span>
                                        , the{' '}
                                        <span
                                            style={{
                                                backgroundColor: '#658539'
                                            }}>
                                            Cook’s Tale
                                        </span>
                                        , the{' '}
                                        <span
                                            style={{
                                                backgroundColor: '#963f39'
                                            }}>
                                            Man of Law’s Tale
                                        </span>
                                        , the{' '}
                                        <span
                                            style={{
                                                backgroundColor: '#365414'
                                            }}>
                                            Squire’s Tale
                                        </span>
                                        , the{' '}
                                        <span
                                            style={{
                                                backgroundColor: '#876331'
                                            }}>
                                            Canon’s Yeoman’s Tale
                                        </span>
                                        , the{' '}
                                        <span
                                            style={{
                                                backgroundColor: '#b09e8d'
                                            }}>
                                            Tale of Sir Thopas
                                        </span>
                                        , and the{' '}
                                        <span
                                            style={{
                                                backgroundColor: '#cae1ed'
                                            }}>
                                            Parson’s Tale
                                        </span>
                                        . These leaves along with two leaves in the John Rylands
                                        Library (English MS. 63) are all that survive of the “Oxford
                                        Manuscript.”
                                    </p>
                                    <p>
                                        <img
                                            src={im2}
                                            width="200"
                                            alt="drawing of the Man of Law"
                                            style={{ float: 'left' }}
                                        />
                                        This website serves as a demo of the{' '}
                                        <a href="https://github.com/wtrettien/manicule">
                                            Manicule web app
                                        </a>{' '}
                                        for exploring unique books and manuscripts. The{' '}
                                        <b>Browse</b> view allows you to read the fragments in
                                        order, following the modern pagination on the leaves and
                                        bifolia. Marginal notes beside each facsimile page indicate
                                        which lines from <i>The Canterbury Tales</i> are present;
                                        these notes can be changed by altering the{' '}
                                        <b>description</b> attribute in <b>pages.json</b>.
                                        Color-coded categories indicate which tale is present; these
                                        categories can also be changed in <b>pages.json</b> and the
                                        colors updated in <b>metadata.ts</b>. (They have been added
                                        by hand to the paragraph above, to demonstrate how to add
                                        styles to this text.) The <b>Structure</b> view shows where
                                        these fragments are conjoined, or not. This data is stored
                                        in <b>structure.xml</b>, which visualizes the format of a
                                        book using the{' '}
                                        <a href="https://github.com/leoba/VisColl">VisColl</a> data
                                        model.
                                    </p>
                                    <p>
                                        Images of and information about this manuscript (MS 1084/2)
                                        were accessed via{' '}
                                        <a href="http://openn.library.upenn.edu/Data/0028/html/ms_1084_002.html">
                                            OPenn
                                        </a>
                                        , a repository of CC-licensed high-resolution images of
                                        cultural heritage materials along with machine-readable
                                        descriptive and technical metadata.
                                    </p>
                                    <p>
                                        For instructions on how to install and play with this demo,
                                        please see the README of the source code:{' '}
                                        <a href="https://github.com/wtrettien/manicule">
                                            https://github.com/wtrettien/manicule
                                        </a>
                                    </p>
                                    <p className="clear"></p>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <ListGroup>
                                    <ListGroupItem>
                                        {' '}
                                        <Link to="/reader/default/5">
                                            <Glyphicon glyph="bookmark" /> Tour this edition
                                        </Link>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Link to="/structure">
                                            {' '}
                                            <Glyphicon glyph="book" /> Explore the book‘s physical
                                            structure
                                        </Link>
                                    </ListGroupItem>
                                </ListGroup>
                                {/* <MapView currentPage={0} /> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        </SiteContainer>
    )
}

export default HomePage
