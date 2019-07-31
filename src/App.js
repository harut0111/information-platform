import React from 'react';
import './App.css';
import Header from "./js/components/Header";
import Footer from "./js/components/Footer";
import MainLeftSide from "./js/components/MainLeftSide";
import MainRightSide from "./js/components/MainRightSide";


export default function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <MainLeftSide />
        <MainRightSide />
      </main>
      <Footer />
    </div>
  );
}