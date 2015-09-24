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


// Approximation
// --------------------------------------------------------------------
function voltage(n) {
	return vn[n] + ((delta_t) / (tau)) * ((el - vn[n]) + rmie);
}


// Voltage vs Time
// --------------------------------------------------------------------
function voltagevstime() {
	j = 0;

	for (i=0; j < 3; i++)
	{
		if (i > 1000)
			break;
		
		v = voltage(i);
		if (v > vth)
		{
			j += 1;
			vn.push(vreset);
		}
		else
			vn.push(v);
	}
}

function voltageData() {
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
							values: vn.map(function(o,i) {return {x: i*delta_t, y: o};})
						}
					]
				}
			]
		}
	}

	return data;	
}


function updateVoltage() {
	delta_t = parseFloat($("#delta_t").val());
	tau = parseFloat($("#tau").val());
	el = parseFloat($("#el").val());
	rmie = parseFloat($("#rmie").val());
	vth = parseFloat($("#vth").val());
	vreset = parseFloat($("#vreset").val());

	vn = [-65];
	voltagevstime();

	var data = voltageData();

	voltageVsTime
		.data(data)
		.update();
}


// Frequency
// --------------------------------------------------------------------
function frequency() {
	for (i=0; i < 20; i+= rmie_step) {
		last = 0;
		times = 0;
		j = 0;
		rmie = i;
		vn = [-65];
		for (k=0; k < 500; k++) {
			v = voltage(k);
			if (v > vth)
			{
				//console.log(k);
				j += 1;
				times += delta_t*k - last;
				last = delta_t*k;
				vn.push(vreset);
				//console.log(last);	
			}
			else
				vn.push(v);
		}

		if (j > 0)
			freq.push(times/j);
		else
			freq.push(0);
	}
}


function frequencyData() {
	var data = {
		data: {
			labels: {
				x: 'RmIe',
				y: 'Frequency'
			},
			types: [
				{
					type: 'line',
					colorKey: 'color',
					graphs: [
						{
							label: 'Voltage vs Time',
							interpolate: 'linear',
							values: freq.map(function(o,i) {return {x: i*rmie_step, y: (o>0) ? 1/o : 0};})
						}
					]
				}
			]
		}
	}

	return data;	
}


function updateFreqency() {
	delta_t = parseFloat($("#delta_t").val());
	tau = parseFloat($("#tau").val());
	el = parseFloat($("#el").val());
	rmie = parseFloat($("#rmie").val());
	vth = parseFloat($("#vth").val());
	vreset = parseFloat($("#vreset").val());

	freq = [];
	frequency();

	var data = frequencyData();

	freqencyVsRmie
		.data(data)
		.update();
}


// Document Prep
// --------------------------------------------------------------------
function update() {
	updateVoltage();
	updateFreqency();
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
	

	// h = $(window).height() - $("#params").outerHeight() - 40;
	// console.log(h);

	// $("#graph").height(h);

	voltagevstime();

	data = voltageData();		

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

	frequency();
	data = frequencyData();
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


