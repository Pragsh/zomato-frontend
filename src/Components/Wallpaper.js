import React from "react";
import axios from 'axios';
import '../Styles/Home.css';
import '../Styles/wallpaper.css';
import {withRouter} from 'react-router-dom';

class Wallpaper extends React.Component{

    constructor(){
        super();
        this.state = {
            locations : [],
            suggestions : [],
            inputValue : ''
        }
    }
    handleLocationChange = (e) =>{
        let locationId = e.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method : 'GET',
            url : `http://localhost:2023/restuarantbycity/${locationId}`,
            headers :  { 'content-type': 'application/json'}
        }).then(response =>  {
            this.setState({ locations: response.data.restaurants})
            }
        ).catch(
            err => {console.log(err);}
        )
    }

    handleSearch = (event) => {
        const searchText = event.target.value;
        const {locations} = this.state;
        let filteredRest =[];
        if(searchText.length > 0){
            
            filteredRest = locations.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
            }
         this.setState({suggestions : filteredRest});
        }

        handleItemClick = (item) =>{

            this.setState({inputValue : item.name, suggestions:[]})
            this.props.history.push(`/details/?restuarant=${item._id}`)
        }

    renderSuggestions(){
        let {suggestions} = this.state;

        if(suggestions.length == 0){
            return null;
        }else{
            return(
                <ul className="unorderlist">
                    {
                        suggestions.map((item, index) => (
                            <li className="list" key={index} onClick={() => this.handleItemClick(item)}>{`${item.name} , ${item.city}`}</li>
                        ))
                    }
                </ul>
            )
        }
    }

    render(){
        const { DDlocations } = this.props;
        const {locations, suggestions, inputValue} = this.state;
        console.log("DDlocations",locations, suggestions);
        return(
            <div>
                <img src="./Images/HomePageWall.png" height="450" width="100%"/>
				<div className="heading-wallpaper"> Find the best restaurants, cafés, and bars</div>

                <div className="search-box">
                    <select className="search-select" defaultValue={"Select"} onChange={this.handleLocationChange}>
                        <option disabled> Select</option>
                        { DDlocations.map((item) => {
                            return  <option value={item.location_Id}> {`${item.name}, ${item.City}`}</option>
                        })}
                    </select>
                   
                        <div id="notebooks" style={{display: "inline-block",height: "22px"}} >
                            <input  className="search-input" type="text" value={inputValue} placeholder="Please Enter Restuarant Name" onChange={this.handleSearch}/>
                            {this.renderSuggestions()}
                        </div>
                        
                        <span className="glyphicon glyphicon-search search-icon"></span>
                        
                </div> 
            </div>
        )
    }
}

export default withRouter(Wallpaper);