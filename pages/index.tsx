import { useState, useEffect, FormEvent } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark as style } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { firebase } from "src/initFirebase";
import FirebaseAuth from "src/firebaseAuth";
import { useAuth } from "src/authProvider";
import {
  GoogleMap,
  useLoadScript,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
//import mapStyles from "./mapStyles";

const mapContainerStyle = {
  with: "100vw",
  height: "100vh",
};

const center = {
  lat: 54.70791568888703,
  lng: 25.25803023912335,
};

// const options = {
//   styles: mapStyles,
// };

const db = firebase.database();
const libraries = ["places"];
const [markers, setMarkers] = useState([] as any);

export default function Home() {
  //console.log(process.env.NEXT_APP_GOOGLE_MAPS_APIE_KEY);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAvY9qc9qANpIAvCX3MoSJfwjsMx_Ns_uQ",
    libraries: ["places"],
  });

  const { user, loading, logout } = useAuth();

  if (loading) return null;
  if (!user) return <FirebaseAuth />;

  console.log("isLoaded:" + isLoaded);
  if (loadError) return "Errors loadng maps";
  if (!isLoaded) return "Loading maps";

  return (
    <main>
      <button type="button" onClick={logout} className="link">
        Logout
      </button>
      <div>
        <h2>
          <span role="img" aria-label="rent">
            📍
          </span>
        </h2>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          //options={options}
          onClick={(event) => {
            setMarkers((current: any) => [
              ...current,
              {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                time: new Date(),
              },
            ]);
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </GoogleMap>
      </div>
    </main>
  );
}
