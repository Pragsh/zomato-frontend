import React from 'react';
import '../Styles/OrderHistory.css';
import axios from 'axios';

class OrderHistory extends React.Component{

    constructor(){
        super();
        this.state = {
            orders :[]
        }
    }

    componentDidMount(){
        let userId =this.props.userEmailId;
        axios({
            method : 'GET',
            url:`https://zomatobackendapp.herokuapp.com/fetchOrders/${userId}`
        }).then(
            response => (this.setState({orders : response.data.orders}))
        ).catch(
            err => {console.log(err);}
        )
    }
    render(){
        const { orders } = this.state;
        return(
            <div className="order-div">
                <h4 className="order-head">Order History</h4>
                {orders ? orders.map((item) =>{
                    return(
                        <div  className="order">
                        <label className="order-head"> {item.restName}</label><hr></hr>
                        <div>
                           <label className="order-data">Items : </label>
                             {item.items ? item.items.map((orderItem) =>{
                                    return (
                                        <div> {orderItem.qty} * {orderItem.name} </div>
                                    )
                                }) : null}
                        </div>               
                        <div>
                            <label className="order-data">Ordered On :  </label>
                            <span> {item.date} </span>
                        </div>
                        <div>
                            <label className="order-data">Total Amount : </label>
                            <span> {item.total} </span>
                        </div>
                         <div>
                            <label className="order-data">Order ID : </label>
                            <span> {item.orderId} </span>
                        </div>
                        <hr></hr>
                        <div>
                            <label className="order-data" > Transaction Status: {item.status}</label>
                            <button style={{float:"right"}} className="btn btn-small btn-primary">Repeat Order</button>
                        </div>
                   </div>
                    )
                }) : <div> No Order Placed !!</div>}
                
            </div>
        )
    }
}

export default OrderHistory;