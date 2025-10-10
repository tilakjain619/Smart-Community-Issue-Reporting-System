import React, { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapUI = ({ issues }) => {
    const mapRef = useRef(null);

    const defaultLatitude = 19.95616816320774;
    const defaultLongitude = 73.82404782359492;

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                if (mapRef.current) {
                    mapRef.current.setView([latitude, longitude], 13);
                }
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return (
        <div className="rounded-lg overflow-hidden">
            <MapContainer
                center={[defaultLatitude, defaultLongitude]}
                zoom={13}
                style={{ height: "50vh", width: "100%" }}
                whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Array.isArray(issues) &&
                    issues.map((issue) => {
                        const { coordinates } = issue;
                        if (!coordinates) return null;
                        // Import leaflet and set up custom icons

                        // Define custom marker icons based on status
                        const statusIcons = {
                            "pending": new L.Icon({
                                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41],
                            }),
                            "in-progress": new L.Icon({
                                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
                                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41],
                            }),
                            "resolved": new L.Icon({
                                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
                                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41],
                            }),
                        };

                        const markerIcon =
                            statusIcons[issue.status] || statusIcons["pending"];

                        return (
                            <Marker
                                key={issue._id}
                                position={[coordinates.latitude, coordinates.longitude]}
                                icon={markerIcon}
                            >
                                <Popup>
                                    <div>
                                        <strong>{issue.title}</strong><br />
                                        <strong>Date posted:</strong> {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A"}<br />
                                        <strong>Status:</strong> {issue.status || "pending"}<br />
                                        {issue.imageUrl && (
                                            <div style={{ marginTop: "8px" }}>
                                                <img
                                                    src={issue.imageUrl}
                                                    alt="Uploaded"
                                                    style={{ width: "100%", maxWidth: "200px", maxHeight: "150px" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>
        </div>
    );
};

export default MapUI;
