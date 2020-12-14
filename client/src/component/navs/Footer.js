import React, { Component } from 'react'
import {Navbar}from 'react-bootstrap'


export default class Footer extends Component {
  render() {
    return (
      <Navbar fixed="bottom" bg="dark">
        <Navbar.Brand >
          <span className="text-muted text-center">Copy right Marwa & Wafâa</span>
        </Navbar.Brand>
      </Navbar>
    )
  }
}
