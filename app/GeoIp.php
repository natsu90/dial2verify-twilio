<?php

namespace App;

use Vectorface\Whip\Whip;
use GuzzleHttp\Client;

class GeoIp {

	private $ip;

	public function __construct($ip)
	{
		$whip = new Whip(Whip::PROXY_HEADERS | Whip::REMOTE_ADDR);

    	if (false !== ($clientAddress = $whip->getValidIpAddress())) {
			$ip = $clientAddress;
		}

		$this->ip = $ip;
	}

	public function getCountryCode()
	{
		if(!$this->isValid())
			return null;

		$client = new Client(['base_uri' => 'https://freegeoip.lwan.ws/json/']);
    	$response = $client->request('GET', $this->ip);

    	$data = json_decode($response->getBody());
    	return $data->country_code;
	}

	public function isValid()
	{
		return strpos('192.168.', $this->ip) === FALSE;
	}
}