/* eslint-disable no-fallthrough */
/* eslint-disable no-restricted-globals */
/* eslint-disable default-case */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */

let activeInputElement;
let locationMap;
let label;

class LocationFinder {
  constructor(maps, lat = 9.30769, lng = 2.315834) {
    this.maps = maps;
    this.latitude = lat;
    this.longitude = lng;
    this.geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    this.reversecodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    this.key = '&key=AIzaSyCVG4POFIVEKqFALXWDJKSF1o1HPaUI8zk';
    this.map = this.initMap(this.maps.Map, this.latitude, this.longitude);
    // new maps.Marker( { map: this.map, position: location,label:"thanks" } );
  }

  /* initialize a new map centered at longitude and latitude */
  initMap(Map, latitude, longitude) {
    const location = {
      lat: latitude,
      lng: longitude
    };
    this.map = new Map(getElement('map-ui', 'id'), {
      center: location,
      zoom: 8
    });

    return this.map;
  }

  getLatandLong() {
    if (this.map === undefined) {
      this.initMa();
    }
  }

  setLatandLong(lat, lng) {
    this.latitude = lat;
    this.latitude = lng;
  }

  parseResults(json) {
    const result = [];
    // console.log( json );

    JSON.parse(json).results.forEach((address) => {
      if (address.formatted_address.indexOf('Unnamed') === -1) {
        result.push({
          [address.formatted_address]: address.geometry.location
        });
      }
    });
    return result;
  }

  placeMarker(location, map = this.map) {
    // center map and place marker in result position
    map.setCenter(location);
    if (this.marker) {
      this.marker.setMap(null);
    }
    /* remove old marker before adding a new one can later
            which marker to use or not use choosen marker to determine */
    this.marker = new this.maps.Marker({
      map,
      position: location,
      label: 'P'
    });
  }

  useGeocode(addressName, cb) {

    const geocoder = new this.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({
        address: addressName
      }, (results, status) => {
        if (status === 'OK') {
          const result = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lat(),
          };
          resolve(result);
          // set the cordinate on this callback function
          if (cb) {
            cb(result);
          }
        }
      });
    });
  }

  positionsOnclick(cb) {
    const self = this;
    return new Promise((resolve) => {
      self.map.addListener('click', (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        const location = {
          lat: latitude,
          lng: longitude
        };
        self.placeMarker(location, self.map);
        self.positionFromCordinate(location).then((locations) => {
          cb(locations);
          resolve(location);
        });
      });
    });
  }

  positionFromCordinate(location, cb) {
    const latlng = `latlng=${location.lat},${location.lng}`;

    const url = this.reversecodingUrl + latlng + this.key;
    const req = new XMLHttpRequest();
    console.log(url);
    req.open('GET', url);
    const self = this;
    return new Promise((resolve) => {
      req.onreadystatechange = function () {
        if (req.status === 200 && req.readyState === 4) {
          const result = self.parseResults(req.responseText);
          if (cb) {
            cb(result);
          }
          resolve(result);
        }
      };
      req.send();
    });
  }

  promiseAddress(input, cb) {
    switch (typeof input) {
      case 'string':
        self = this;
        this.useGeocode(input).then((location) => {
          cb(location);
          self.placeOnMap(location, sefl.map);
        });
      case 'object':
        this.positionFromCordinate(input).then((positions) => {
          cb(positions);
        });
    }
  }
}

/** Label does the job of showing clicked posiition on map */
class Label {
  constructor(map) {
    Label.map = map;
  }

  static displayLabelOnclick(clickedCordinates) {
    const labelContainer = document.getElementById('position-container');
    labelContainer.innerHTML = '';
    clickedCordinates.forEach((cordinate) => {
      labelContainer.appendChild(Label.labelViewFrom(cordinate));
    });
  }

  static displayLabalFromCordinate(cordinate) {
    const labelContainer = document.getElementById('position-container');
    labelContainer.innerHTML = '';
    console.log(cordinate);
    labelContainer.appendChild(Label.labelViewFrom(cordinate));
    Label.map.placeMarker(cordinate);
  }

  static labelViewFrom(cordinate) {
    const brk = document.createElement('br');
    let cord = '';
    let placeName = '';
    if ('lat' in cordinate) {
      placeName = activeInputElement.value;
      cord = cordinate;
    } else {
      placeName = Object.keys(cordinate);
      cord = {
        lat: cordinate[placeName].lat,
        lng: cordinate[placeName].lng
      };
    }
    const positionLabel = setAttributes(document.createElement('div'), {
      id: cord,
      class: 'position-label'
    });
    const anch = document.createElement('a');
    anch.textContent = placeName;
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    anch.style.display = 'inline-block';
    span.textContent = `${cord.lat} , ${cord.lng}`;
    positionLabel.appendChild(anch);
    positionLabel.appendChild(brk);
    positionLabel.appendChild(span);

    positionLabel.onclick = function () {
      /* set the value of this active input field
                   and store its location in the class attribute */
      if (activeInputElement !== undefined) {
        activeInputElement.value = placeName;
        setAttributes(activeInputElement, {
          class: JSON.stringify(cord),
          name: placeName
        });
      }
      // place a marker on the map where the label points
      Label.map.placeMarker(cord);
    };
    return positionLabel;
  }

  showOnMap(cordinate) {
    if (cordinate instanceof Array) { // It came from click event
      Label.displayLabelOnclick(cordinate);
    } else if (typeof cordinate === 'object') {
      Label.displayLabalFromCordinate(cordinate);
    }
  }
}

function initMap() {
  locationMap = new LocationFinder(google.maps); // .initMap()
  label = new Label(locationMap);
  locationMap.positionsOnclick(label.showOnMap);
}


function setActivePosition(inputBoxId) {
  activeInputElement = document.getElementById(inputBoxId);
  if (!(/^(\s)*$/.test(activeInputElement.value) || activeInputElement.value === undefined)) {
    locationMap.useGeocode(activeInputElement.value, label.showOnMap);
  }
}