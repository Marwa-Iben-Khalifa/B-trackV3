import React, { Component } from 'react'
import { Link , Redirect} from 'react-router-dom';
import {Container, Button, Spinner, Row, Col, Table, Card} from 'react-bootstrap'

export default class Details extends React.Component  {
  
  render() {
    return (
      <Container fluid>
        <Row className="d-flex justify-content-around"  >  
          <div style={{marginTop:"50px"}}>
            <div>
              <Card.Body >
                <Card.Title style={{fontWeight:"bold"}}>B-Track ? </Card.Title>
                <Card.Text >With supporting text below as a natural lead-in to additional content.</Card.Text>
                <a href="#" className="btn" style={{backgroundColor:"#3f51b552", borderRadius:"10px", fontWeight:"bold"}}>Learn more</a>
              </Card.Body>
            </div>
          </div>
          
          <div style={{marginTop:"50px"}}> 
            <div>
              <Card.Body>
                <Card.Title style={{fontWeight:"bold"}}>How?</Card.Title>
                <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
                <a href="#" className="btn" style={{backgroundColor:"#3f51b552", borderRadius:"10px", fontWeight:"bold"}}>Learn more</a>
              </Card.Body>
            </div>
          </div>

          <div style={{marginTop:"50px"}}>
            <div>
              <Card.Body>
                <Card.Title style={{fontWeight:"bold"}}>About Us?</Card.Title>
                <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
                <a href="#" className="btn" style={{backgroundColor:"#3f51b552", borderRadius:"10px", fontWeight:"bold"}}>Learn more</a>
              </Card.Body>
            </div>
          </div>

        </Row>

      </Container>
    )
  }
}