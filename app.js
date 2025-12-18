// Initialize map with saved location or default to Stadium Merdeka
const savedLat = localStorage.getItem('thelawn_map_lat');
const savedLng = localStorage.getItem('thelawn_map_lng');
const savedZoom = localStorage.getItem('thelawn_map_zoom');

const initialLat = savedLat ? parseFloat(savedLat) : 3.1412;
const initialLng = savedLng ? parseFloat(savedLng) : 101.6994;
const initialZoom = savedZoom ? parseInt(savedZoom) : 18;

// Log if using saved location
if (savedLat && savedLng) {
    console.log('Map restored to saved location:', { lat: initialLat, lng: initialLng, zoom: initialZoom });
} else {
    console.log('Map initialized at default location (Stadium Merdeka)');
}

const map = L.map('map', {
    attributionControl: false,
    maxZoom: 19
}).setView([initialLat, initialLng], initialZoom);

// Define tile layers
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '',
    maxZoom: 19
});

const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 19
});

// Add default layer (satellite)
satelliteLayer.addTo(map);

// Save map position and zoom when user moves/zooms the map
map.on('moveend', () => {
    const center = map.getCenter();
    localStorage.setItem('thelawn_map_lat', center.lat);
    localStorage.setItem('thelawn_map_lng', center.lng);
});

map.on('zoomend', () => {
    const zoom = map.getZoom();
    localStorage.setItem('thelawn_map_zoom', zoom);
});

// Layer switching functionality
document.querySelectorAll('.layer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const layer = btn.getAttribute('data-layer');

        // Remove active class from all buttons
        document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Switch layers
        if (layer === 'satellite') {
            map.removeLayer(streetLayer);
            satelliteLayer.addTo(map);
        } else {
            map.removeLayer(satelliteLayer);
            streetLayer.addTo(map);
        }
    });
});

// Polygon and measurement state
let markers = [];
let polygon = null;
let polygonLayer = null;

// Custom marker icon
const markerIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="background: #059669; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

// Add marker on map click
map.on('click', (e) => {
    const marker = L.marker(e.latlng, {
        icon: markerIcon,
        draggable: true
    }).addTo(map);

    // Add context menu to remove marker
    marker.on('contextmenu', () => {
        const index = markers.indexOf(marker);
        if (index > -1) {
            markers.splice(index, 1);
            map.removeLayer(marker);
            updatePolygon();
            updateUI();
        }
    });

    // Update polygon on marker drag
    marker.on('drag', () => {
        updatePolygon();
    });

    marker.on('dragend', () => {
        updateUI();
    });

    markers.push(marker);
    updatePolygon();
    updateUI();
});

// Format number with thousand separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate area using the Shoelace formula
function calculateArea(latlngs) {
    if (latlngs.length < 3) return 0;

    let area = 0;
    const numPoints = latlngs.length;

    for (let i = 0; i < numPoints; i++) {
        const j = (i + 1) % numPoints;
        const xi = latlngs[i].lat;
        const yi = latlngs[i].lng;
        const xj = latlngs[j].lat;
        const yj = latlngs[j].lng;
        area += xi * yj - xj * yi;
    }

    area = Math.abs(area / 2);

    // Convert to square meters (approximate)
    // 1 degree of latitude ≈ 111,000 meters
    // 1 degree of longitude ≈ 111,000 * cos(latitude) meters
    const avgLat = latlngs.reduce((sum, ll) => sum + ll.lat, 0) / numPoints;
    const latFactor = 111000;
    const lngFactor = 111000 * Math.cos(avgLat * Math.PI / 180);

    const areaInSquareMeters = area * latFactor * lngFactor;
    return areaInSquareMeters;
}

// Update polygon
function updatePolygon() {
    if (polygonLayer) {
        map.removeLayer(polygonLayer);
        polygonLayer = null;
    }

    if (markers.length >= 3) {
        const latlngs = markers.map(m => m.getLatLng());
        polygonLayer = L.polygon(latlngs, {
            color: '#059669',
            fillColor: '#059669',
            fillOpacity: 0.3,
            weight: 2
        }).addTo(map);

        const area = calculateArea(latlngs);
        const areaSqft = area * 10.7639;

        polygonLayer.bindPopup(`
            <strong>Area:</strong><br>
            ${formatNumber(area.toFixed(2))} m²<br>
            ${formatNumber(areaSqft.toFixed(2))} sqft
        `);
    }
}

