<?php

namespace App\Listeners;

use App\Events\LongPolling;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Events\ServerSentEvents;
use Cache;

class ExpiredVerification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  NumberVerified  $event
     * @return void
     */
    public function handle(LongPolling $event)
    {
        $number = $event->number;
        
        if(!Cache::tags($number)->has('verifying')) {

            $sse = new ServerSentEvents($number);
            $sse->send('', 'expired');
        }
    }
}
