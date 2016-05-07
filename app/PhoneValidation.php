<?php

namespace App;

use libphonenumber\PhoneNumberUtil;
use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberType;
use libphonenumber\PhoneNumberFormat;
use Cache, Event;
use App\Models\TwilioNumber;
use App\Events\NumberVerified;

class PhoneValidation {

	private $number;

	private $phone_util;
	private $number_proto;

	public function __construct($number, GeoIp $geoip)
	{
		$country_code = $geoip->getCountryCode();
		$phoneUtil = PhoneNumberUtil::getInstance();
		$number_proto = $phoneUtil->parse($number, $country_code);

		$this->number = $number;
		$this->phone_util = $phoneUtil;
		$this->number_proto = $number_proto;
	}

	public function isValid()
	{
		return $this->phone_util->isValidNumber($this->number_proto);
	}

	public function isMobile()
	{
		return $this->phone_util->getNumberType($this->number_proto) == PhoneNumberType::MOBILE;
	}

	public function getValidNumber()
	{
		return $this->phone_util->format($this->number_proto, PhoneNumberFormat::E164);
	}

	public function validate()
	{
		return $this->isValid() && ((env('MOBILE_ONLY') && $this->isMobile()) || !env('MOBILE_ONLY'));
	}

	public function verify($ttl = 1.5)
	{
		if(!$this->validate())
			throw new Exception("WRONG-FORMAT", 400);
			
		if(!Cache::tags($this->getValidNumber())->has('verifying')) {
			$number_to_dial = TwilioNumber::getRandomNumber();
            Cache::tags($this->getValidNumber())->put('verifying', $number_to_dial, $ttl);
            return $number_to_dial;
		}
	}

	public static function triggerVerified($number, $number_to_dial)
	{
		if(Cache::tags($number)->get('verifying') == $number_to_dial) 
	    	Event::fire(new NumberVerified($number));
	}
}