// Save markers to localStorage
function saveToCache() {
    const markerData = markers.map(m => {
        const latlng = m.getLatLng();
        return { lat: latlng.lat, lng: latlng.lng };
    });
    localStorage.setItem('lawnMeasurements', JSON.stringify(markerData));
}

// Load markers from localStorage
function loadFromCache() {
    const savedData = localStorage.getItem('lawnMeasurements');
    if (savedData) {
        try {
            const markerData = JSON.parse(savedData);
            markerData.forEach(data => {
                const marker = L.marker([data.lat, data.lng], {
                    icon: markerIcon,
                    draggable: true
                }).addTo(map);

                // Add context menu to remove marker
                marker.on('contextmenu', () => {
                    const index = markers.indexOf(marker);
                    if (index > -1) {
                        markers.splice(index, 1);
                        map.removeLayer(marker);
                        updatePolygon();
                        updateUI();
                    }
                });

                // Update polygon on marker drag
                marker.on('drag', () => {
                    updatePolygon();
                });

                marker.on('dragend', () => {
                    updateUI();
                });

                markers.push(marker);
            });

            if (markers.length > 0) {
                updatePolygon();
                updateUI();
            }
        } catch (e) {
            console.error('Error loading saved measurements:', e);
        }
    }
}

// Update UI
function updateUI() {
    const pointCount = markers.length;
    document.getElementById('pointCount').textContent = pointCount;

    document.getElementById('undoBtn').disabled = pointCount === 0;
    document.getElementById('clearBtn').disabled = pointCount === 0;

    if (pointCount >= 3) {
        const latlngs = markers.map(m => m.getLatLng());
        const area = calculateArea(latlngs);
        const areaSqft = area * 10.7639;

        document.getElementById('areaSqm').textContent = formatNumber(area.toFixed(2));
        document.getElementById('areaSqft').textContent = formatNumber(areaSqft.toFixed(2));
        document.getElementById('areaDisplay').style.display = 'block';
        document.getElementById('emptyState').style.display = 'none';

        // Auto-fill the area in calculators
        document.getElementById('yourArea').value = areaSqft.toFixed(2);
        document.getElementById('sandArea').value = areaSqft.toFixed(2);

        // Save area to localStorage for 3bulan page
        localStorage.setItem('thelawn_mapArea', areaSqft.toFixed(2));

        // Get location data from center of polygon
        const centerLat = latlngs.reduce((sum, ll) => sum + ll.lat, 0) / latlngs.length;
        const centerLng = latlngs.reduce((sum, ll) => sum + ll.lng, 0) / latlngs.length;

        // Reverse geocode to get location details
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${centerLat}&lon=${centerLng}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.address) {
                    const address = data.address;
                    
                    // Try multiple fields for city (for Malaysia addresses)
                    const city = address.city || 
                                 address.town || 
                                 address.municipality || 
                                 address.village || 
                                 address.suburb ||
                                 address.city_district ||
                                 address.county || '';
                    
                    const state = address.state || '';
                    const postalCode = address.postcode || '';

                    // Debug log to see what we got
                    console.log('Address data:', {
                        city: city,
                        state: state,
                        postalCode: postalCode,
                        fullAddress: address
                    });

                    // Save to localStorage
                    if (city) localStorage.setItem('thelawn_city', city);
                    if (state) localStorage.setItem('thelawn_state', state);
                    if (postalCode) localStorage.setItem('thelawn_postalCode', postalCode);

                    // Update UI to show location info
                    const locationDiv = document.getElementById('locationInfo');
                    if (city || state || postalCode) {
                        document.getElementById('displayCity').textContent = city || '-';
                        document.getElementById('displayPostcode').textContent = postalCode || '-';
                        document.getElementById('displayState').textContent = state || '-';
                        locationDiv.style.display = 'block';
                    }
                }
            })
            .catch(err => console.log('Geocoding error:', err));
    } else {
        document.getElementById('areaDisplay').style.display = 'none';
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('locationInfo').style.display = 'none';
        // Clear saved area if no polygon
        localStorage.removeItem('thelawn_mapArea');
    }

    // Save to cache after UI update
    saveToCache();
}

