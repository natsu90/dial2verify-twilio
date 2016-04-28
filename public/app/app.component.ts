import {Component, OnInit} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

declare var swal: any;
declare var EventSource: any;

@Component({
    selector: 'my-app',
    template: `<form class="pure-form">
	        	<div class="pure-g">
	            <div class="pure-u-1 pure-u-md-1-1">
	                <input id="number" class="pure-u-23-24" [ngClass]="{'shake-hard shake-constant': isError}" type="text" placeholder="Phone number to verify" style="font-size:48px" [(ngModel)]="number">
	            </div>
	            </div>
	        </form>
	        <p>
	            <a (click)="verifyNumber()" href="#" class="pure-button pure-button-primary" [ngClass]="{'pure-button-disabled': isVerifyingInput}" style="font-size:36px"><i *ngIf="isVerifyingInput" class="fa fa-refresh fa-spin"></i> Verify</a>
	        </p>`
})

export class AppComponent implements OnInit { 
	
	isError = false;
	isVerifyingInput = false;
	number = '';

	constructor(public http: Http) {}

	ngOnInit() {
    	console.log('ngOnInit');
 	}

 	verifyNumber() {

 		if(!this.number)
 			return false;

 		this.isVerifyingInput = true;

 		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded');
 		this.http.post('/verify', 'number=' + encodeURIComponent(this.number), {headers: headers})
 			.map(res => res.json())
 			.subscribe(
		    	data => this.onVerifying(data),
		    	err => this.onError(),
		    	() => console.log('What is it doing here?')
			);
 	}

 	onVerifying(data) {
 		this.subscribeEvents();
 		this.isVerifyingInput = false;
 		this.number = data.valid_number;
 		swal({
			title: data.number_to_dial,
			text: "Dial this number within 90 secs from now to verify",
			type: "info",
			allowOutsideClick: false,
			showConfirmButton: false,
			timer: 1.6 * 60 * 1000
		});
 	}

 	onError() {
 		this.isVerifyingInput = false;
 		this.isError = true;
 		var that = this;
		setTimeout(function(){ that.isError = false; that.number = ''; }, 500);
 	}

 	subscribeEvents() {
 		var stream = new EventSource("events/" + this.number);

 		stream.addEventListener("message", function(event) {
			console.log(event);
		});

		stream.addEventListener("expired", function foo(event) {
			swal("Too late..", "Your verification process is expired", "error");
			this.removeEventListener("expired", foo);
			stream.close();
		});

		stream.addEventListener("verified", function foo(event) {
			swal("Verified!", "It's seems your number is correct", "success");
			this.removeEventListener("verified", foo);
			stream.close();
		});
 	}

 	onVerified() {

 	}

 	onExpired() {
 		
 	}
}