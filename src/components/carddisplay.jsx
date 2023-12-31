import React from "react";
import { v4 as uuidv4 } from "uuid";
import Individualcard from "./Individualcard";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Search from "./search";

function CardDisplay({
  stations,
  currentLocation,
  isLocationLoaded,
  setStations,
}) {
  const a ={...currentLocation}
  const [address, setAddress] = useState('');
  const [lat,setLat] = useState(a.lat)
  const [lng,setLng] = useState(a.lng)


  const calculateDistances = () => {
    const yourLatitude = lat;
    const yourLongitude = lng;

    return stations
      .map((station) => {
        const stationLatitude = station.latitude;
        const stationLongitude = station.longitude;

        const distance = calculateDistance(
          yourLatitude,
          yourLongitude,
          stationLatitude,
          stationLongitude
        );

        return {
          ...station,
          distance: distance,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 32);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Radius of the Earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const closestStations =
    isLocationLoaded && currentLocation ? calculateDistances() : [];

  

  return (
    <div>
      <br></br><br></br><br></br><br></br>
      <Search currentLocation = {currentLocation} 
      setLat = {setLat}
      setLng = {setLng}
      address={address} 
      setAddress = {setAddress}/>
      <br></br>
      <Row
        xs={1}
        md={4}
        className="g-4"
        style={{
          marginLeft: "100px",
          marginRight: "100px",
          display: "flex",
        }}
      >
        {closestStations.map((station) => (
          <Col key={station}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Individualcard
                key={station.id}
                station={station}
                stations={stations}
                setStations={setStations}
                stationLatitude={station.latitude}
                stationLongitude={station.longitude}
                lat = {lat}
                lng = {lng}
              />
            </div>
          </Col>
        ))}
      </Row>
      <br></br>
    </div>
  );
}

export default CardDisplay;