<?php

namespace App\Events;

use Cache;
use Igorw\EventSource\Stream;

class ServerSentEvents 
{
	public $number;

	private $ttl = 10/ 60 *1;

	public function __construct($number)
	{
		$this->number = $number;
	}

	public function send($message, $event = null)
	{
		if($event)
        	Cache::tags($this->number)->put('sse-event', $event, $this->ttl);

        Cache::tags($this->number)->put('sse-message', $message, $this->ttl);
	}

	public function output()
	{
	    foreach (Stream::getHeaders() as $name => $value) 
	    {
	    	header("$name: $value");
		}

		$stream = new Stream;
		$stream = $stream->event();

		if(Cache::tags($this->number)->has('sse-event'))
			$stream = $stream->setEvent(Cache::tags($this->number)->pull('sse-event'));

		if(Cache::tags($this->number)->has('sse-message'))
			$stream->setData(Cache::tags($this->number)->pull('sse-message'))->end()->flush();
	}
}