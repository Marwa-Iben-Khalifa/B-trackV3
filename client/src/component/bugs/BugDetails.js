import React, { Component } from 'react'
import axios from 'axios';
import srv from '../api/apiServ';
import Navbar from '../navs/Navbar'
import Footer from '../navs/Footer'


import { Button, Modal, Form, Row, Alert, FormControl, Container, Spinner } from 'react-bootstrap';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';


import { Redirect } from 'react-router-dom';




export default class BugDetails extends React.Component {
  state = {
    bug: "",
    rapportedAt: "",
    solutions: [],
    services: [],
    rapporter: {},
    
    status: "",
    severity: "",
    solution: "",
    errorMessage:[],
    show: false
  };

  getBugFromApi = () => {
    const { params } = this.props.match;
    srv.srv.get(`/details/${params.id}`)
      .then(response => {
        console.log('coucou', response.data)
        this.setState({
          bug: response.data.result,
          rapportedAt: response.data.rapportedAt,
          solutions: response.data.solutions,
          services: response.data.result.services,
          rapporter: response.data.result.rapporter
        })
      })
  }

  componentDidMount() {
    this.getBugFromApi();
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const serv = this.state.services;
    target.type === 'checkbox'
      ?
      (this.setState({ services: [...serv, target.value] }))
      :
      this.setState({ [name]: target.value });
  }

