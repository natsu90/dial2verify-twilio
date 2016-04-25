<?php

namespace App\Listeners;

use App\Events\NumberVerified;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Events\ServerSentEvents;
use Cache;

class SendVerifiedStatus
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
    public function handle(NumberVerified $event)
    {
        $number = $event->number;
        
        $sse = new ServerSentEvents($number);
        $sse->send('', 'verified');
    }
}
