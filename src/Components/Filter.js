import React from "react";
import queryString from 'query-string';
import axios from 'axios';
import { AiFillCaretDown } from "react-icons/ai";
import '../Styles/Filter.css';

class Filter extends React.Component{

    constructor(){
        super();
        this.state ={
            restuarant :[],
            filterDDlocations :[],
            location_id : undefined,
            mealtype_id : undefined,
            cuisine :[],
            lcost:undefined,
            hcost:undefined,
            sort:undefined,
            page : 1,
            nextPage : undefined,
            totalPages : undefined
        }

    }

    handlePrevious = () =>{
        
        let {page} = this.state;
        if(page > 1){
            this.handlePagination(--page);
        }
    }

    handleNext = () =>{
        
        let {page, totalPages} = this.state;
        if(page < totalPages){
            this.handlePagination(++page);
        }
    }

    handlePagination(pageNo){
        debugger;
        let {location_id, mealtype_id,cuisine, lcost, hcost,sort} = this.state;
        let inputObj ={
            mealtype_id : mealtype_id,
            cuisine : cuisine,
            lcost : lcost,
            hcost : hcost,
            location_id :location_id,
            sort:sort,
            page: pageNo
        }
        this.apiCall(inputObj);
    }

    sortData(sort){
        let {location_id, mealtype_id,cuisine, lcost, hcost, page} = this.state;
        let inputObj ={
            mealtype_id : mealtype_id,
            cuisine : cuisine,
            lcost : lcost,
            hcost : hcost,
            location_id :location_id,
            sort:sort,
            page : page
        }
        this.apiCall(inputObj);
    }

    handleLocationFilter(e){
        let {mealtype_id,cuisine, lcost, hcost, sort, page} = this.state;
        let inputObj ={
            mealtype_id : mealtype_id,
            cuisine : cuisine,
            lcost : lcost,
            hcost : hcost,
            sort : sort,
            page : page,
            location_id : e.target.value
        }
        this.apiCall(inputObj);
    }

    
    filterByCost(lcost, hcost){

        let { location_id, mealtype_id, cuisine, sort, page} = this.state;
       
        let inputObj ={
            mealtype_id : mealtype_id,
            location_id : location_id,
            cuisine : cuisine,
            sort : sort,
            lcost : lcost,
            hcost : hcost,
            page : page
        }
        this.apiCall(inputObj);
    }

    filterByCuisine(e){
      
        let {cuisine, location_id, mealtype_id, lcost, hcost, sort, page} = this.state;
        let index;
            if (e.target.checked) {
            cuisine.push(e.target.value)
        } else {
            index = cuisine.indexOf(e.target.value)
            cuisine.splice(index, 1)
        }

        let inputObj ={
            mealtype_id : mealtype_id,
            location_id : location_id,
            lcost : lcost,
            hcost: hcost,
            sort : sort,
            cuisine : cuisine,
            page : page
        }
        
         // update the state with the new array of options
         this.apiCall(inputObj);
    }

    apiCall(inputObj){

        let { mealtype_id, location_id, cuisine, lcost, hcost, sort, page } = inputObj;

        //Filter API Call
        axios({
            method : 'POST',
            url:'http://localhost:2023/filter',
            headers :  { 'content-type': 'application/json'},
            data : inputObj
        }).then(
            response => (this.setState({restuarant : response.data.restaurants,nextPage : response.data.nextPage, mealtype_id, location_id , cuisine, lcost, hcost, sort, page}))
        ).catch(
            err => {console.log("Response has errors");}
        )
    }
   
    handleNavigate(restId){
        this.props.history.push(`/details?restuarant=${restId}`);
    }

    componentDidMount(){
        
     let qs = queryString.parse(this.props.location.search);
        let inputObj ={
            mealtype_id : qs.mealTypeId,
            location_id : qs.locationId
        }

        //fetch location dropdown of this filter page filter div

        axios({
            method : 'GET',
            url:'http://localhost:2023/locations'
        }).then(
            response => (this.setState({filterDDlocations : response.data}))
        ).catch(
            err => {console.log("Response has errors");}
        )

        // fetch restuarant for location
        axios({
            method : 'POST',
            url:'http://localhost:2023/filter',
            headers :  { 'content-type': 'application/json'},
            data : inputObj
        }).then(
            response => (this.setState({restuarant : response.data.restaurants,totalPages:response.data.noOfPages,nextPage : response.data.nextPage, mealtype_id : inputObj.mealtype_id, location_id : inputObj.locationId}))
        ).catch(
            err => {console.log("Response has errors");}
        )

    }

