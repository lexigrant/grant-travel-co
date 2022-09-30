import React from "react";
import GoogleMapReact from "google-map-react";
import { Travel } from "../Types";
import TravelEntry from "./TravelEntry";

type MapProps = {
    travelEntry: Travel;
}

const Map = (props: MapProps) => {

    const location = {
        center: { lat: (props.travelEntry.latitude), lng: (props.travelEntry.longitude) } as GoogleMapReact.Coords,
        zoom: 12
    }
    const key = process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    return (
        <>
            <div style={{ "height": 500, "width": "33rem" }}>
                {key && <GoogleMapReact
                    bootstrapURLKeys={{
                        key: key,
                        language: "en"
                    }}
                    defaultCenter={location.center}
                    center={location.center}
                    defaultZoom={location.zoom}

                >

                </GoogleMapReact>}
            </div>
        </>
    )
}

export default Map;