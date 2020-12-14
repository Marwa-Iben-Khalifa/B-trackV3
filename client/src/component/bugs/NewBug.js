import React, { Component } from 'react'
import axios from 'axios';
import srv from '../api/apiServ'
import Navbar from '../navs/Navbar'
import Footer from '../navs/Footer'
import { Link, Redirect } from 'react-router-dom';

import { Button, Form, Row, Alert , Col, Container, FormControl, Spinner} from 'react-bootstrap';



export default class NewBug extends Component {
  state={
    user:null,
    title:"",
    description:"",
    solution:"",
    services: [],
    status:"",
    severity:"",
    listOfServices:[],
    errorMessage:[]  
  }

  componentDidUpdate(prevProps, prevState){
    if (!prevProps.user._id && this.props.user._id) {
      console.log ('componentDidUpdate', this.props.user)
      this.setState({user:{...this.props.user}})
    } 
  }

  componentDidMount() {
    this.getAllServices();
  }

  getAllServices = () =>{
    srv.serviceList()
    .then(response => {
      console.log("services list", response)
      this.setState({
        listOfServices: response
      })
    })
  }

  
  handleFormSubmit = (event) => {
    event.preventDefault();
    srv.newBug(this.state.title, this.state.description, this.state.solution, this.state.services, this.state.status, this.state.severity)
    .then((res) => {      
      console.log("ok!")
      this.setState({title:"", description:"", solution:"", services: [], status:"", severity:"", errorMessage:[] });
      // this.props.updateUser(response);
      this.props.history.push('/bugs-list');        
    })
    .catch((error)=> this.setState({errorMessage:error.response.data.message}))
  }

  handleChange = (event) => {  
    const target = event.target;
    const name = target.name;
    const serv= this.state.services;
    target.type === 'checkbox' 
    ? 
    (this.setState({services:[...serv , target.value]}))
    : 
    this.setState({[name]: target.value});
  }

  handleReset = (event) => {
    this.setState({title:"", description:"", solution:"", services: [], status:"", severity:"", errorMessage:[]  })
  }

  showContainer = () => {
    return(
      <div>
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
      </div>
    )
  }

  render() {
    if (this.state.user === null) return this.showContainer()
    if (this.state.user === false) return <Redirect to="/"/>
    return (
      <Container fluid>
        <Navbar user={this.props.user} updateUser={this.props.updateUser} history={this.props.history}/>
        <Container className="border" style={{textAlign:"left" , color: "#300032", fontWeight:"bolder", marginBottom:"60px"}}>
          {this.state.errorMessage.length > 0 && (
            <div> {this.state.errorMessage.map((el, index)=> 
              (
              <Alert key={index} variant={'danger'}>{el}</Alert>
              ))} 
            </div>
          )}
          <Form onSubmit={this.handleFormSubmit} onReset={this.handleReset}>

            <Form.Group as={Row}>
              <h3 className="col-sm-10 mt-1" >New Bug</h3>
              <small className="text-secondary form-text text-muted mt-0">
                Fill all the fields then click on Add in order to create a new bug.
              </small>
            </Form.Group >

            <Form.Group as={Col} md="10"  htmlFor="title">
              <Form.Label className="mb-3" as={Row}>Title:</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleChange}
                placeholder="Ex: Error when..."
                id="title"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="10">
              <Form.Label className="mb-3" htmlFor="des" as={Row}>Description:</Form.Label>
              <FormControl as="textarea" id="des"  name="description" rows="3" 
              placeholder="Ex: Some solution..." onChange={this.handleChange}></FormControl>
            </Form.Group>
          
            <Form.Group as={Col} md="10">
              <Form.Label className="mb-3" htmlFor="sol" as={Row}>Solution:</Form.Label>
              <FormControl as="textarea" id="sol"  name="solution" rows="3" 
              placeholder="Ex: Some solution..." onChange={this.handleChange}></FormControl>
            </Form.Group> 
            
            <Row>

              <Form.Group as={Col}>
                <Form.Label className="mb-3" as={Row} >Severity:</Form.Label>
                <Form.Group id="formGridRadio">
                  <Form.Check type="radio" label="Critical" name="severity" defaultChecked value="Critical" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group id="formGridRadio">
                  <Form.Check type="radio" label="High" name="severity" value="High" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group id="formGridRadio">
                  <Form.Check type="radio" label="Medium" name="severity" value="Medium" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group id="formGridRadio">
                  <Form.Check type="radio" label="Low" name="severity" value="Low" onChange={this.handleChange}/>
                </Form.Group>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label className="mb-3" as={Row} >Status:</Form.Label>
                <Form.Group id="formGridRadio">
                  <Form.Check type="radio" label="Confirmed" name="status" defaultChecked value="Confirmed" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group id="formGridRadio">
                  <Form.Check type="radio" label="InProgress" name="status" value="In Progress" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group id="formGridRadio">
                  <Form.Check type="radio" label="Resoveld" name="status" value="Resolved" onChange={this.handleChange}/>
                </Form.Group>                  
              </Form.Group>

              <Form.Group as={Col} >
                <Form.Label className="mb-3" as={Row}>Services:</Form.Label>
                {this.state.listOfServices.map( service => {
                  return (
                    <Form.Group id="formGridCheckbox" key={service._id}>
                      <Form.Check  name="services" type="checkbox" label={service.name} value={service._id} onChange={this.handleChange}/>
                    </Form.Group>
                  )})
                } 
                
              </Form.Group>
            </Row>

            <Button type="reset" variant="secondary" >Reset</Button>
            <Button type="submit" variant="primary"><i className=" mr-1 far fa-save"></i>Save</Button>

          </Form>

        </Container>
        <Footer/>
      </Container>
    
    )
  }
}
