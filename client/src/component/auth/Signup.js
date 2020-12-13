import React, { Component } from 'react'

export default class Signup extends Component {
  state = {
    firstname: "",
    lastname: "" ,
    service: "",
    role: "" ,
    email: "" ,
    password: "" ,
    confirmPassword: "",
    imageURL:"https://res.cloudinary.com/dshuazgaz/image/upload/v1602411437/avatar_el8zal.webp",
    errorMessage:[],
    listOfServices:[]
  };
  render() {
    return (
      <div>
        
      </div>
    )
  }
}
