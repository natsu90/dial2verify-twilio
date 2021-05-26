## Dial2Verify Twilio

Phone verification at no cost!

Well, not really. You still have to pay Twilio for the phone numbers ($1 per month each).

[![Featured on Hacker News](https://hackerbadge.now.sh/api?id=11652454)](https://news.ycombinator.com/item?id=11652454)

### Warning

A lot of peoples have pointed out that phone number can be spoofed, so this can't be used as a form of secure authentication. More discussions here: https://news.ycombinator.com/item?id=11652454

### Idea

I stumbled this [page](https://www.twilio.com/docs/api/twiml/reject) in Twilio API documentation while working on some other idea.

> The `<Reject>` verb rejects an incoming call to your Twilio number without billing you. This is very useful for blocking unwanted calls.

![itsfreememe](https://i.kym-cdn.com/entries/icons/original/000/005/169/Screenshot_67.png "It's Free!")

Noted that Twilio will trigger webhook for any incoming phone call if you set the **Status Callback URL**. So I thought this can be used for phone verification, with no additional cost.

### Missed Call Verification

1. User send phone number from a web form
2. We will return a phone number for user to dial
3. User have to dial the number within 90 seconds, otherwise verification will expired

### Demo

http://dial2verify-twilio.sulai.mn/

### Dependencies

- PHP >= 5.5.9
- SQLite
- Memcached

### Installation

1. Copy `.env.sample` content to `.env`
2. Set the following details,
```
TWILIO_SID=
TWILIO_TOKEN=
MOBILE_ONLY=false # set to true if you want to accept verification from mobile number only
APP_URL=http://your-site.com
```
3. `composer install`
4. `php artisan migrate && php artisan twilio:setup`
5. `cd public/ && npm install && npm run tsc`

### License

Licensed under the [MIT license](http://opensource.org/licenses/MIT)
