import RecommendList from "../Lists/RecommendList.js";
import RecentlyUpdated from "../Grid/Recently_Updated.js";
import RankList from "../Lists/RankList.js";
import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import NewlyAdded from "../Grid/Newly_Added.js";
import Gallery from "./Gallery.js";
import React from "react";

import "./Home_Style.css";

const Home = (props)=>{

    return(
        <>
        <Header {...props}/>
        <div className="home">
            <div className="left column_box">
                <Gallery {...props}/>
                <RecentlyUpdated {...props}/>
                <NewlyAdded {...props}/>
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

export default Home;