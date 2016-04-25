<?php

namespace App\Events;

class NumberVerified extends AbstractNumberEvent
{
    /**
     * Get the broadcast event name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'number.verified';
    }
}
