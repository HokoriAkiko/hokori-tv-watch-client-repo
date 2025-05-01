import RecommendList from "../Lists/RecommendList";
import FilteredList from "../Grid/Filtered_List";
import RankList from "../Lists/RankList";
import FilterBlock from "./Filter_Block";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import React from "react";

import "./Filter_Style.css";

const FilteredSeries = (props)=>{
    return(
        <>
        <Header {...props}/>
        <div className="filtered_series">
            <div className="left column_box">
                <FilterBlock {...props}/>
                <FilteredList {...props}/>
            </div>
            <div className="right column_box">
                <RankList {...props}/>
                <RecommendList {...props}/>
            </div>
        </div>
        <Footer {...props}/>
        </>
    )
}

export default FilteredSeries;