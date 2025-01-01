'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  APIProvider,
  Map,
  MapControl,
  ControlPosition,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
  useMap,
  useMapsLibrary,
  Pin,
} from '@vis.gl/react-google-maps';
import { Coffee, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { RegisterCafeDialog } from '~/components/RegisterCafeDialog';
import { getNearByCafe } from '~/actions/getNearByCafe';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer';
import { useLoadingState } from '~/hooks/useLoadingState';

export function TopPresentation() {
  return (
    <div>
      <h1 className="py-4 text-center text-2xl font-bold">デカフェマップ</h1>
      <div className="relative mx-auto h-[90vh] w-full">
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
  const [cafeList, setCafeList] = useState<
    {
      id: string;
      name: string;
      description: string | null;
      lat: number;
      long: number;
    }[]
  >([]);
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [center, setCenter] = useState<{
    lat: number;
    lng: number;
  }>();
  const [address, setAddress] = useState<string | null>(null);

  const geocoder = useMapsLibrary('geocoding');
  const geometry = useMapsLibrary('geometry');

  const containerStyle = {
    width: '100%',
    height: '90vh',
  };

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 3,
    lng: 4,
  });

  const isCenterDefault =
    currentLocation.lat === 3 && currentLocation.lng === 4;

  const [clickedLatLng, setClickedLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { addLoadingKey, removeLoadingKey } = useLoadingState();

  /**
   * 現在地へ移動
   */
  const moveToCurrentLocation = () => {
    // TODO: エラーハンドリング
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map?.panTo({ lat: latitude, lng: longitude });
      setCurrentLocation({ lat: latitude, lng: longitude });
    });
  };

  const searchNearByCafe = async () => {
    if (!center) return;
    addLoadingKey('searchNearByCafe');
    const nearByCafe = await getNearByCafe(center.lat, center.lng);
    setCafeList(nearByCafe);
    removeLoadingKey('searchNearByCafe');
  };

  const moveToCafe = (params: { lat: number; long: number }) => {
    map?.panTo({ lat: params.lat, lng: params.long });
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (map && isFirstLoad) {
      addLoadingKey('initMap');
      moveToCurrentLocation();
      removeLoadingKey('initMap');
      setIsFirstLoad(false);
    }
  }, [map]);

  useEffect(() => {
    if (currentLocation.lat !== 3 && currentLocation.lng !== 4) {
      getNearByCafe(currentLocation.lat, currentLocation.lng).then(
        (cafeList) => {
          setCafeList(cafeList);
        },
      );
    }
  }, [currentLocation]);

  return (
    <>
      <Map
        style={containerStyle}
        className={isCenterDefault ? 'opacity-0' : ''}
        defaultCenter={currentLocation}
        center={center}
        onCenterChanged={(event) => {
          setCenter(event.detail.center);
        }}
        defaultZoom={18}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string}
        onClick={(event) => {
          if (!geocoder) return;

          const lat = event.detail.latLng?.lat;
          const lng = event.detail.latLng?.lng;

          if (!lat || !lng) return;

          const _geocoder = new geocoder.Geocoder();

          if (lat && lng) {
            setClickedLatLng({ lat, lng });
            // @ts-ignore
            _geocoder.geocode({ location: { lat, lng } }, (results: any) => {
              setAddress(results?.[0]?.formatted_address ?? null);
            });
          }

          setIsOpen(true);
        }}
      >
        <CurrentLocationMarker position={currentLocation} />
        {cafeList.map((cafe) => {
          if (
            !geometry ||
            !currentLocation?.lat ||
            !currentLocation?.lng ||
            !cafe.lat ||
            !cafe.long
          )
            return;

          const distance = geometry.spherical.computeDistanceBetween(
            { lat: currentLocation.lat, lng: currentLocation.lng },
            { lat: cafe.lat, lng: cafe.long },
          );

          return (
            <CafeMarker
              key={cafe.id}
              position={{
                lat: cafe.lat,
                lng: cafe.long,
              }}
              name={cafe.name}
              description={cafe.description}
              distance={distance}
            />
          );
        })}
        <MapControl position={ControlPosition.BOTTOM_CENTER}>
          <div className="mx-auto flex items-center justify-center gap-2 pb-5">
            <Button onClick={moveToCurrentLocation}>現在地へ</Button>
            <Button variant="outline" onClick={searchNearByCafe}>
              再検索
            </Button>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
              近くのカフェ
            </Button>
          </div>
        </MapControl>
        <RegisterCafeDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          location={clickedLatLng}
          address={address}
        />
      </Map>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[400px]">
          <DrawerHeader>
            <DrawerTitle>近くのカフェ一覧</DrawerTitle>
          </DrawerHeader>

          <div className="mx-auto w-full overflow-y-auto pb-4">
            {cafeList.map((cafe) => {
              if (
                !geometry ||
                !currentLocation?.lat ||
                !currentLocation?.lng ||
                !cafe.lat ||
                !cafe.long
              )
                return;

              const distance = geometry.spherical.computeDistanceBetween(
                { lat: currentLocation.lat, lng: currentLocation.lng },
                { lat: cafe.lat, lng: cafe.long },
              );

              return (
                <button
                  key={cafe.id}
                  onClick={() => moveToCafe({ lat: cafe.lat, long: cafe.long })}
                  className="group flex w-full items-center justify-between border-b p-4 text-start"
                >
                  <div>
                    <h3 className="text-lg font-bold">{cafe.name}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-gray-600">
                      {cafe.description}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-gray-600">
                      ここからの距離: 約{Math.round(distance)}m
                    </p>
                  </div>
                  <ChevronRight
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    size={24}
                  />
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function DefaultMarker({
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
          <p>ここに、いろいろ情報が載る</p>
        </InfoWindow>
      )}
    </>
  );
}

function CurrentLocationMarker({
  position,
}: {
  position: { lat: number; lng: number };
}) {
  return (
    <>
      <AdvancedMarker position={position}>
        <Pin background="transparent" borderColor="transparent">
          <div className="border-white-700 block size-6 rounded-full border-4 bg-blue-600"></div>
        </Pin>
      </AdvancedMarker>
    </>
  );
}

function CafeMarker({
  position,
  name,
  description,
  isDefaultOpen = false,
  distance,
}: {
  position: { lat: number; lng: number };
  name: string;
  description: string | null;
  distance: number;
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
      >
        <Pin background="#a06d49" borderColor="#a06d49" scale={1.3}>
          <Coffee color="#fff" size={24} />
        </Pin>
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow
          headerContent={<p className="text-base font-bold">{name}</p>}
          anchor={marker}
          onClose={handleClose}
        >
          <div className="flex max-w-[300px] flex-col gap-2 pb-1">
            <div className="flex flex-col">
              <p>住所:</p>
              <p className="whitespace-pre-wrap">{description}</p>
            </div>
            <div className="flex items-center">
              <p>現在地からの距離:</p>
              <p className="whitespace-pre-wrap">
                {distance ? Math.round(distance) : ''}m
              </p>
            </div>
            <div className="flex flex-col">
              <p>補足:</p>
              <p className="whitespace-pre-wrap">{description}</p>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function moveToLocation(
  map: google.maps.Map,
  location: { lat: number; lng: number },
) {
  map.panTo({ lat: location.lat, lng: location.lng });
}
