import React, { Component } from 'react'
import srv from '../api/apiServ';
import { Redirect, Link } from 'react-router-dom';
import {Navbar, NavDropdown, Nav, Spinner, Button}from 'react-bootstrap'

export default class NavBar extends Component {
  state={
    user:{...this.props.user}
  }


  logout = (event) => {
    srv.logout()
      .then(response => {       
        this.props.updateUser(false);
        this.props.history.push('/');
      })
    ;
  }

  // showContainer = () => {
  //   return(
  //     <div>
  //       <Button variant="primary" disabled>
  //         <Spinner
  //           as="span"
  //           animation="grow"
  //           size="sm"
  //           role="status"
  //           aria-hidden="true"
  //         />
  //         Loading...
  //       </Button>
  //     </div>
  //   )
  // }

  


  render() {
    return (
      <>
        { !this.props.user._id  ?(
          <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark" >
            {/* <Redirect to="/"/> */}
            <Navbar.Brand href="#home"><img src="https://res.cloudinary.com/dshuazgaz/image/upload/v1605986441/image_9_l2l4wb.png" style={{height: '50px'}} alt="" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto" >
                <Nav.Link href="/signup">SignUp</Nav.Link>
                <Nav.Link href="/login">LogIn</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        ) 
        :
        (
          <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark" style={{textAlign:"left"}}>
            <Navbar.Brand href="#home"><img src="https://res.cloudinary.com/dshuazgaz/image/upload/v1605986441/image_9_l2l4wb.png" style={{height: '50px'}} alt="" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto" >
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/bugs-list">Bugs List</Nav.Link>
                <Nav.Link href="/services">Services</Nav.Link>
                <Nav.Link href="/new-bug">New Bug</Nav.Link>

              </Nav>
              <Nav>
                <img
                  src={this.props.user.imageURL}
                  width="40"
                  height="40"
                  className="rounded-circle z-depth-0"
                  alt="React Bootstrap logo"
                />   
                <NavDropdown title={this.props.user.firstname} eventkey={2} href="/">                    
                  <NavDropdown.Item href={`/profil`} >My Account</NavDropdown.Item>
                  <NavDropdown.Item onClick={this.logout} >Logout</NavDropdown.Item>                
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        )}
      </>
    )
  }
}
