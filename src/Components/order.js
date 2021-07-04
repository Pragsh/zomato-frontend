import React from 'react';
import '../Styles/Order.css';
import { BsFillStopFill } from "react-icons/bs";
import Modal from 'react-modal';
import { GrFormClose } from "react-icons/gr";
import axios from 'axios';

const { v4: uuidv4 } = require('uuid');

class Order extends React.Component{

    constructor(){
        super();
        this.state = {
            menuItems : [],
            isPayWindowOpen : false,
            subTotal : 0,
            name : undefined,
            email : undefined,
            mobile : undefined,
            address : undefined,
            userEmail : undefined
        }
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

    addItems = (index, operation) =>{

        let Total = 0;
        const items = [...this.state.menuItems];
        const cureentItem = items[index];
        if(operation == "add"){
            cureentItem.qty = cureentItem.qty+1;
        }else{
            cureentItem.qty =  cureentItem.qty-1;
        }

        items[index] = cureentItem;
        items.map((item) =>{
            Total += item.price * item.qty;
        })
    
        this.setState({menuItems : items, subTotal : Total});
    }
    
    handleChange = (event, state) =>{
        this.setState({ [state] : event.target.value})
    }
    handlePayment = (state, value) =>{
        if(this.state.subTotal == 0 ){
            alert("Please Select an item to proceed with order....!!")
        }else{
          this.setState({[state] : value});
        }
    }

    getData = (data) => {
        return fetch(`https://zomatobackendapp.herokuapp.com/payment`,{
            method : 'POST',
            headers : { "Content-Type" : "application/json"},
            body :JSON.stringify(data)  
        }).then(response => response.json()).catch(err => console.log(err))
    }

    post = (info) =>{
        let form = this.buildForm(info);
        document.body.appendChild(form);

        form.submit();
        form.remove();
    }

    isDate = (value) =>{
        return Object.prototype,toString.call(value) === '[object Date]'
    }

    stringifyValue = (value) =>{
        
        if( typeof value === 'object' && !this.isDate(value)){
            return JSON.stringify(value);
        }else{
            return value;
        }
    }

    buildForm = ({action, params}) =>{
       const form =  document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);

        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type','hidden');
            input.setAttribute('name',key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        })

        return form;
    }
    Pay = () =>{
        alert("Pay hereeee")
        const {subTotal, userEmail, menuItems} = this.state;
        const{restId, restName} = this.props;
        const orderId = uuidv4();
        let items= menuItems.filter((item)=> item.qty != 0);
        let dataObj = {
             restId : restId,
             restName : restName, 
             items : items,
             total: subTotal,
             date: Date.now(),
             orderId : orderId,
             status: 'PENDING',
             userId : userEmail
        }

        //Save order history temporary
        axios({
            method :'POST',
            url : 'https://zomatobackendapp.herokuapp.com/saveOrder',
            headers : { 'content-type': 'application/json'},
            data : dataObj
            
        }).then(response =>{
            console.log("Order Saved Successfully", response.data.orderHistory)
        })

        //Payment API call
        this.getData({amount :subTotal, email : userEmail, orderId : orderId }).then(response =>{
            var info = {
                action : "https://securegw-stage.paytm.in/order/process",
                params : response
            }
            
            this.post(info);
        })
    }
    componentDidMount(){
        console.log("restId" , this.props.restId);
        let userEmail = sessionStorage.getItem("email");
        axios({
            method : 'GET',
            url : `https://zomatobackendapp.herokuapp.com/menuItems/${this.props.restId}`
        }).then(
            response => (this.setState({menuItems : response.data.restMenus.dishName, userEmail : userEmail }))
        ).catch(
            err => {console.log(err);}
        )
    }

    render(){
        const {menuItems, subTotal, isPayWindowOpen, userEmail} =this.state;
        console.log(menuItems);
        return(
            <div className="order-div">
                <div className="restname">{this.props.restName}</div><br/>
                    { menuItems.map((item, index) => {
                        return(
                                <div className="container"> 
                                    <div style={{display: "inline-block",width: "60%"}}>
                                        <BsFillStopFill style={{color : 'green'}}/><br/>
                                        <label className="item-heading"> {item.name} </label><br/>
                                        <label className="item-heading">&#8377;  {item.price} </label>
                                        <p className="item-desc"> {item.desc} </p>
                                        </div>
                                        <div className="menu-item">
                                            <img height="100" width="100" src={item.img}/>
                                            {item.qty == 0 ? <div><button className="btn btn-success btn-position" onClick={() => {this.addItems(index,"add")}} >Add</button></div>
                                                    : <div className="add-item"><button onClick={() => {this.addItems(index,"subtract")}} >-</button>  {item.qty}  <button onClick={() => {this.addItems(index,"add")}}>+</button></div>
                                            }
                                    </div><hr></hr>
                                </div>
                        )
                    }) 
                    }
                    <div className="subtotal-div">
                        <label className="subtotal"> SubTotal : {subTotal}</label>
                        <button className="btn btn-md btn-danger" style={{float : 'right'}} onClick={() => this.handlePayment("isPayWindowOpen" , true)}>Pay Now</button>
                    </div>
               
                    <Modal
                        isOpen={isPayWindowOpen}
                        style={this.customStyles}
                        >
                            <div style={{width: "500px", height: "400px"}}>
                                <div onClick={() => {this.handlePayment('isPayWindowOpen',false)}} style={{float : 'right'}}><GrFormClose/></div>        
                                <h3>{this.props.restName}</h3>
                                <form id="loginForm">
                                <div class="form-group">
                                    <label>Name : </label>
                                    <input type="text" class="form-control" id="name"  placeholder="Enter your name" onChange={(event) => this.handleChange(event,'name')} />
                                </div>
                                <div class="form-group">
                                    <label>Mobile Number : </label>
                                    <input type="text" pattern="^\d10$" maxLength="10" class="form-control" id="mobile" placeholder="Enter your number" onChange={(event) => this.handleChange(event,'mobile')} /> 
                                </div>
                                <div class="form-group">
                                    <label for="email">Email address</label>
                                    <input type="email" class="form-control" id="email" value={userEmail} placeholder="Enter email"/>
                                </div>
                                <div class="form-group">
                                    <label>Address : </label>
                                    <textarea id="w3review" class="form-control" name="address" rows="4" cols="50" placeholder="Enter your address" onChange={(event) => this.handleChange(event,'address')}></textarea>
                                </div>
                                <div  className="subtotal-div">
                                    <label className="subtotal"> Total Amount : {subTotal}</label>
                                    <button type="submit"  style={{float :"right"}} class="btn btn-primary" onClick={this.Pay}>Proceed</button>
                                </div>
                            </form>
                            </div>

                    </Modal>
            </div>
        )
    }
}

export default Order;