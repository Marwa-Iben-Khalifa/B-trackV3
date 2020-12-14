import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import srv from '../api/apiServ';
import { Button, Modal, Form, Row, Alert , Col, InputGroup, Table, Container, Spinner} from 'react-bootstrap';
import axios from 'axios'
import Navbar from '../navs/Navbar'
import Footer from '../navs/Footer'





export default class CRUDServices extends Component {
  state={
    user:null,
    listOfServices:[],
    show: false,
    dataId:"",
    name:"",
    phone:"",
    email:"",
    errorMessage:[],
    errorMessageEdit:[],
    sortby:"",
    query:"",
    connected:false
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

  deleateService=(id)=> {
    srv.srv.get(`/delete-service/${id}`)
    .then(
      this.getAllServices()
    )
    .catch((error)=> this.setState({errorMessage:error.response.data.message}))
  }

  handleChange = (event) => {  
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  // Update the `query` state on change
  handleQuery = (ev) => {
    this.setState({
      query: ev.target.value
    })
  }

  handleFormEdit= (event)=>{
    event.preventDefault();
    const name= this.state.name;
    const phone= this.state.phone;
    const email= this.state.email;
    const id = this.state.dataId;
    srv.srv.put(`/service/${id}`, {name, phone, email})
      .then(() => {  
        console.log(`name: ${name} phone:${phone} email:${email}`)
        this.getAllServices()          
        this.setState({name: "", phone: "", email: "", dataId:"",errorMessageEdit:[], show: false});
      })
      .catch((error)=> this.setState({errorMessageEdit:error.response.data.message}))

  }

  handleFormSubmit= (event)=>{
    event.preventDefault();
    const name= this.state.name;
    const phone= this.state.phone;
    const email= this.state.email;
    srv.newService(name, phone, email)
      .then(() => {  
        this.setState({name: "", phone: "", email: "", errorMessage:[]});
        this.getAllServices()
      })
      .catch((error)=> this.setState({errorMessage:error.response.data.message}))

  }

  handleReset = (event) => {
    this.setState({name:"", phone:"", email:"", errorMessageEdit:[], errorMessage:[]})
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
    let serv = [...this.state.listOfServices]; // make a copy (prevent mutating if .sort)
    const query = this.state.query;

    // sort by name
    if (this.state.sortby === 'name') {
      serv.sort((a, b) => a.name.localeCompare(b.name))
    }

    // sort by popularity
    if (this.state.sortby === 'email') {
      serv.sort((a, b) => a.email.localeCompare(b.email))
    }
    
    // Filter `services` with `query`
    if (query) {
      serv = serv.filter(service => service.name.includes(query))
    } 
    console.log("user:",this.props);

    if (this.state.user === null) return this.showContainer()
    if (this.state.user === false) return <Redirect to="/"/>
    return (
      <Container fluid>
        <Navbar user={this.props.user} updateUser={this.props.updateUser} history={this.props.history}/>
        <Container className="border"style={{color: "#300032", fontWeight:"bolder", marginBottom:"60px", height:"100%"}}  >
          <h2 >Services list</h2>
          <Row className="fluid">
            <Form.Control as="select"
              className="col-md-1 md-form"
              id="inlineFormCustomSelect" 
              value={this.state.sortby}
              name="sort"
              id="sortList"
              onChange={(e)=> this.setState({sortby: e.target.value})}
              custom>
              <option value="default">Sort by...</option>
              <option value="name">Name</option>
              <option value="email">Email</option>                    
            </Form.Control>
            <InputGroup className="col-md-4 md-form ml-2 ">
              <i className="fas fa-search prefix grey-text" style={{left: "0px"}}></i>
              <Form.Control className=" md-form"  type="search" placeholder="Search" value={this.state.query} onChange={this.handleQuery} />
            </InputGroup>
          </Row>
          <Table striped bordered hover responsive="sm" >
            <thead>
              <tr>
                <td>Name</td>
                <td>Phone</td>
                <td>E-mail</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {serv.map( service => {
                return (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.phone}</td>
                  <td>{service.email}</td>
                  <td className="d-flex flex-row-reverse">
                    <Button variant="danger" onClick={(event)=>{this.deleateService( service._id)}}>
                      <i className="fas fa-trash-alt" ></i></Button>
                    <Button  variant="info"  data-target="#editModal" onClick={()=> this.setState({show:true, dataId:service._id, name:service.name, phone:service.phone, email:service.email })}> 
                    <i className="far fa-edit" ></i> </Button>
                  </td>
                </tr>
                )})
              }
            </tbody>
          </Table>
          
          <Form  onSubmit={this.handleFormSubmit} onReset={this.handleReset}>
            {this.state.errorMessage.length > 0 && (
              <div> {this.state.errorMessage.map((el, index)=> 
                (
                <Alert key={index} variant={'danger'}>{el}</Alert>
                ))} 
              </div>
            )}
            <Row responsive={true} className="md-form">
              <Col sm>
                <InputGroup className="input-group-lg"></InputGroup> 
                <Form.Control type="text" aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm" name="name" placeholder="Name" value={this.state.name} onChange={this.handleChange} />
              </Col>
              <Col sm>
                <InputGroup className=" input-group-lg"></InputGroup>
                <Form.Control  aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="phone"
                  placeholder="Phone" value={this.state.phone} onChange={this.handleChange} />
              </Col>
    
              <Col sm>
                <InputGroup className="input-group-lg"></InputGroup>
                <Form.Control type="text"  aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="email"
                  placeholder="Mail" value={this.state.email} onChange={this.handleChange}/>
              </Col>
                    
              <Col sm className="d-flex flex-row-reverse">
                <Button type="submit" variant="primary"><i className=" mr-1 far fa-save"></i></Button>
                <Button type="reset" variant="secondary" ><i className="fas fa-trash-alt "></i></Button>
              </Col>
            </Row>
          </Form>
              
        </Container>


        <Modal id="editService" tabIndex="-1" role="dialog" show={this.state.show}>
          <Modal.Header>
            <Modal.Title  id="editModalLabel">Edit Service</Modal.Title>
            <Button  onClick={()=> this.setState({show:false, errorMessageEdit:[], dataId:"", name:"", phone:"", email:""})}>
              <span >&times;</span>
            </Button>
          </Modal.Header>
          
          {this.state.errorMessageEdit.length > 0 && (
            <div> {this.state.errorMessageEdit.map((el, index)=> 
              (
              <Alert key={index} variant={'danger'}>{el}</Alert>
              ))} 
            </div>
          )}
          
          <Form id="popup-edit-from" onSubmit={this.handleFormEdit} onReset={this.handleReset}>
            <Modal.Body>
              <Form.Group >
                <Form.Label htmlFor="popup-service-name" >Name:</Form.Label>
                <Form.Control id="popup-service-name" name="name" type="text"  value={this.state.name} onChange={this.handleChange}/>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="popup-service-phone" >Phone:</Form.Label>
                <Form.Control id="popup-service-phone" name="phone" type="text"  value={this.state.phone} onChange={this.handleChange}/>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="popup-service-email" >Email:</Form.Label>
                <Form.Control id="popup-service-email" name="email" type="text"  value={this.state.email} onChange={this.handleChange}/>
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
