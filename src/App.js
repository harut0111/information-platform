import React from 'react';
import './App.css';
import Header from "./js/components/Header";
import Footer from "./js/components/Footer";
import Main from "./js/components/Main";

export default function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}