import React from "react";
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';
import axios from 'axios';

class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            locations :[],
            quickSearch :[]
        }
    }

    componentDidMount(){
        
        sessionStorage.clear();
        //location API call
        axios({
            method : 'GET',
            url:'https://zomatobackendapp.herokuapp.com/locations'
        }).then(
            response => (this.setState({locations : response.data}))
        ).catch(
            err => {console.log("Response has errors");}
        )

        // Quick Search API Call
        axios({
            method : 'GET',
            url:'https://zomatobackendapp.herokuapp.com/mealtypes'
        }).then(
            response => (this.setState({quickSearch : response.data.mealtypes}))
        ).catch(
            err => {console.log("Response has errors");}
        )

    }
    render(){
        const { locations , quickSearch} = this.state;
        return(
            <div>
                <Wallpaper DDlocations={locations} />
                <QuickSearch mealtypes={quickSearch} />
            </div>
        )
    }
}

export default Home;