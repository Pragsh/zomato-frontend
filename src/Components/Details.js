import React from "react";
import queryString from 'query-string'; 
import Order from './order';
import '../Styles/Details.css';
import axios from "axios";
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { GrFormClose } from "react-icons/gr";

class Details extends React.Component{

    constructor(){
        super();
        this.state ={
            restuarantData : {},
            isGalleryModalOpen : false,
            isPlaceOrderModal : false,
            restId : undefined
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

    handleModal = (state, value) =>{
        if(sessionStorage.getItem('userLoggedIn') && sessionStorage.getItem('userLoggedIn') != "false" ){
            this.setState({[state] : value});;
        }else{
            alert("Please login to continue")
        }
    }

    componentDidMount(){
        let qs = queryString.parse(this.props.location.search);
        let restId = qs.restuarant;

        axios({
            method : 'GET',
            url:`http://localhost:2023/getRestuarantById/${restId}`
        }).then(
            response => (this.setState({restuarantData : response.data.restaurant , restId}))
        ).catch(
            err => {console.log(err);}
        )
    }

    render(){
        const {restuarantData, isGalleryModalOpen, isPlaceOrderModal} = this.state;
        return(
            <div>
                 <div className="container">
                        <div>
                            <img style={{objectFit: "cover"}} src="./Images/Restdetail.png" height="400px" width="100%"/>
                            <button className="img-gallery-btn generalfont" onClick={() => {this.handleModal('isGalleryModalOpen',true)}}>Click to See Image Gallery</button>
                        </div>
                
                        <div className="details generalfont"> 
                            {restuarantData.name}
                        </div>

                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active headings" id="overview-tab" data-toggle="tab" href="#overview" role="tab">Overview</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link headings" id="contact-tab" data-toggle="tab" href="#contact" role="tab"  >Contact</a>
                            </li>
                            <div style={{marginLeft : "66%"}}> 
                                    <button className="btn btn-danger" onClick={() => {this.handleModal('isPlaceOrderModal',true)}}>Place Online Order</button>
                            </div>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active tab-div" id="overview" role="tabpanel">
                                <div>
                                    <label className="headings">About this place</label><br></br>
                                    <span>{restuarantData.rating_text}</span>
                                </div>
                                <div>
                                     <label className="headings">Cuisine</label><br></br>
                                    <span>
                                        {restuarantData && restuarantData.cuisine ? 
                                             restuarantData.cuisine.map((item) => `${item} , `) : null}
                                    </span>
                                </div>
                                <div>
                                    <label className="headings">Average Cost : </label><br></br>
                                    <span> &#8377; {restuarantData.min_price} for two people (approx.)</span>
                                </div>
                            </div>
                            <div className="tab-pane fade tab-div" id="contact" role="tabpanel">
                            <div>
                                <label className="headings"> Contact No : </label><br></br>
                                <span> {restuarantData.contact_no} </span>
                            </div>
                            <div>
                                <label className="headings"> Address </label><br></br>
                                <span> {`${restuarantData.locality} , ${restuarantData.city}`} </span>
                            </div>
                            </div>
                        </div>

                    </div>

                    <Modal
                        isOpen={isGalleryModalOpen}
                        style={this.customStyles}
                        >
                            <div style={{width: "800px"}}>
                                <div onClick={() => {this.handleModal('isGalleryModalOpen',false)}} style={{float : 'right'}}><GrFormClose/></div>        
                                <Carousel showThumbs={false}>
                                    { restuarantData && restuarantData.thumb ? restuarantData.thumb.map((path) =>{
                                    return(
                                            <div>
                                                <img src={path} height="400px" width="200px"/>
                                            </div>
                                        )
                                    })
                                        :
                                        null
                                    }
                                </Carousel>
                            </div>
                    </Modal>

                    <Modal
                    isOpen={isPlaceOrderModal}
                    style={this.customStyles}
                    >
                        
                <GrFormClose onClick={() =>{this.handleModal('isPlaceOrderModal',false)}} style={{float : 'right'}}/>
                          <Order restId={this.state.restId} restName={restuarantData.name} />
                    </Modal>
            </div>
        )
    }
}

export default Details;