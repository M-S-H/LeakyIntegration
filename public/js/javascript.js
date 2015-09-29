// Variables
// --------------------------------------------------------------------
var delta_t = 1;			// In microseconds
var tau = 20;				// In microseconds
var el = -60;				// In milivolts
var rmie = 10;				// In milivolts
var vt = -51;
var vth = -51;
var vreset = -75;
var vn = [-65];
var freq = [];
var rmie_step = 0.1;

var voltageVsTime = new d2b.CHARTS.axisChart();
var freqencyVsRmie = new d2b.CHARTS.axisChart();


// Voltage vs Time
// --------------------------------------------------------------------
function voltageData(d) {
	console.log(d);
	var data = {
		data: {
			labels: {
				x: 'Time (mS)',
				y: 'Voltage (mV)'
			},
			types: [
				{
					type: 'line',
					colorKey: 'color',
					graphs: [
						{
							label: 'Voltage vs Time',
							interpolate: 'linear',
							values: d //vn.map(function(o,i) {return {x: i*delta_t, y: o};})
						}
					]
				}
			]
		}
	}

	return data;	
}


// Frequency
// --------------------------------------------------------------------
function frequencyData(d) {
	var data = {
		data: {
			labels: {
				x: 'RmIe (mv)',
				y: 'Frequency (mHz)'
			},
			types: [
				{
					type: 'line',
					colorKey: 'color',
					graphs: [
						{
							label: 'Frequency vs RmIe',
							interpolate: 'linear',
							values: d //freq.map(function(o,i) {return {x: i*rmie_step, y: (o>0) ? 1/o : 0};})
						}
					]
				}
			]
		}
	}

	return data;	
}


// Document Prep
// --------------------------------------------------------------------
$(document).ready(function(){
	$("#delta_t").val(delta_t);
	$("#tau").val(tau);
	$("#el").val(el);
	$("#rmie").val(rmie);
	$("#vth").val(vth);
	$("#vreset").val(vreset);

	data = voltageData([]);		
	voltageVsTime
		.select('#voltage')
		.color(
			d3.scale.ordinal()
				.domain(["color"])
				.range(["#a96767"])
			)
		.data(data)
		.width($('#voltage').width())
		.height($('#voltage').height())
		.controls({lockXAxis: {enabled: false, domain:[0, 1000]}, hideLegend: {enabled: true}})
		.update();

	data = frequencyData([]);
	freqencyVsRmie
		.select('#frequency')
		.color(
			d3.scale.ordinal()
				.domain(["color"])
				.range(["#d0b57c"])
			)
		.data(data)
		.width($('#frequency').width())
		.height($('#frequency').height())
		.controls({lockXAxis: {enabled: false, domain:[0, 1000]}, hideLegend: {enabled: true}})
		.update();


	$(window).resize(function(){
		voltageVsTime
			.width($('#voltage').width())
			.height($('#voltage').height())
			.animationDuration(0)
			.update()
			
	});

	$(window).resize(function(){
		freqencyVsRmie
			.width($('#frequency').width())
			.height($('#frequency').height())
			.animationDuration(0)
			.update()
			
	});
});


function update() {
	delta_t = parseFloat($("#delta_t").val());
	tau = parseFloat($("#tau").val());
	el = parseFloat($("#el").val());
	rmie = parseFloat($("#rmie").val());
	vth = parseFloat($("#vth").val());
	vreset = parseFloat($("#vreset").val());
	
	$.ajax({
		//type: "POST",
		url: "/update",
		data: {"delta_t": delta_t, "tau": tau, "el": el, "rmie": rmie, "vth": vth, "vreset": vreset},
		dataType: 'json',
		success: function(data) {
			vdata = voltageData(data["voltage"]);
			fdata = frequencyData(data["freq"]);

			voltageVsTime
				.data(vdata)
				.update();

			freqencyVsRmie
				.data(fdata)
				.update();
		}
	});
}