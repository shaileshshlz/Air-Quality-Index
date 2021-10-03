import React, { useEffect, useState } from 'react';
import './home-styles.css';
import Good from './Images/Good.png';
import Satisfactory from './Images/Satisfactory.png';
import Moderate from './Images/Moderate.png';
import Poor from './Images/Poor.png';
import VeryPoor from './Images/VeryPoor.png';
import Severe from './Images/Severe.png';
import Charts from './Charts';
 
const socket = new WebSocket('wss://city-ws.herokuapp.com/');

export default function Home(props) {
  const [airData, updateAirData] = useState(null);
  const [formatttedAirData, updateFormattedAirData] = useState(null);

  let updateTimeString = (time) => {
    let timeString = '';
    let sec = Math.floor((Date.now() - time) / 1000);
    if (sec < 5) timeString = 'A Few Seconds Ago';
    else if (sec < 60) timeString = sec + ' Seconds Ago';
    else if (sec < 120) timeString = '1 Minute Ago';
    else if (sec < 3600) timeString = sec / 60 + ' Minutes Ago';
    return timeString;
  };
  useEffect(() => {
    socket.onmessage = function (event) {
      let res = JSON.parse(event.data);
      if (airData === null) {
        updateAirData(
          res.map((item) => {
            return { ...item, updatedAt: Date.now() };
          })
        );
      } else {
        let updatedData=airData.map((item) => {
          let foundItem = res.find((resItem) => resItem.city === item.city);
          return foundItem ? { ...foundItem, updatedAt: Date.now() } : item;
        });
        res.forEach((item)=>{
          let foundItem = airData.find((resItem) => resItem.city === item.city);
          if(foundItem===undefined){
          updatedData.push({...item,updatedAt: Date.now()});
          }
        });
        console.log('updatedd',updatedData,'res',res)
        updatedData=updatedData.sort((a, b) => a.city > b.city&& 1 || -1)       
        updateAirData(updatedData);
        updateFormattedAirData(
          airData.map((item, index) => {
            let aqiImage="";
            if(item.aqi.toFixed(2)<=50) aqiImage=Good;
            else if(item.aqi.toFixed(2)<=100) aqiImage=Satisfactory;
            else if(item.aqi.toFixed(2)<=200) aqiImage=Moderate;
            else if(item.aqi.toFixed(2)<=300) aqiImage=Poor;
            else if(item.aqi.toFixed(2)<=400) aqiImage=VeryPoor;            
            else if(item.aqi.toFixed(2)<=500) aqiImage=Severe;
            return (
              <tr key={index}>
                <td>{item.city}</td>
                <td><div className="aqival"><img src={aqiImage}/><span>{item.aqi.toFixed(2)}</span></div></td>
                <td>{updateTimeString(item.updatedAt)}</td>
              </tr>
            );
          })
        );
      }
    };
  }, [airData]);
  return (
    <div id="dashboard-main">
      <h2>Live Air Quality Dashboard</h2>
      <Charts data={airData}/>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Current AQI</th>
            <th>Last Updated At</th>
          </tr>
        </thead>
        <tbody>{formatttedAirData}</tbody>
      </table>
     
    </div>
  );
}
