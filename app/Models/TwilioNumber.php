<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TwilioNumber extends Model {

	protected $table = 'TwilioNumber';
	protected $fillable = ['sid', 'number'];

    public $timestamps = false;

    public static function getRandomNumber()
    {
        $numbers = self::get()->lists('number')->all();
        return $numbers[array_rand($numbers)];
    }
}