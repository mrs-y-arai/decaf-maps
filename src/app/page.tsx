'use client';

import { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  MapControl,
  ControlPosition,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';

import { Button } from '~/components/ui/button';

export default function Home() {
  return (
    <div>
      <h1 className="py-4 text-center text-2xl font-bold">行きつけマップ</h1>
      <div className="relative mx-auto h-[600px] w-full">
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        >
          <MapWrapper />
        </APIProvider>
      </div>
    </div>
  );
}

function MapWrapper() {
  const map = useMap();

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const [center, setCenter] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -3.745,
    lng: -38.523,
  });

  const [clickedLatLng, setClickedLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  /**
   * 現在地へ移動
   */
  const moveToCurrentLocation = () => {
    // TODO: エラーハンドリング
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map?.panTo({ lat: latitude, lng: longitude });
      setCenter({ lat: latitude, lng: longitude });
    });
  };

  return (
    <>
      <Map
        style={containerStyle}
        defaultCenter={center}
        defaultZoom={18}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string}
        onClick={(event) => {
          const lat = event.detail.latLng?.lat;
          const lng = event.detail.latLng?.lng;

          if (lat && lng) {
            setClickedLatLng({ lat, lng });
          }
        }}
      >
        <MarkerWithInfoWindow
          position={center}
          content="現在地"
          isDefaultOpen={true}
        />
        {clickedLatLng && (
          <MarkerWithInfoWindow
            position={clickedLatLng}
            content="クリックした場所"
          />
        )}
        <MapControl position={ControlPosition.BOTTOM_CENTER}>
          <Button onClick={moveToCurrentLocation}>現在地へ移動</Button>
        </MapControl>
      </Map>
    </>
  );
}

function MarkerWithInfoWindow({
  position,
  content,
  isDefaultOpen = false,
}: {
  position: { lat: number; lng: number };
  content: string;
  isDefaultOpen?: boolean;
}) {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(isDefaultOpen);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    [],
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <p>{content}</p>
        </InfoWindow>
      )}
    </>
  );
}