    render(){
        const { restuarant, filterDDlocations, page, nextPage } = this.state;

        let pages = [];

        for(let i=1; i<= page ;i++){
            pages.push(i);
        }
        if(nextPage){
            pages.push(page+1);
        }
      
        return(
            <div>
                <div className="container-fluid">

                    <div className="heading">BreakFast Places in Mumbai</div>   
                        <div className="row">
                            <div className="col-sm-4 col-md-4 col-lg-4">
                                    <div style={{display: "inline-block"}}>
                                <div  className="filter_Div">
                                    <div>
                                        <div className="filters"> Filters/Sort </div>
                                         <span style={{marginLeft :"60%"}} className="toggle-span" data-toggle="collapse" data-target="#filterContent"><AiFillCaretDown/></span>
                                        
                                    </div>
                                <div id="filterContent" className="collapse show">

                                            <div className="select"> Select Location </div>
                                            <select className="select_Box" onChange={this.handleLocationFilter.bind(this)}>
                                                      <option>Select Location</option>
                                                      {
                                                          filterDDlocations.map((item,index) =>{
                                                            return <option key={index} value={item.location_Id}>{item.name}</option>
                                                          })
                                                      }
                                                    </select>
                                            <div>
                                                <label  className="select"> Cuisine</label>
                                                <div>
                                                    <input type="checkbox" className="check" name="" value="North Indian" onChange={this.filterByCuisine.bind(this)}/>
                                                    <span> North Indian</span>
                                                </div>
                                                <div>
                                                    <input type="checkbox" className="check" value="South Indian" onChange={this.filterByCuisine.bind(this)} />
                                                    <span> South Indian</span>
                                                </div>
                                                <div>
                                                    <input className="check" type="checkbox" value="Chinese" onChange={this.filterByCuisine.bind(this)}/>
                                                    <span> Chinese</span>
                                                </div>
                                                <div>
                                                    <input type="checkbox" className="check" value="Fast Food" onChange={this.filterByCuisine.bind(this)}/>
                                                    <span> Fast Food</span>
                                                </div>
                                                <div>
                                                    <input type="checkbox" className="check" value="Street Food" onChange={this.filterByCuisine.bind(this)}/>
                                                    <span> Street Food</span>      
                                                </div>                  
                                            </div>
                                            <div className="radio-options"> 
                                                <label  className="select"> Cost For Two</label>
                                                <div>
                                                    <input type="radio" name="costfortwo"  onChange={()=> {this.filterByCost(1,500)}} />
                                                    <span> Less than ₹ 500</span>
                                                </div>
                                                <div>
                                                    <input type="radio" name="costfortwo"  onChange={()=> {this.filterByCost(500, 1000)}} />
                                                    <span> ₹ 500 to ₹ 1000</span>
                                                </div>
                                                <div>
                                                    <input type="radio" name="costfortwo"   onChange={()=> {this.filterByCost(1000, 1500)}} />
                                                    <span> ₹ 1000 to  ₹ 1500</span>
                                                </div>
                                                <div>
                                                    <input type="radio" name="costfortwo"  onChange={()=> {this.filterByCost(1500, 2000)}} />
                                                    <span> ₹ 1500 to  ₹ 2000 </span>
                                                </div>
                                                <div>
                                                    <input type="radio" name="costfortwo"  onChange={()=> {this.filterByCost(2000, 10000)}} />
                                                    <span> ₹ 2000+ </span>      
                                                </div>                  
                                            </div>
                                            <div className="radio-options"> 
                                                <label  className="filters">Sort</label>
                                                <div>
                                                    <input type="radio" name="sort" onChange={()=>{this.sortData(1)}}/>
                                                    <span> Price low to high</span>
                                                </div>
                                                <div>
                                                    <input type="radio" name="sort" onChange={()=>{this.sortData(-1)}}/>
                                                    <span> Price high to low</span>      
                                                </div>     
                                                
                                        </div>        
                                    </div>
                                </div>
                            </div>
                                </div>
                                <div className="col-sm-8 col-md-8 col-lg-8">
                                             
                                {restuarant && restuarant.length >0 ?restuarant.map((item => {
                                           return(
                                                   <div className="item" onClick={() =>{this.handleNavigate(item._id)}}>
                                                        <div  style={{display: "inline-block",width:"30%"}}> 
                                                            <img src="./Images/Rest1.png"/>
                                                        </div>
                                                        <div  className="item-content-div">
                                                            <div className="rest_headings">{item.name}</div>
                                                            <div className="rest_details">{item.rating_text}</div>
                                                            <div className="rest_details">{`${item.locality}, ${item.city}`}</div>
                                                        </div>
                                                        <hr/>
                                                        <div  className="item-content-div">
                                                            <div className="item-details"> CUISINES :</div>
                                                            <div  className="item-details"> COST FOR TWO :</div>
                                                        </div>
                                                        <div  style={{display: "inline-block",width:"30%"}}> 
                                                            <div className="select">{item.cuisine.map((item) => `${item}, `)}</div>
                                                            <div className="select">{item.min_price}</div>
                                                        </div>
                                                
                                                </div>
                                           ) 
                                })) : <div> No Records Found.... </div>} 
                                
                                </div>
                               {
                                   restuarant && restuarant.length ? <div className="pagination">
                                    
                                   <div className="pagination_PageNo" style={{opacity: "0.4"}} onClick={this.handlePrevious}> &laquo; </div>
                                
                                   {
                                     pages.map((item) =>{
                                         return(
                                            <div className="pagination_PageNo"
                                            onClick={()=> {this.handlePagination(item)}}>{item}</div> 
                           
                                         )
                                     })
                                          
                                      
                                   }
                                <div className="pagination_PageNo" style={{opacity: "0.4"}} onClick={this.handleNext}> &raquo; </div>
                       </div> : null
                               } 
                        </div>
                    </div>
        
            </div>
            )
    }
}

export default Filter;