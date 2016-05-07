<?php

use Illuminate\Http\Request;
use App\Models\TwilioNumber;
use App\Events\LongPolling;
use App\Events\ServerSentEvents;
use App\TwilioStatus;
use App\PhoneValidation;
use App\GeoIp;
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {

    return view('home', ['version' => $app->version()]);
});

// twiml
$app->get('/twiml', function() {

    return response('<?xml version="1.0" encoding="UTF-8"?><Response><Reject reason="busy" /></Response>')
		->header('Content-Type', 'application/xml');
});

// twilio status webhook
$app->post('/status', function(Request $request) {

    try {

    	$status = new TwilioStatus($request);
    	$status->verifyNumber();

    	return response('OK', 200);

	} catch(Exception $e) {

		return response($e->getMessage(), $e->getCode()); 
	}
});

// post number to verify
$app->post('/verify', function(Request $request) {

	$this->validate($request, [

		'number' => 'required'
	]);
	
    $geoip = new GeoIp($request->ip());

    try {

    	$phone_validation = new PhoneValidation($request->input('number'), $geoip);
    	$number_to_dial = $phone_validation->verify();
    	$valid_number = $phone_validation->getValidNumber();
    	return response()->json(compact('number_to_dial', 'valid_number'));

    } catch(Exception $e) {

		return response($e->getMessage(), $e->getCode() ?: 400); 
	}
});

// server sent event
$app->get('/events/{number}', function($number) {

	event(new LongPolling($number));

	$sse = new ServerSentEvents($number);
	$sse->output();
});

$app->get('/country', function(Request $request) {

	return response()->json([
		'country_code' => TwilioNumber::getCountryCode(), 
		'ip' => TwilioNumber::getIpAddress(),
		'ip0' => $request->ip()
	]);
});
