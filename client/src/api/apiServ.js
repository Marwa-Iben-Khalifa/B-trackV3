import axios from 'axios'
import { response } from 'express';


const errorHandler = err => {
  throw err;
};
let srv=axios.create({
  baseURL: `${process.env.REACT_APP_APIURL || ""}`, 
  withCredentials:true
})

export default{
  srv,

  login(email, password) {
    return this.srv.post('/login', {email, password})
      .then(response => response.data)
      // .catch(errorHandler);
  },

  signup(firstname, lastname, service, role, email, password, confirmPassword, imageURL) {
    return this.srv.post('/signup', {
      firstname, 
      lastname, 
      service, 
      role, 
      email, 
      password, 
      confirmPassword,
      imageURL
    })
      .then(response => response.data)
      .catch(errorHandler);
  },

  loggedin() {
    return this.srv.get('/loggedin')
      .then(response => response.data)
      .catch(errorHandler);
  },

  logout() {
    return this.srv.get('/logout', {})
      .then(response => response.data)
      .catch(errorHandler);
  },

  edit(firstname, lastname, service, role, passwordHash, imageURL) {
    return this.srv.post('/edit', {
      firstname, 
      lastname, 
      service, 
      role, 
      passwordHash,
      imageURL
    })
      .then(response => response.data)
      .catch(errorHandler);
  },

  upload(formdata) {
    return this.srv.post('/upload', formdata)
      .then(response => response.data)
      .catch(errorHandler);
  },

  newBug(title, description, solution, services, status, severity){
    return this.srv.post('/new-bug', {
      title, 
      description, 
      solution, 
      services, 
      status, 
      severity 
    })
    .then(response => response.data)
    .catch(errorHandler);
  },
  
  bugsList(){
    return this.srv.get('/bugs')
    .then(response => response.data)
    .catch(errorHandler);
  },

  serviceList(){
    return this.srv.get('/services')
    .then(response => response.data)
    .catch(errorHandler);
  },

  newService(name, phone, email){
    return this.srv.post('/new-service',{
      name, 
      phone,
      email
    })
    .then(response => response.data)
    .catch(errorHandler);
  }
  
}