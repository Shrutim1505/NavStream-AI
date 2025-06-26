import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Navigation, Compass, Layers, RotateCcw } from 'lucide-react-native';

interface MapViewProps {
  coordinates?: Array<{ latitude: number; longitude: number }>;
  markers?: Array<{
    coordinate: { latitude: number; longitude: number };
    title: string;
    description: string;
    color?: string;
  }>;
  showRoute?: boolean;
  onMapReady?: () => void;
  style?: any;
}

export default function MapView({ 
  coordinates = [], 
  markers = [], 
  showRoute = true, 
  onMapReady,
  style 
}: MapViewProps) {
  const [mapType, setMapType] = useState('roadmap');
  const webViewRef = useRef<WebView>(null);

  // Default coordinates (center of Pacific Ocean for shipping routes)
  const defaultCenter = { lat: 5.0, lng: 145.0 };
  const center = coordinates.length > 0 ? 
    coordinates[Math.floor(coordinates.length / 2)] : 
    { latitude: defaultCenter.lat, longitude: defaultCenter.lng };

  const toggleMapType = () => {
    const types = ['roadmap', 'satellite', 'hybrid', 'terrain'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
    
    // Send message to WebView to change map type
    webViewRef.current?.postMessage(JSON.stringify({
      type: 'changeMapType',
      mapType: types[nextIndex]
    }));
  };

  const centerMap = () => {
    if (coordinates.length > 0) {
      webViewRef.current?.postMessage(JSON.stringify({
        type: 'fitBounds',
        coordinates: coordinates
      }));
    }
  };

  // Generate HTML for the map
  const generateMapHTML = () => {
    const { width, height } = Dimensions.get('window');
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, html { margin: 0; padding: 0; height: 100%; }
            #map { height: 100%; width: 100%; }
            .marker { 
                background: #0891B2; 
                border: 2px solid white; 
                border-radius: 50%; 
                width: 12px; 
                height: 12px; 
            }
            .departure-marker { background: #059669; }
            .destination-marker { background: #DC2626; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_X8_8_8_8_8_8&libraries=geometry"></script>
    </head>
    <body>
        <div id="map"></div>
        <script>
            let map;
            let routePath;
            
            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 4,
                    center: { lat: ${center.latitude}, lng: ${center.longitude} },
                    mapTypeId: '${mapType}',
                    styles: [
                        {
                            featureType: 'water',
                            elementType: 'geometry',
                            stylers: [{ color: '#0891B2' }]
                        }
                    ]
                });
                
                // Add markers
                ${markers.map((marker, index) => `
                    new google.maps.Marker({
                        position: { lat: ${marker.coordinate.latitude}, lng: ${marker.coordinate.longitude} },
                        map: map,
                        title: '${marker.title}',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '${marker.color || '#0891B2'}',
                            fillOpacity: 1,
                            strokeColor: 'white',
                            strokeWeight: 2
                        }
                    });
                `).join('')}
                
                // Add route if coordinates exist
                ${coordinates.length > 0 && showRoute ? `
                    const routeCoordinates = [
                        ${coordinates.map(coord => `{ lat: ${coord.latitude}, lng: ${coord.longitude} }`).join(',')}
                    ];
                    
                    routePath = new google.maps.Polyline({
                        path: routeCoordinates,
                        geodesic: true,
                        strokeColor: '#0891B2',
                        strokeOpacity: 1.0,
                        strokeWeight: 4
                    });
                    
                    routePath.setMap(map);
                    
                    // Fit bounds to show entire route
                    const bounds = new google.maps.LatLngBounds();
                    routeCoordinates.forEach(coord => bounds.extend(coord));
                    map.fitBounds(bounds);
                ` : ''}
                
                // Listen for messages from React Native
                window.addEventListener('message', function(event) {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'changeMapType') {
                        map.setMapTypeId(data.mapType);
                    } else if (data.type === 'fitBounds' && data.coordinates.length > 0) {
                        const bounds = new google.maps.LatLngBounds();
                        data.coordinates.forEach(coord => 
                            bounds.extend({ lat: coord.latitude, lng: coord.longitude })
                        );
                        map.fitBounds(bounds);
                    }
                });
                
                ${onMapReady ? 'window.ReactNativeWebView?.postMessage("mapReady");' : ''}
            }
            
            // Fallback if Google Maps fails to load
            window.addEventListener('load', function() {
                if (typeof google === 'undefined') {
                    document.getElementById('map').innerHTML = 
                        '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #F8FAFC; color: #64748B; font-family: system-ui;">Map unavailable in preview mode</div>';
                } else {
                    initMap();
                }
            });
        </script>
    </body>
    </html>
    `;
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <iframe
          srcDoc={generateMapHTML()}
          style={{ ...styles.webView, border: 'none', width: '100%', height: '100%' }}
          title="Map"
        />
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
            <Layers size={20} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={centerMap}>
            <Compass size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Fallback for native platforms (would use react-native-maps here)
  return (
    <View style={[styles.container, styles.fallbackContainer, style]}>
      <Navigation size={48} color="#64748B" />
      <Text style={styles.fallbackText}>Map View</Text>
      <Text style={styles.fallbackSubtext}>
        Interactive map available on mobile devices
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 15,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 5,
    textAlign: 'center',
  },
  mapControls: {
    position: 'absolute',
    top: 15,
    right: 15,
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});