<?php

namespace App;

use Illuminate\Http\Request;
use Exception;

class TwilioStatus {

	private $data;

	public function __construct(Request $request)
	{
		$data = $request->instance()->request->all();
		$signature = $request->header('X-Twilio-Signature');
		$url = $request->fullUrl();

		ksort($data);
    	foreach($data as $key => $value)
    	   $url .= $key.$value;

    	$sha1 = hash_hmac('sha1', $url, $this->getTwilioToken(), true);
    	$generated_sig = base64_encode($sha1);

    	if($generated_sig !== $signature)
    		throw new Exception("NOT_AUTHORIZED", 401);

    	$this->data = $data;
	}

	public function getTwilioToken()
	{
		return getenv('TWILIO_TOKEN');
	}

	public function verifyNumber()
	{
		PhoneValidation::triggerVerified($this->data['From'], $this->data['To']);
	}
}