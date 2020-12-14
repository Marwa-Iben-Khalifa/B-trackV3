import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { Button, Modal, Form, FormGroup, Row, Alert, Spinner } from 'react-bootstrap';
import srv from'../api/apiServ'


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
    listOfServices:null
  };

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

    srv.signup(this.state.firstname, this.state.lastname, this.state.service, this.state.role, this.state.email, this.state.password, this.state.confirmPassword, this.state.imageURL)
    .then((response) => {      
      // 2. then, update with user infos
      // srv.edit(this.state.firstname, this.state.lastname, this.state.service, this.state.role, this.state.password, this.state.confirmPassword, this.state.imageURL)
      // .then(response => {
        this.setState({firstname: "", lastname: "" , service: "", role: "", email: "" , password: "" , confirmPassword: "", imageURL:"https://res.cloudinary.com/dshuazgaz/image/upload/v1602411437/avatar_el8zal.webp", errorMessage:[] });
        console.log('user', response)
        this.props.updateUser(response);
        this.props.history.push('/dashboard');        
      // })
      // .catch((error)=> this.setState({errorMessage:error.response.data.message}))
    })
    .catch((error)=> this.setState({errorMessage:error.response.data.message}))
  }

  handleChange = (event) => {  
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleUpload=(event) =>{
    const uploadData = new FormData();
    uploadData.append('imageURL', event.target.files[0]);
    srv.upload(uploadData)
    .then(response =>{
      this.setState({ imageURL: response.imageURL });
    })
    .catch(err => {
      console.log('Error while uploading the file: ', err);
    });

  }

  handleReset = (event) => {
    this.setState({firstname: "",lastname: "" , service: "", role: "", email: "" , password: "" , confirmPassword: "", imageURL:"https://res.cloudinary.com/dshuazgaz/image/upload/v1602411437/avatar_el8zal.webp", errorMessage:[]})
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
    if(!this.state.listOfServices) return this.showContainer()
    // if(this.props.user._id) return <Redirect to="/dashboard"/>
    return (
      <Modal className="modal fade" id="orangeModalSubscription" tabIndex="-1" role="dialog" show={true} style={{backgroundColor:"#515ea261"}} >
        <Form className="modal-content form-elegant container-fluid " onSubmit={this.handleFormSubmit} onReset={this.handleReset}> 
          <Modal.Header className="modal-header text-center">
            <h4 className="modal-title  w-100 font-weight-bold py-2" style={{color:"#0e3662" , fontSize:"40px"}}>Sign up</h4>
            <Link className="close" to="/"> X </Link> 
          </Modal.Header>

          {this.state.errorMessage.length > 0 && (
            <div> {this.state.errorMessage.map((el, index)=> 
              (
              <Alert key={index} variant={'danger'}>{el}</Alert>
              ))} 
            </div>
          )}        
          
          <Modal.Body className="modal-body">
              
            <Row className="">
              <FormGroup className="md-form">                  
                <i className="fa fa-user prefix grey-text"></i>
                <input  type="text" name="firstname" placeholder="Firstname" className="form-control validate " id="inputFirstName"  value={this.state.firstname} onChange={this.handleChange} />
                <label htmlFor="inputFirstName"></label>

              </FormGroup> 
              <FormGroup className="md-form ml-2">
                <i className="fa fa-user prefix grey-text"></i>
                <input type="text" name="lastname" placeholder="Lastname" className="form-control validate" id="inputLastname" value={this.state.lastname} onChange={this.handleChange} />
                <label htmlFor="inputLastname"></label>
              </FormGroup>
            </Row>
            
            <Row className="row s">
              <FormGroup className="md-form  form-control signEmail" style={{border:"none"}}>
                <i className="fa fa-envelope prefix grey-text"></i>
                <input type="email" name="email" placeholder="Email adress" className=" validate " id="inputEmail"  value={this.state.email} onChange={this.handleChange}  />
                <label data-error="wrong" data-success="right" htmlFor="inputEmail"></label>
              </FormGroup>
            </Row>
            
            <Row className="row s">
              <FormGroup className="md-form ">
                <i className="fa fa-lock prefix grey-text"></i>
                <input type="password" name="password" placeholder="Password" className="form-control validate" id="inputPassword"  value={this.state.password} onChange={this.handleChange}/>
                <label htmlFor="inputPassword"></label>
              </FormGroup>
              <FormGroup className="md-form ml-2">
                <i className="fas fa-lock prefix grey-text"></i>
                <input type="password" name="confirmPassword" className="form-control validate" id="inputConfirmPassword"
                  value={this.state.confirmPassword} placeholder="Confirm Password" onChange={this.handleChange} />
                <label htmlFor="inputConfirmPassword"></label>
              </FormGroup>
            </Row>

            <Row className="row s">
              <FormGroup className="md-form custom-file">
                <i className="fa fa-camera prefix grey-text"></i>
                <input type="file" className="custom-file-input" name="image" id="input-image" onChange={this.handleUpload}/>
                <label  htmlFor="input-image" value={this.state.imageURL} >Choose Avatar</label>
              </FormGroup>
            </Row>

            <Row className="row s">
              <Form.Control as="select" className="mr-sm-2 mt-2" id="inlineFormCustomSelect" value={this.state.service} name="service" id="inputService" onChange={(this.handleChange)} style={{border:"none", borderBottom: "1px solid #D9DEE0"}} custom>
                    {/* afficher tous les services dans une boite select */}
                    <option value="">Service</option>
                    {this.state.listOfServices.map( service => {
                      return (
                        <option key={service._id} value={service._id}>{service.name}</option>
                      )})
                    } 
              </Form.Control>
              <Form.Control as="select"
                className="mr-sm-2 mt-2" id="inlineFormCustomSelect" value={this.state.role} name="role" id="inputRole" onChange={this.handleChange} style={{border:"none", borderBottom: "1px solid #D9DEE0"}} custom>
                <option value="">Role</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="validator">Validator</option>                    
              </Form.Control>
            </Row>
          
            <div className="modal-footer justify-content-center mb-3 mt-3">
              <Button type="submit" size="lg" className="btn-block btn-outline-secondary" style={{fontWeight: "bold"}}>Register</Button>
              <Button type="reset" className="btn btn-rounded btn-black " style={{backgroundColor:"#3f51b552"}}>Reset</Button>
            </div>
          
            Already registered <Link to="/login">Log in</Link>
          </Modal.Body>
        </Form>  
      </Modal>
    )
  }
}

