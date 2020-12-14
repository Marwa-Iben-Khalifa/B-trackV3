import React, { Component } from 'react'
import { Link , Redirect} from 'react-router-dom';
import srv from '../api/apiServ';

import { Button, Modal, Form, FormGroup, Alert } from 'react-bootstrap';



export default class  Login extends React.Component {
  state ={
    email: "" ,
    password: "" ,
    error:""
  }

  handleSubmit = (event) => {
    event.preventDefault();

    srv.login(this.state.email, this.state.password)
      .then(response => {
        this.setState({error: ""});
        this.props.updateUser(response);
        console.log(response)
        this.props.history.push('/dashboard');
      })
      .catch(error => this.setState({error: error.response.data.message}))
    ;
  }


  handleChange = (event) => {  
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleReset = (event) => {
    this.setState({email: "",password: "" , error: ""})
  }

  render() {
    return (
      
      <Modal className="modal fade " id="orangeModalSubscription" tabIndex="-1" role="dialog" show={true} style={{backgroundColor:"#515ea261"}} >
        <Form className="modal-content form-elegant" onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <Modal.Header className="modal-header text-center">
              <h4 className="modal-title  w-100 font-weight-bold py-2" style={{color:"#0e3662" , fontSize:"40px"}}>Log In</h4>
              <Link className="close" to="/"> X </Link>
          </Modal.Header>
          {this.state.error.length > 0  && (
              <Alert key={'111'} variant={'danger'}>{this.state.error}</Alert>
            )}
          <Modal.Body className="modal-body">
            <FormGroup className="md-form mb-2">
              <i className="fa fa-envelope prefix grey-text"></i>
              <input type="email" name="email" placeholder="Email adress" className="form-control validate" id="inputEmail"  value={this.state.email} onChange={this.handleChange} />
              <label data-error="wrong" data-success="right" htmlFor="inputEmail"></label>
            </FormGroup>
            <FormGroup className="md-form mb-2">
              <i className="fas fa-lock prefix grey-text"></i>
              <input type="password" name="password" placeholder="Password" className="form-control validate" id="inputPassword"  value={this.state.password} onChange={this.handleChange}/>
              <label htmlFor="inputPassword"></label>
            </FormGroup>
          </Modal.Body>
          <div className="modal-footer justify-content-center mb-3">
            <Button type="submit" size="lg" className="btn btn-block btn-rounded  btn-outline-secondary " style={{fontWeight: "bold"}}>LogIn<i className="fas fa-paper-plane-o ml-1"></i></Button>
            <Button type="reset" className="btn btn-black">Reset</Button>
          </div>
        </Form>
      </Modal>
            
    )
  }
}
