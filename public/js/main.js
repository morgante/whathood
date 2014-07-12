$(document).ready( function() {
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};
		
	$('#prompt .content').html( _.template($('#template-hello').html(), {}) );

	var geo = new google.maps.Geocoder();

	var hoods;

	$.getJSON('/data/nyc.geojson', function(json, status) {
		hoods = json.features;
	});

	function makeMap() {
		var map = L.mapbox.map('map', 'examples.map-i86nkdio');

		map.setView([40, -74.50], 9);
	}

	makeMap();

	function findHood(point) {
		var hood = _.find(hoods, function(hood) {
			var poly = hood.geometry;

			return gju.pointInPolygon({"type":"Point","coordinates":point}, poly);
		});

		return hood;
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

				var hood = findHood(position);

				console.log(hood);
			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	// handleAddress('1742 1st ave');

	$('form').submit(function(evt) {
		var address = $('#location').val();

		handleAddress(address);

		evt.preventDefault();
	});
});