<?php 

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Log;
use App\Models\TwilioNumber;
use GuzzleHttp\Client;

class TwilioSetup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'twilio:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Configure twilio to work with Dial2verify';

    /**
     * Create a new command instance.
     *
     * @param  DripEmailer  $drip
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Configuring Twilio..');

        $client = new Client([
            'base_uri' => sprintf('https://api.twilio.com/2010-04-01/Accounts/%s/', getenv('TWILIO_SID')), 
            'auth' => [getenv('TWILIO_SID'), getenv('TWILIO_TOKEN')]
        ]);

        $response = $client->request('GET', 'IncomingPhoneNumbers.json');

        $body = json_decode($response->getBody());

        TwilioNumber::truncate();
        foreach($body->incoming_phone_numbers as $number)
        {
            // save to db
            TwilioNumber::create([
                'sid' => $number->sid,
                'number' => $number->phone_number
            ]);

            // update twilio
            $response = $client->request('POST', sprintf('IncomingPhoneNumbers/%s.json', $number->sid), 
                [
                    'form_params' => [
                        'VoiceUrl' => getenv('APP_URL') . '/twiml',
                        'VoiceMethod' => 'GET',
                        'StatusCallback' => getenv('APP_URL') . '/status',
                        'StatusCallbackMethod' => 'POST'
                    ]
                ]);
        }
    }
}