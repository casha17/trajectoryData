import { bgColor } from 'ansi-styles'
import React, { Component } from 'react'
import {   Circle,
    CircleMarker,
    Map,
    Polygon,
    Polyline,
    Popup,
    Rectangle,
    TileLayer, Marker } from 'react-leaflet'
    import { CSVReader } from 'react-papaparse'

    const buttonRef = React.createRef()

    const center = [56.25714966666666 ,10.0690625,56]

const array = [
]

export default class MapBox extends Component {
  constructor(props) {
      super(props);
      this.state = {data: [] , meanData: [] , medianData: []}
  }

  applyMean = () => {
    let tempArray = []; 
    let finalArray = [];
    let counter = 0;
    this.state.data.forEach((item) => {
        if (tempArray.length == 5) {
        var latSum = 0.0
        var longSum = 0.0
          tempArray.forEach((item) => {
              latSum += parseFloat(item[0]);
              longSum += parseFloat(item[1]);
          });
          finalArray.push([(latSum/5) , (longSum/5)])
          tempArray.shift();
          tempArray.push(item)
        }else {
            tempArray.push(item);
        };
        
    })
    this.setState({meanData: finalArray})
    
}


applyMedian = () => {
    let tempArray = []; 
    let finalArray = [];
    let counter = 0;
    this.state.data.forEach((item) => {
        if (tempArray.length == 6) {
            let latSum = [];
           let  longSum = [];
          tempArray.forEach((item) => {
              latSum.push(parseFloat(item[0]));
              longSum.push(parseFloat(item[1]));
          });
          latSum.sort();
          longSum.sort();
          finalArray.push([latSum[3] , longSum[3]]);
          tempArray.shift();
          tempArray.push(item)
        }else {
            tempArray.push(item);
        };
        
    })
    this.setState({medianData: finalArray})
    
}

  handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point 
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }
  handleOnFileLoad = (data) => {
    console.log('data');
    var newData = data.slice(1);
    const ar = [];
    newData.map((arr) => {
        ar.push([arr.data[3] , arr.data[4]]); 
    });
    ar.pop();
    this.setState({data : ar})
    
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }





  handleOnRemoveFile = (data) => {
    this.setState({data: []})
  }

  handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  render() {
          return (
        <div  >
        <CSVReader
        ref={buttonRef}
        onFileLoad={this.handleOnFileLoad}
        onError={this.handleOnError}
        noClick
        noDrag
        onRemoveFile={this.handleOnRemoveFile}
      >
        {({ file }) => (
          <aside
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 10
            }}
          >
            <button
              type='button'
              onClick={this.handleOpenDialog}
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                width: '40%',
                paddingLeft: 0,
                paddingRight: 0
              }}
            >
              Browe file
            </button>
            <div
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#ccc',
                height: 45,
                lineHeight: 2.5,
                marginTop: 5,
                marginBottom: 5,
                paddingLeft: 13,
                paddingTop: 3,
                width: '60%'
              }}
            >
              {file && file.name}
            </div>
            <button
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 20,
                paddingRight: 20
              }}
              onClick={this.handleRemoveFile}
            >
              Remove
            </button>
          </aside>
        )}
      </CSVReader>
      <button style={{height: 50 , width: 100 , backgroundColor: 'red'} } onClick={() => {
          this.applyMedian();
      }} >
          Apply Median
      </button>
      <button style={{height: 50 , width: 100 , backgroundColor: 'green'}} onClick={() => this.applyMean()} >
          Apply mean
      </button>
     
      <Map style={{height: 700 , width: 1000}} center={center} zoom={13}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

          {this.state.data.map( (item , index) =>{ 
              return (
                  <>
          <CircleMarker center={item} color="blue" fillOpacity={10} radius={3} />

          </>
          
          )})}
          <Polyline color="blue" positions={this.state.data} />
           {this.state.medianData.map( (item , index) =>{ 
              return (
                  <>
          <CircleMarker center={item} color="red" fillOpacity={10} radius={3} />

          </>
          
          )})}
          <Polyline color="red" positions={this.state.meanData} />
           {this.state.meanData.map( (item , index) =>{ 
              return (
                  <>
          <CircleMarker center={item} color="green" fillOpacity={10} radius={3} />

          </>
          
          )})}
          <Polyline color="green" positions={this.state.medianData} />
      </Map>
      </div>
    )
  }
}