<?php

use Illuminate\Http\Request;
use App\Models\TwilioNumber;
use App\Events\LongPolling;
use App\Events\ServerSentEvents;
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

	$data = $request->instance()->request->all();
	$signature = $request->header('X-Twilio-Signature');
	$url = $request->fullUrl();

	if(TwilioNumber::verified($data, $url, $signature))
    	return response('OK', 200);

    return response('NOT-AUTHORIZED', 401);
});

// post number to verify
$app->post('/verify', function(Request $request) {

	$this->validate($request, [

		'number' => 'required'
	]);

    $number = $request->input('number');

    $data = TwilioNumber::verify($number);
    if($data)
    	return response()->json($data);

    return response('WRONG-FORMAT', 400);
});

// server sent event
$app->get('/events/{number}', function($number) {

	event(new LongPolling($number));

	$sse = new ServerSentEvents($number);
	$sse->output();
});
