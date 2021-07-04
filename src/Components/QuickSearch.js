import React from "react";
import { withRouter } from 'react-router-dom';
import '../Styles/Home.css'

class QuickSearch extends React.Component{

    handleClick = (mealTypeId) =>{
        let locationId = sessionStorage.getItem('locationId');
        if(locationId){
            this.props.history.push(`/filter?mealTypeId=${mealTypeId}&locationId=${locationId}`);
        }else{
            this.props.history.push(`/filter?mealTypeId=${mealTypeId}`);
        }
    }

    render(){
        const {mealtypes} = this.props;
        return(
            <div>
                <div className="container">

                    <h1 className="quick-search-heading">Quick Searches</h1>
                    <label className="discover">Discover restaurants by type of meal</label>
                    <div className="row">
                { mealtypes.map((item => {
                    return (
                           
                                <div className="col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleClick(item.meal_type)}>
                                    <div className="quick-search-div">
                                        <div style={{display: "inline-block",width: "50%"}}>
                                            <img src={item.image} width="180px" height="160px" />
                                        </div>
                                        <div style={{display: "inline-block",width: "40%", marginLeft : "25px"}}>
                                            <div className="food-category">{item.name}</div>
                                            <div className="discover" style={{fontSize: "13px"}}>{item.content}</div>
                                        </div>
                                    </div>
                                </div>
                    )
                }))}
                
                </div>
              </div>
            </div>
        )
    }
}

export default withRouter(QuickSearch);