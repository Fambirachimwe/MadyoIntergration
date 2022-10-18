import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import NavBar from './Components/NavBar';
import Hero from './Components/Hero';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import BuyAirtime from './Components/BuyAirtime';
import BuyZesa from './Components/BuyZesa';



const App = () => {
  return (

    <ChakraProvider>

      <Router>
        <div className="App">

          <NavBar />
          {/* <Hero /> */}

          {/* bills */}

          <Routes>
            <Route exact path={'/'} element={(<Hero />)} />
            <Route exact path={'/airtime'} element={(<BuyAirtime />)} />
            <Route exact path={'/zesa'} element={(<BuyZesa />)} />
          </Routes>

        </div>

      </Router>


    </ChakraProvider>

  )
}

export default App

