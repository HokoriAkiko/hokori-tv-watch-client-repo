import React, { useCallback, useLayoutEffect, useState } from "react";
import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Home from "./Home/Home";
import Watch from "./Watch/Watch";
import FilteredSeries from "./Filter/Filtered_Series";


const RoutedApp = ()=>{
  const [viewport,set_viewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  const handle_resize = useCallback(()=>set_viewport({ width: window.innerWidth, height: window.innerHeight }),[]);
  
  useLayoutEffect(()=>{
    window.addEventListener("resize",handle_resize);
    handle_resize();
    return ()=>window.removeEventListener("resize",()=>{});
  },[handle_resize])
  
  const pass = { viewport };
  return(
      <Routes>
        <Route path="/" element={<Home {...pass}/>}/>
        <Route path="/filter" element={<FilteredSeries {...pass}/>}/>
        <Route path="/watch" element={<Watch {...pass}/>}/>
      </Routes>
  )
}

const App = ()=> <Router><RoutedApp/></Router>

export default App;