// Undo last point
document.getElementById('undoBtn').addEventListener('click', () => {
    if (markers.length > 0) {
        const lastMarker = markers.pop();
        map.removeLayer(lastMarker);
        updatePolygon();
        updateUI();
    }
});

// Clear all points
document.getElementById('clearBtn').addEventListener('click', () => {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    if (polygonLayer) {
        map.removeLayer(polygonLayer);
        polygonLayer = null;
    }
    updateUI();
});

// Geolocation
document.getElementById('locationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 18);

                // Save GPS location to localStorage
                localStorage.setItem('thelawn_map_lat', latitude);
                localStorage.setItem('thelawn_map_lng', longitude);
                localStorage.setItem('thelawn_map_zoom', 18);

                L.marker([latitude, longitude], {
                    icon: L.divIcon({
                        className: 'location-marker',
                        html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(map).bindPopup('Your Location').openPopup();
            },
            (error) => {
                alert('Unable to retrieve your location. Please ensure location services are enabled.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Location search using Nominatim (OpenStreetMap)
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('Please enter a location to search.');
        return;
    }

    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                map.setView([parseFloat(lat), parseFloat(lon)], 16);

                L.marker([parseFloat(lat), parseFloat(lon)])
                    .addTo(map)
                    .bindPopup(display_name)
                    .openPopup();
            } else {
                alert('Location not found. Please try a different search term.');
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            alert('An error occurred while searching. Please try again.');
        });
});

// Allow search on Enter key
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

// Pesticide/Foliar Calculator
document.getElementById('calculatePesticide').addEventListener('click', () => {
    const pesticideAmount = parseFloat(document.getElementById('pesticideAmount').value);
    const pesticideUnit = document.getElementById('pesticideUnit').value;
    const waterAmount = parseFloat(document.getElementById('waterAmount').value);
    const waterUnit = document.getElementById('waterUnit').value;
    const labelArea = parseFloat(document.getElementById('labelArea').value);
    const labelAreaUnit = document.getElementById('labelAreaUnit').value;
    const yourArea = parseFloat(document.getElementById('yourArea').value);

    if (!pesticideAmount || !waterAmount || !labelArea || !yourArea) {
        alert('Please fill in all fields.');
        return;
    }

    // Convert all to base units (ml for liquids, sqft for area)
    let pesticideInMl = pesticideAmount;
    if (pesticideUnit === 'liter') pesticideInMl *= 1000;

    let waterInLiter = waterAmount;
    if (waterUnit === 'ml') waterInLiter /= 1000;

    let labelAreaInSqft = labelArea;
    if (labelAreaUnit === 'm2') labelAreaInSqft *= 10.7639;
    if (labelAreaUnit === 'hectare') labelAreaInSqft *= 107639;

    // Calculate ratio
    const ratio = yourArea / labelAreaInSqft;

    const pesticideNeeded = pesticideInMl * ratio;
    const waterNeeded = waterInLiter * ratio;

    // Display results
    document.getElementById('pesticideNeeded').textContent = `${pesticideNeeded.toFixed(2)} ml`;
    document.getElementById('waterNeeded').textContent = `${waterNeeded.toFixed(2)} liter`;
    document.getElementById('pesticideResult').style.display = 'block';
});

// Topdress Sand Calculator
document.getElementById('calculateSand').addEventListener('click', () => {
    const thickness = parseFloat(document.getElementById('sandThickness').value);
    const area = parseFloat(document.getElementById('sandArea').value);

    if (!thickness || !area) {
        alert('Please fill in all fields.');
        return;
    }

    // Convert sqft to m²
    const areaInM2 = area / 10.7639;

    // Convert mm to meters
    const thicknessInM = thickness / 1000;

    // Calculate volume in cubic meters
    const volumeM3 = areaInM2 * thicknessInM;

    // Also show in cubic feet
    const volumeFt3 = volumeM3 * 35.3147;

    // Display results
    document.getElementById('sandVolume').textContent = `${volumeM3.toFixed(3)} m³ (${volumeFt3.toFixed(2)} cubic feet)`;
    document.getElementById('sandResult').style.display = 'block';
});

// Initialize UI and load saved data
loadFromCache();
updateUI();

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// Scroll to top when clicked
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});