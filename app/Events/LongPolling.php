<?php

namespace App\Events;

class LongPolling extends AbstractNumberEvent
{
    /**
     * Get the broadcast event name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'polling.' . $this->number;
    }
}
