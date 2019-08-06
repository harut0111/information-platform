import React from 'react';
import './App.css';
import Header from "./js/components/Header";
import Footer from "./js/components/Footer";
import Main from "./js/components/Main";
import { BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./js/components/Home";
import SignUp from "./js/components/SignUp";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/Home" component={Home} />
          <Route path="/SignUp" component={SignUp} />
          <Route path="/" component={Main} />
          {/* <Route component={Main} /> */}
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}