'use client';

import { useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

import { Button } from '~/components/ui/button';

export default function Home() {
  const containerStyle = {
    width: '100vw',
    height: '100vh',
  };

  const [center, setCenter] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -3.745,
    lng: -38.523,
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
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
      setCenter({ lat: latitude, lng: longitude });
    });
  };

  return (
    <div className="relative">
      {isLoaded ? (
        <>
          <GoogleMap
            onClick={(event) => {
              const lat = event.latLng?.lat();
              const lng = event.latLng?.lng();
              if (lat && lng) {
                setClickedLatLng({ lat, lng });
              }
            }}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            options={{
              zoomControl: false,
              streetViewControl: false,
              maxZoom: 18,
              minZoom: 8,
              mapTypeControl: false,
            }}
          >
            <Marker position={center} />
            <MarkerWithInfoWindow />
            {clickedLatLng && (
              <>
                <InfoWindow
                  position={clickedLatLng}
                  onCloseClick={() => setClickedLatLng(null)}
                >
                  <div>
                    <div className="text-black">ここに場所を登録しますか？</div>
                    <Button>登録する</Button>
                  </div>
                </InfoWindow>
              </>
            )}
          </GoogleMap>
          <Button
            onClick={moveToCurrentLocation}
            className="absolute bottom-10 right-10"
          >
            現在地へ移動
          </Button>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function MarkerWithInfoWindow() {
  const [isOpenInfoWindow, setIsOpenInfoWindow] = useState(false);

  const center = {
    lat: -3.745,
    lng: -38.523,
  };

  const infoWindowCenter = {
    lat: -3.705,
    lng: -38.523,
  };

  return (
    <>
      <Marker position={center} onClick={() => setIsOpenInfoWindow(true)} />
      {isOpenInfoWindow && (
        <InfoWindow
          position={infoWindowCenter}
          onCloseClick={() => setIsOpenInfoWindow(false)}
        >
          <div className="text-black">Hello World</div>
        </InfoWindow>
      )}
    </>
  );
}
