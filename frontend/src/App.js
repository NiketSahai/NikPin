import { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import Register from "./components/Register";
import Login from "./components/Login";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import "./app.css";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 28.669081,
    longitude: 77.430412,
    zoom: 8,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
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

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  const navControlStyle = {
    right: 10,
    bottom: 15,
  };

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-122.4, 37.8] },
      },
    ],
  };

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/bulla/ckq86r4fj008418n08ar5n6iu"
      onDblClick={handleAddClick}
      transitionDuration="180"
    >
      <NavigationControl style={navControlStyle} />
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
      {pins.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 3.5}
            offsetTop={-viewport.zoom * 7}
          >
            <Room
              style={{
                fontSize: viewport.zoom * 7,
                color: p.username === currentUser ? "red" : "black",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
            />
          </Marker>

          {p._id === currentPlaceId && (
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={() => setCurrentPlaceId(null)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<Star className="star" />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <strong>{p.username}</strong>
                </span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </>
      ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder="Say us something about this place"
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}

      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
    </ReactMapGL>
  );
}

export default App;
