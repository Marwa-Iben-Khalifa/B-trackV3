import React, { Component } from 'react'
import axios from 'axios'
import srv from '../api/apiServ';
import Navbar from '../navs/Navbar'
import Footer from '../navs/Footer'
import { Button, Form,  Row, Container, Table, InputGroup, Spinner} from 'react-bootstrap';

import { Link, Redirect } from 'react-router-dom';


export default class BugsList extends Component {
  state={
    user: null,
    bugs:[],
    sortby:"",
    query:""
  };

  componentDidUpdate(prevProps, prevState){
    if (!prevProps.user._id && this.props.user._id) {
      console.log ('componentDidUpdate', this.props.user)
      this.setState({user:{...this.props.user}})
    } 
  }

  deleateBug=(id)=> {
    srv.srv.get(`/bug-remove/${id}`)
    .then(
      this.getBugsFromApi()
    )
    .catch((error)=> this.setState({errorMessage:error.response.data.message}))
  }

  handleQuery = (ev) => {
    this.setState({
      query: ev.target.value
    })
  }
  
  getBugsFromApi = () =>{
    srv.srv.get(`/bugs`)
    .then(response => {
      this.setState({
        bugs: response.data
      })
    })
  }

  componentDidMount() {
    this.getBugsFromApi();
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
    console.log(this.state.bugs)
    let bugsList = [...this.state.bugs]; // make a copy (prevent mutating if .sort)
    const query = this.state.query;

    // sort by title
    if (this.state.sortby === 'title') {      
      bugsList.sort((a, b) => a.bug.title.localeCompare(b.bug.title))
    }

    // sort by rapporter
    if (this.state.sortby === 'rapporter') {
      bugsList.sort((a, b) => a.bug.rapporter.lastname.localeCompare(b.bug.rapporter.lastname))
    }

    // sort by date
    if (this.state.sortby === 'date'){
      bugsList.sort((a,b) => b.bug.rapportedAt.localeCompare(a.bug.rapportedAt))
    }
    
    // Filter `Bugs` with `query`
    if (query) {
      if(this.state.sortby === 'rapporter'){
        bugsList = bugsList.filter(b => b.bug.rapporter.lastname.includes(query))
      }else if(this.state.sortby === 'date'){
        bugsList = bugsList.filter(b => b.rapportedAt.rapportDay.includes(query))
      }else{
      bugsList = bugsList.filter(b => b.bug.title.includes(query))
    } }
    console.log(this.props.updateUser)
    if (this.state.user === null && !this.props.user._id) return this.showContainer()
    if (this.state.user === false) return <Redirect to="/"/>
    return (
      <Container fluid>
        <Navbar user={this.props.user} updateUser={this.props.updateUser} history={this.props.history}/>
        <Container className="border"style={{ color: "#300032", fontWeight:"bolder", marginBottom:"60px"}}>
          <h2 >Bugs list</h2>
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
              <option value="title">Title</option>
              <option value="rapporter">Rapporter</option> 
              <option value="date">Date</option>                    
            </Form.Control>
            <InputGroup className="col-md-4 md-form " style={{left: "10px"}}>
              <i className="fas fa-search prefix grey-text" style={{left: "0px"}} ></i>
              <Form.Control className="md-form"  type="search" placeholder="Search" value={this.state.query} onChange={this.handleQuery} />
            </InputGroup>
          </Row>
          <Table striped bordered hover responsive="sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Rapporter</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bugsList.map((el)=>(
                <tr key={el.bug._id}>
                  <td>{el.bug.title}</td>
                  <td>{el.bug.rapporter.firstname} {el.bug.rapporter.lastname}
                    <small className="text-secondary form-text text-muted mt-0"> {el.bug.rapporter.email}</small>
                    <small className="text-secondary form-text text-muted mt-0">{el.rapportedAt.rapportDay} at
                      {el.rapportedAt.rapportTime}</small>
                  </td>
                  {el.bug.severity=== "Critical"  ?
                    <td style={{color:"#752B3C"}}><i className="fas fa-angle-double-up fa-2x"></i></td>
                  : el.bug.severity=== "High" ? 
                    <td style={{color:"red"}}><i className="fas fa-angle-double-up fa-2x"></i></td>
                  : el.bug.severity=== "Medium" ?
                  <td style={{color:"orange"}}><i className="fas fa-angle-double-up fa-2x"></i></td>
                  : <td style={{color:"green"}}><i className="fas fa-angle-double-down fa-2x"></i></td>
                  }
                  
                  {el.bug.status=== "Confirmed"  ?
                    <td style={{color:"red"}}>{el.bug.status}</td>
                  : el.bug.status=== "In Progress" ?
                  <td style={{color:"orange"}}>{el.bug.status}</td>
                  : <td style={{color:"green"}}>{el.bug.status}</td>
                  }
                  <td className="d-flex flex-row-reverse" style={{border: "none"}}>
                    <Button variant="danger" onClick={(event)=>{this.deleateBug(el.bug._id)}}><i
                      className="fas fa-trash-alt"></i></Button>
                    <Link to={`/bug-details/${el.bug._id}`}><Button  variant="info"><i className="fas fa-eye"></i></Button></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Footer/>
      </Container>      
    )
  }
}
