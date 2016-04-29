## Dial2Verify Twilio

Phone verification at no cost!

Well, not really. You still have to pay Twilio for the phone numbers ($1 per month each).

### Idea

I stumbled this [page](https://www.twilio.com/docs/api/twiml/reject) in Twilio API documentation while working on some other idea.

> The `<Reject>` verb rejects an incoming call to your Twilio number without billing you. This is very useful for blocking unwanted calls.

![itsfreememe](http://i0.kym-cdn.com/entries/icons/original/000/005/169/Screenshot_67.png "It's Free!")

Noted that Twilio will trigger webhook for any incoming phone call if you set the **Status Callback URL**. So I thought this can be used for phone verification, with no additional cost.

### Missed Call Verification

1. User send phone number from a web form
2. We will return a phone number for user to dial
3. User have to dial the number within 90 seconds, otherwise verification will expired

### Demo

http://dial2verify-twilio.herokuapp.com

### Dependencies

- PHP >= 5.5.9
- MySQL
- Redis

### Installation

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/natsu90/dial2verify-twilio)

#### OR

1. Copy `.env.sample` content to `.env`
2. Set the MySQL detail, and as well as following details,
```
TWILIO_SID=
TWILIO_TOKEN=
MOBILE_ONLY=False # set to true if you want to accept verification from mobile number only
URL=http://your-site.com
```
3. `composer install`
4. `php artisan migrate && php artisan twilio:setup`
5. `cd public/ && npm install && npm run tsc`

### License

Licensed under the [MIT license](http://opensource.org/licenses/MIT)
