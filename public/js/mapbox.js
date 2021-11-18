const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken =
  'pk.eyJ1IjoibmFpbXVyLXJhaG1hbiIsImEiOiJja3c0a3R3cDMwN2p4MnZudnE5MTIxd3UzIn0.I2P1ISCgCgcAtw-yOSitgw'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/naimur-rahman/ckw4l641f7fo014nxxg2304a5',
  scrollZoom: false
})

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div')
  el.className = 'marker'

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map)

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map)

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
})
