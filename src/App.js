import React , {useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import MapBox from './MapBox';



const  App = () => {
 
  return (
    <MapBox />
  )
}

export default App;
