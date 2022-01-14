import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons'
import './App.css';
import axios from "axios";
import { useEffect } from 'react';
import { format } from 'timeago.js'
function App() {
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
        console.log(allPins.data);

      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"

      >
        {pins.map(p => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-20}
              offsetTop={-10}>
              <Room style={{ fontSize: viewport.zoom * 7, color: "slateblue" }}
                               onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
                    <Popup
              latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
              anchor="left" >
            <div className='card'>
              <label>Place</label>
              <h4>{p.title}</h4>
              <label>Review</label>
              <p className='desc'>{p.desc}</p>
              <label>Rating</label>
              <div className='stars'>
                <Star className='star' />
                <Star className='star' />
                <Star className='star' />
                <Star className='star' />
                <Star className='star' />
              </div>
              <label>Information</label>
              <span className='username'>Created By <b>{p.username}</b></span>
              <span className='date'>{format(p.createdAt)}</span>
            </div>
          </Popup>
            )}
      </>
        ))}
    </ReactMapGL>

    </div >
  );
}

export default App;
