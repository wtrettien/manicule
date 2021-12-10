import React from 'react'
import { Col, Row } from 'react-bootstrap'

export default class NotFound extends React.PureComponent {
    // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <Row>
                <Col>
                    <h1>Page Not Found</h1>
                </Col>
            </Row>
        )
    }
}
