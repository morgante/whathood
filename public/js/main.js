$(document).ready( function() {
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};

	var colors = {
		highlight: {
			stroke: "#CC3E07",
			fill: "#FFA562"
		},
		other: {
			stroke: "#071CCC",
			fill: "#22AEFF"
		}
	};

	// $('#prompt .content').html( _.template($('#template-hello').html(), {}) );

	var geo = new google.maps.Geocoder();
	var mapboxCode = 'morgante.iokj9e1a';
	var featureLayer;

	var hoods;
	var map;
	var $map = $('#map');
	var $prompt = $('#prompt');
	var $name = $('#name');

	$.getJSON('/data/nyc.geojson', function(json, status) {
		hoods = json.features;

		hoods = _.map(hoods, function(hood) {
			hood.properties.title = hood.properties.neighborhood;
			hood.properties.description = hood.properties.borough;

			return hood;
		});

		featureLayer = L.mapbox.featureLayer().addTo(map);
	});

	function makeMap() {
		map = L.mapbox.map('map', mapboxCode);

		map.setView([40.7127, -74.0059], 12);
	}

	makeMap();

	function inHood(point, hood) {
		var poly = hood.geometry;

		return gju.pointInPolygon({"type":"Point","coordinates":point}, poly);
	}

	function showName(name) {
		$('p', $name).text(name);
		$name.show();
	}

	function handleAddress(address) {

		// hack - only NYC for now
		address = address + ' New York, NY';

		geo.geocode({
			'address':address
		}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var position = {
					'lat': results[0].geometry.location.k,
					'long': results[0].geometry.location.B
				};
				position = [position.long, position.lat]; // GeoJSON format

				// find hoods
				var hoodFinder = inHood.bind(undefined, position);
				var hood = _.find(hoods, hoodFinder);
				var oHoods = _.reject(hoods, hoodFinder);

				// find centroid
				var centroid = gju.centroid(hood.geometry);
				map.setView([centroid.coordinates[1], centroid.coordinates[0]], 14);

				// color my hood
				hood.properties["stroke"] = colors.highlight.stroke;
				hood.properties["fill"] = colors.highlight.fill;

				// color hoods
				oHoods = _.map(oHoods, function(hood) {
					hood.properties["stroke"] = colors.other.stroke;
					hood.properties["fill"] = colors.other.fill;
					return hood;
				});

				// add back in our hood
				oHoods.push(hood);

				// L.geoJson(oHoods, { style: L.mapbox.simplestyle.style }).addTo(map);

				featureLayer.setGeoJSON(oHoods);

				toMapView(function() {
					showName(hood.properties.neighborhood);
				});

			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	function toMapView(cb) {
		if ($prompt.hasClass('pinned')) {
			cb();
			return;
		}

		$map.animate({'opacity': 1});

		$prompt.addClass('pinned');

		$prompt.animate({'top': "-10px", "width": "100%", "height": "70px"});
		$('p, input', $prompt).animate({"font-size": "140%"}, {done: cb});
	}

	$('#prompt a').click(function(evt) {
		evt.preventDefault();

		$('form').submit();
	});

	$('form').submit(function(evt) {
		var address = $('#location').val();

		handleAddress(address);

		evt.preventDefault();
	});
});