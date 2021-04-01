function handleSubmit()
		{
			event.preventDefault();

			console.log('submit Payment function');
			var cd = document.getElementById('cardholder').value;
			var cn = document.getElementById('cardNumber').value;
			var ced = document.getElementById('cardExpiryDate').value;
			var csc = document.getElementById('cardSecurityCode').value;
			var rememberMe = document.getElementById('rememberCard').value;
			var autoRenew = document.getElementById('autoRenewel').value;

			//test card 4005550000000001
			var ItemJSON = '{    "cardExpiryDate": "'+ced+'",    "cardNumber": "'+cn+'",   "cardHolder": "'+cd+'",   "cardSecurityCode": "'+csc+'", "currency": "EGP",  "customer_email": "test@test.com",  "language": "en",  "clientIdentifier": "testClient", "userId":"testUser", "appId":"duTestApp", "amount":"100"  }';

			console.log('request body: ' + ItemJSON);

			
			
			return false;
			
		}