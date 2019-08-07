import React from 'react';
import './App.css';
import Header from "./js/components/Header";
import Footer from "./js/components/Footer";
import Main from "./js/components/Main";
import { Router, Route, Switch } from "react-router-dom";
import history from './js/routh/history';
import Home from "./js/components/Home";
import SignUp from "./js/components/SignUp";
import Admin from './js/components/Admin';

export default function App() {

  return (
    <Router history={history}>
      <div className="App">
        <Header />
        <Switch>
            <Route path="/Home" component={Home} />
            <Route path="/SignUp" component={SignUp} />
            <Route path="/Admin" component={Admin} />
            <Route path="/" component={Main} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

