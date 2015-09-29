require 'sinatra'
require 'json'

get '/' do
	File.read(File.join('public', 'index.html'))
end


get '/update' do
	$delta_t = params[:delta_t].to_f
	$tau = params[:tau].to_f
	$el = params[:el].to_f
	$rmie = params[:rmie].to_f
	$vth = params[:vth].to_f
	$vreset = params[:vreset].to_f
	
	$vn = [-65]

	# Voltage vs Time
	n = 0
	t = 0
	fires = 0
	while t < 200
		v = voltage n
		if v >= $vth
			$vn << $vreset
			fires += 1
		else
			$vn << v
		end

		n += 1
		t += $delta_t
	end

	voltage_data = $vn.each_with_index.map {|v,i| (i/delta_t) % 10{x: i*$delta_t, y: v}}

	# Frequency
	rmie_step = 0.1
	$rmie = 0
	freq = []
	while $rmie <= 20
		n = 0
		t = 0
		fires = 0
		times = 0
		last = 0
		$vn = [-65]
		while t < 100
			v = voltage n
			if v >= $vth
				$vn << $vreset
				fires += 1
				times += t - last
				last = t
			else
				$vn << v
			end

			n += 1
			t += $delta_t
		end

		fires != 0 ? freq << 1/(times/fires) : freq << 0
		$rmie += rmie_step
	end

	freq_data = freq.each_with_index.map {|v,i| {x: i*rmie_step, y: v}}

	{voltage: voltage_data, freq: freq_data}.to_json
end


def voltagevstime

end


def voltage n
	$vn[n] + (($delta_t) / ($tau)) * (($el - $vn[n]) + $rmie);
end