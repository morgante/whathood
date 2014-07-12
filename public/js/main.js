$(document).ready( function() {
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};
		
	// $('#prompt .content').html( _.template($('#template-hello').html(), {}) );

	var geo = new google.maps.Geocoder();
	var mapboxCode = 'morgante.iokj9e1a';

	var hoods;
	var map;
	var $map = $('#map');
	var $prompt = $('#prompt');

	$.getJSON('/data/nyc.geojson', function(json, status) {
		hoods = json.features;

		_.each(hoods, function(hood) {
			hood.properties.stroke = "#fc4353";
			hood.properties["stroke-width"] = 5;
		});
	});

	function makeMap() {
		var map = L.mapbox.map('map', mapboxCode);

		map.setView([40.7127, -74.0059], 12);
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

				toMapView();
			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	function toMapView() {
		$map.animate({'opacity': 1});

		$prompt.addClass('pinned');

		$prompt.animate({'top': "-10px", "width": "100%", "height": "70px"});
		$('p, input', $prompt).animate({"font-size": "140%"});

		console.log($map);
	}

	handleAddress('1742 1st ave');

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