  componentDidUpdate(prevProps, prevState){
    if (!prevProps.user._id && this.props.user._id) {
      console.log ('componentDidUpdate', this.props.user)
      this.setState({user:{...this.props.user}})
    } 
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

  handleFormSubmit= (event)=>{
    event.preventDefault();
    const {status, severity, solution}= this.state;
    const { params } = this.props.match;
    srv.srv.post(`/solution/${params.id}`, {status, severity, solution})
      .then(() => {
        this.setState({show:false, status: "", severity: "", solution: "",errorMessage:[], });
        this.getBugFromApi() 
        // this.props.history.push(`/bug-details/${params.id}`);
        console.log('hello', this.state)
      })
      .catch((error)=> this.setState({errorMessage:error.response.data.message}))

  }

  handleReset = (event) => {
    this.setState({status: "", severity: "", solution: "", errorMessage:[]})
  }
  

  render() {
    if (this.state.user === null && !this.props.user._id) return this.showContainer()
    if (this.state.user === false) return <Redirect to="/"/>
    return (
      <Container  fluid>
        <Navbar user={this.props.user} updateUser={this.props.updateUser} history={this.props.history}/>
        <Container className="border" style={{textAlign:"left" , color: "#300032", fontWeight:"bolder", marginBottom:"60px"}}>
          <div className="border pl-3 "  >
            <h3 >Bug Overview</h3>
          </div>
          <Row className="my-2">
            <div className="col-4">Title</div>
            <p className="col-8">{this.state.bug.title}</p>
          </Row>

          <Row className="mb-2 border-top">
            <div className="col-4">Rapported by</div>
            <div className="col-8">
              <div>
                <label className="mb-0">{this.state.rapporter.firstname} {this.state.rapporter.lastname}</label>
                <small className=" form-text text-muted mt-0 "> {this.state.rapportedAt.rapportDay} at
                  {this.state.rapportedAt.rapportTime}</small>
              </div>
            </div>
          </Row>

          <Row className="mb-2 border-top">
            <div className="col-4">Services</div>
            <div className="col-8">                
              {this.state.services.map((el) => (
                <div key={el._id}>
                  <label className="mb-0">{el.name}</label>
                  <small className=" form-text text-muted mt-0 ">{el.email}</small>
                </div>
              ))}
            </div>
          </Row>

          <Row className="mb-2 border-top">
            <div className="col-4">Status</div>
            {this.state.bug.status=== "Confirmed"  ?
              <p style={{color:"red"}} className="col-8">{this.state.bug.status}</p>
            : this.state.bug.status=== "In Progress" ?
            <p style={{color:"orange"}} className="col-8">{this.state.bug.status}</p>
            : <p style={{color:"green"}} className="col-8">{this.state.bug.status}</p>
            }
          </Row>  
            
          <Row className="mb-2 border-top">
            <div className="col-4">Severity</div>
            {this.state.bug.severity=== "Critical" || this.state.bug.severity=== "High" ?
              <p className="col-8" style={{color:"red"}}>{this.state.bug.severity}</p>
            : this.state.bug.severity=== "Medium" ?
              <p className="col-8" style={{color:"orange"}}>{this.state.bug.severity}</p>
            : 
              <p className="col-8" style={{color:"green"}}>{this.state.bug.severity}</p>
            }
            
          </Row>
            
          <Row className="mb-2 border-top">
            <div className="col-4">Description</div>
            <p className="col-8">{this.state.bug.description}</p>
          </Row>
          
          <Row className="mb-2">
            <div className="col-12">
              <button className=" mt-3 btn btn-secondary" data-target="#addSolutionModal" 
                data-id="bugId0001" onClick={()=> this.setState({show:true})}> 
                <i className="far fa-edit"></i> Add solution
              </button>
            </div>
          </Row>

          <Row className="mt-5">
            <div className="col-md-12 col-lg-12">
              <div id="tracking">
                <div className="border pl-3 " style={{color: "#300032"}} >
                  <h3 >Bug Solutions</h3>
                </div>
                <div className="tracking-list mt-1">

                  {this.state.solutions.map((el, index) => (
                    <VerticalTimeline  key={index} >
                      <VerticalTimelineElement
                        className="vertical-timeline-element--laravel VerticalTimelineElement vertical-timeline-element "
                        contentStyle={{ background: 'rgb(64, 81, 182, 0.25)' }}
                        contentArrowStyle={{ borderRight: '7px solid  rgb(64, 81, 182, 0.25)' }}
                        date={<p>{el.date.rapportDayS}, {el.date.rapportTimeS}</p>}
                        key={el.s._id}
                        icon={<img src={el.s.user_id.imageURL} className="material-icons md-18" style={{ borderRadius: "50%", position: "absolute", top: "0", left:"0"  }} width="60" height="60" alt="" />}
                        >
                        <h4 className="vertical-timeline-element-title">{el.s.user_id.firstname} {el.s.user_id.lastname}</h4>
                        <h5 className="vertical-timeline-element-subtitle">Status: {el.s.status}</h5>
                        <p>
                          {el.s.solution}
                        </p>
                      </VerticalTimelineElement>
                    </VerticalTimeline>
                  ))}

                </div>
              </div>
            </div>
          </Row>
        </Container>
        
        <Modal id="addSolutionModal" tabIndex="-1" role="dialog" show={this.state.show}>
          <Modal.Header>
            <Modal.Title id="addSolutionModalLabel">Edit Service</Modal.Title>
            <Button type="button" onClick={()=> this.setState({show:false, errorMessageEdit:[], dataId:"", name:"", phone:"", email:""})}>
              <span >&times;</span>
            </Button>
          </Modal.Header>
          
          {this.state.errorMessage.length > 0 && (
            <div> {this.state.errorMessage.map((el, index)=> 
              (
              <Alert key={index} variant={'danger'}>{el}</Alert>
              ))} 
            </div>
          )}
          
          <Form id="popup-add-solution" onSubmit={this.handleFormSubmit} onReset={this.handleReset}>
            <Modal.Body>
              <Form.Group >
                <Form.Label htmlFor="popup-bug-solution" >Status:</Form.Label>
                <div className="col-sm-10 mt-2" onChange={this.handleChange}>
                  <input className="ml-3" type="radio"  name="status" defaultChecked value="Confirmed" />
                  <Form.Label className="ml-1">Confirmed</Form.Label>
                  <input className="ml-3" type="radio"  name="status" value="In Progress" />
                  <Form.Label className="ml-1">InProgress</Form.Label>
                  <input className="ml-3" type="radio"   name="status" value="Resolved" />
                  <Form.Label className="ml-1">Resoveld</Form.Label>
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="popup-bug-solution" className="col-form-label">Severity:</Form.Label>
                <div className="col-sm-10 mt-2" onChange={this.handleChange}>
                  <input className="ml-3" type="radio" name="severity" defaultChecked value="Critical" />
                  <Form.Label className="ml-1">Critical</Form.Label>
                  <input className="ml-3" type="radio" name="severity" value="High" />
                  <Form.Label className="ml-1">High</Form.Label>
                  <input className="ml-3" type="radio" name="severity" value="Medium" />
                  <Form.Label className="ml-1">Medium</Form.Label>
                  <input className="ml-3" type="radio" name="severity" value="Low" />
                  <Form.Label className="ml-1">Low</Form.Label>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="popup-bug-solution" className="col-form-label">Solution:</Form.Label>
                <FormControl as="textarea" id="sol"  name="solution" rows="3" 
                placeholder="Ex: Some solution..." onChange={this.handleChange}></FormControl>
              </Form.Group>             
            </Modal.Body>
            <Modal.Footer>
              <Button type="reset" variant="secondary" >Reset</Button>
              <Button type="submit" variant="primary"><i className=" mr-1 far fa-save"></i>Save</Button>
            </Modal.Footer>
          </Form>   
        </Modal>
        <Footer/>
      </Container>          
    )
  }
}


