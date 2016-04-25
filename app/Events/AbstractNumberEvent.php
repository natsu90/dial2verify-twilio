<?php

namespace App\Events;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

abstract class AbstractNumberEvent extends Event
{
	public $number;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($number)
    {
        $this->number = $number;
    }

    /**
     * Get the broadcast event name.
     *
     * @return string
     */
    abstract public function broadcastAs();
}
