<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Cache, Event;
use GuzzleHttp\Client;
use libphonenumber\PhoneNumberUtil;
use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberType;
use libphonenumber\PhoneNumberFormat;
use App\Events\NumberVerified;

class TwilioNumber extends Model {

	protected $table = 'TwilioNumber';
	protected $fillable = ['sid', 'number'];

    public $timestamps = false;

    public static function verify($number, $country_code)
    {
        $valid_number = self::isValid($number, $country_code);
    	if(!$valid_number)
    		return false;

    	$numbers = self::get()->lists('number')->all();
    	$number_to_dial = $numbers[array_rand($numbers)];

        if(!Cache::tags($valid_number)->has('verifying'))
            Cache::tags($valid_number)->put('verifying', $number_to_dial, 1.5);

    	return compact('number_to_dial', 'valid_number');
    }

    public static function verified($data, $url, $signature)
    {
    	ksort($data);
    	foreach($data as $key => $value)
    	   $url .= $key.$value;

    	$sha1 = hash_hmac('sha1', $url, getenv('TWILIO_TOKEN'), true);
    	$generated_sig = base64_encode($sha1);

    	if($generated_sig !== $signature)
    		return false;

    	$number = $data['From'];
    	$number_to_dial = $data['To'];

	    if(Cache::tags($number)->get('verifying') == $number_to_dial) 
	    	Event::fire(new NumberVerified($number));

	    return true;
    }

    public static function isValid($number, $country_code)
    {
    	$phoneUtil = PhoneNumberUtil::getInstance();

		try {

		    $number_proto = $phoneUtil->parse($number, $country_code);
		    $isValid = $phoneUtil->isValidNumber($number_proto);
		    $isMobile = $phoneUtil->getNumberType($number_proto) == PhoneNumberType::MOBILE;
            $valid_number = $phoneUtil->format($number_proto, PhoneNumberFormat::E164);

		    if( $isValid && ((env('MOBILE_ONLY') && $isMobile) || !env('MOBILE_ONLY')) )
                return $valid_number;

            return false;

		} catch (NumberParseException $e) {

		    return false;
		}
    }

    public static function getCountryCode($ip)
    {
    	$client = new Client(['base_uri' => 'https://freegeoip.lwan.ws/json/']);
    	$response = $client->request('GET', $ip);

    	$data = json_decode($response->getBody());
    	return $data->country_code;
    }
}