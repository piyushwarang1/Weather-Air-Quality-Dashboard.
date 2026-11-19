import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    useMapEvents,
} from "react-leaflet";


function MapClick({ onLocationSelect }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            const latitude = e.latlng.lat;
            const longitude = e.latlng.lng;
            const selectedPosition = [latitude, longitude];

            setPosition(selectedPosition);
            onLocationSelect({ latitude, longitude });
        },
    });

    return position ?(
        <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
            color: "white",
            fillColor: "#ff3333",
            fillOpacity: 1.0,
        }}
        />
    ):null;
}

function WorldMap({ onLocationSelect }) {
        return (
        <MapContainer
            center={[0, 0]}
            zoom={2}
            scrollWheelZoom={true}
            className="world-map"
        >

            <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
             url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClick onLocationSelect={onLocationSelect} />

        </MapContainer>

    );
}

export default WorldMap;

