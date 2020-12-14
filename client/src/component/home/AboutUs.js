import React, { Component } from 'react'
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { Link , Redirect} from 'react-router-dom';

export default class AboutUs extends Component {
  render() {
    return (
      <div>
        <MDBCol md='4'>
            <MDBCard testimonial>
              <div className='indigo lighten-1' />
              <div className='mx-auto white'>
                <img
                  src='https://mdbootstrap.com/img/Photos/Avatars/img%20%2810%29.jpg'
                  alt=''
                />
              </div>
              <MDBCardBody>
                <h4 className='card-title'>Anna Doe</h4>
                <hr />
                <p>
                  <MDBIcon icon='quote-left' /> Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. Eos, adipisci{' '}
                  <MDBIcon icon='quote-right' />
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
      </div>
    )
  }
}
