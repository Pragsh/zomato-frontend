import React from 'react';
import {withRouter} from 'react-router-dom';
import '../Styles/Header.css';
import Modal from 'react-modal';
import FacebookLogin from 'react-facebook-login';
import Google from 'react-google-login';
import { GrFormClose } from "react-icons/gr";
import axios from 'axios';
import OrderHistory from "../Components/OrderHistory";

class Header extends React.Component{

    constructor(){
        super();
        this.state= {
            loginModalOpen : false,
            openLoginWindow : false,
            signUpWindowOpen : false,
            isLoggedIn : false,
            openOrderHistory : false,
            user : undefined,
            userName : undefined,
            emailId : undefined
        }
    }
    verifyUser = () =>{
            let formElement = document.getElementById("loginForm").elements;
            let email = formElement[0].value;   
            
            axios({
                method : 'POST',
                url : 'http://localhost:2023/verify',
                data : {email : email},
                headers :  { 'content-type': 'application/json'}
            }).then(response =>  {
                console.log("User Verifiy Response", response);
                sessionStorage.setItem('userLoggedIn', true);
                this.setState({isLoggedIn : true,user : response.data.user})
                }
            ).catch(
                err => {console.log("error",err);}
            )
    }
    registerUser = () =>{
        let formElement = document.getElementById("signUp").elements;
        let userName = formElement[0].value;
        let email = formElement[1].value;
        let pass = formElement[2].value;

        let inputObj = {
            userName : userName,
            email : email,
            password : pass
        }
        axios({
            method : 'POST',
            url : 'http://localhost:2023/register',
            headers :  { 'Content-Type': 'application/json'},
            data : inputObj
        }).then(
            response =>  {console.log(response.data.message);}
        ).catch(
            err => {console.log(err);}
        )
    }
    navigateHome = ( )=>{
        this.props.history.push('/');
    }

    handleLogin = (state, val) =>{
        this.setState({[state] : val});
    }
    handleLogout= () =>{
        sessionStorage.setItem('userLoggedIn', false);
        sessionStorage.setItem('email', undefined);
        this.setState({userName : undefined, isLoggedIn : false});
    }
    handleSignUp = (state, val) =>{
        this.setState({[state] : val});
    }
    
    verifyLogin = (state, val) =>{
        this.setState({[state] : val, loginModalOpen : false});
    }
    responseFB = (response) =>{
        console.log("fb response", response);
        sessionStorage.setItem('userLoggedIn', true);
        
        sessionStorage.setItem('email', response.email);
        this.setState({isLoggedIn : true, userName : response.name, emailId: response.email, loginModalOpen : false})
    }

     responseGoogle = (response) => {
        console.log("Google response", response);
        sessionStorage.setItem('userLoggedIn', true);
        sessionStorage.setItem('email', response.profileObj.email);
        this.setState({isLoggedIn : true, userName : response.profileObj.name, emailId : response.profileObj.email, loginModalOpen : false})
      }

    customStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)',
        }
    };

    render(){

        let {loginModalOpen, openLoginWindow, signUpWindowOpen, user, userName, emailId, isLoggedIn, openOrderHistory} = this.state;
        
        return(
            <div>
                <header>
                    <div className="header-div">
                        {
                            isLoggedIn ? 
                            <div style={{textAlign: "right"}}>
                                <button className="Login" > Welcome {user ? user[0].userName : userName} !! </button>
                                <button className="Login" onClick={() => {this.handleLogin('openOrderHistory', true)}} >Order history</button>
                                <button className="Login"  onClick={() => {this.handleLogout()}}>Logout</button>
                            </div> :
                            
                            <div style={{textAlign: "right"}}>
                                <button className="Login" onClick={() => {this.handleLogin('loginModalOpen', true)}} >Login</button>
                                <button className="create-Account"  onClick={() => {this.handleSignUp('signUpWindowOpen', true)}}>Create Account</button>
                            </div>
                            
                        }
                        <div className="logo" onClick={this.navigateHome}>
                            <b>e!</b>
                        </div>
                    </div>
                 </header>
                 <Modal isOpen={loginModalOpen} style={this.customStyles}>
                    
                 <GrFormClose onClick={() => {this.handleLogin('loginModalOpen', false)}} style={{float:'right'}}/>
                    <div>
                    <FacebookLogin
                        appId="567671310928439"
                        fields="name,email,picture"
                        textButton="Continue with facebook"
                        callback={this.responseFB}
                        icon="fa-facebook" />
                 </div> 
                        <div style={{marginTop : "24px"}}>
                        <Google className="google"
                           clientId="228960667432-h278qfs498dslc38esa6a1pv8boqhimk.apps.googleusercontent.com"
                           buttonText="Continue with Gmail"
                           className="googleClass"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            icon={true}
                            />
                    </div> 
                    
                    <div style={{textAlign : 'center'}}>
                        <label> OR </label><br/>
                        <label style={{color : 'blue', fontSize :'20px'}}> Already have an account </label><br/>
                        <button className="btn btn-lg btn-primary" onClick={() =>{this.verifyLogin('openLoginWindow', true)}}> Login </button>
                    </div>
                 </Modal>

                 <Modal isOpen={openLoginWindow} style={this.customStyles}>
                    <GrFormClose onClick={() => {this.handleLogin('openLoginWindow', false)}} style={{float:'right'}}/>
                        <form id="loginForm">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/> 
                        </div>
                        <button type="submit" class="btn btn-primary" onClick={this.verifyUser}>Submit</button>
                    </form>
                 </Modal>

                 <Modal isOpen={signUpWindowOpen} style={this.customStyles}>
                    <GrFormClose onClick={() => {this.handleSignUp('signUpWindowOpen', false)}} style={{float:'right'}}/>
                        <form id="signUp">
                        <div class="form-group">
                            <label for="user">Username </label>
                            <input type="text" class="form-control" id="user"/>
                      </div>
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                         </div>
                        <div class="form-group">
                            <label for="pass">Password</label>
                            <input type="password" class="form-control" id="pass" placeholder="Password"/> 
                        </div>
                        <button type="submit" class="btn btn-primary" onClick={this.registerUser}>Register</button>
                    </form>
                 </Modal>
                    
                 <Modal isOpen={openOrderHistory} style={this.customStyles}>
                    <GrFormClose onClick={() => {this.handleLogin('openOrderHistory', false)}} style={{float:'right'}}/>
                        <OrderHistory userEmailId={emailId}/>
                 </Modal>
            </div>
        )
    }
}

export default withRouter(Header);