import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { Map as LeafletMap, LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "../../client/types";

interface MapProps {
  fromPlace: Place | null;
  toPlace: Place | null;
}

export default function Map({ fromPlace, toPlace }: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current && fromPlace && toPlace) {
      const bounds: LatLngTuple[] = [
        [fromPlace.latitude, fromPlace.longitude],
        [toPlace.latitude, toPlace.longitude],
      ];
      mapRef.current.fitBounds(bounds);
    }
  }, [fromPlace, toPlace]);

  const pathPositions: LatLngExpression[] =
    fromPlace && toPlace
      ? [
          [fromPlace.latitude, fromPlace.longitude],
          [toPlace.latitude, toPlace.longitude],
        ]
      : [];

  return (
    <Box height="100%" width="100%">
      <MapContainer
        ref={mapRef}
        center={[47.38, 8.527] as LatLngTuple}
        zoom={12}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {fromPlace && (
          <Marker
            position={[fromPlace.latitude, fromPlace.longitude] as LatLngTuple}
          />
        )}
        {toPlace && (
          <Marker
            position={[toPlace.latitude, toPlace.longitude] as LatLngTuple}
          />
        )}
        <Polyline positions={pathPositions} color="blue" />
      </MapContainer>
    </Box>
  );
}
