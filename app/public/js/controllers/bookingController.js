
function BookingController()
{

// bind event listeners to button clicks //
	var that = this;
	this.formFields = [$('#patient1name-tf'), $('#patient1dob-tf'), $('#patient2name-tf'), $('#patient2dob-tf'), $('#patient3name-tf'), $('#patient3dob-tf'), $('#patient4name-tf'), $('#patient4dob-tf'), $('#nursename-tf'), $('#rangestartdate-tf'), $('#rangeenddate-tf')];

//handle user home button click
	$('#btn-home').click(function(){ 
		window.location.href = '/home';		
	});


// handle user logout //
	$('#btn-logout-user').click(function(){ that.attemptLogout(); });

	//handle user home button click
	$('#btn-evisit-submit').click(function(){ 
		that.submitBooking();	
	});

	this.submitBooking = function()
	{
		var that = this;
		var patient1name = this.formFields[0].val();
		var patient1dob = this.formFields[1].val();
		var patient2name = this.formFields[2].val();
		var patient2dob = this.formFields[3].val();
		var patient3name = this.formFields[4].val();
		var patient3dob = this.formFields[5].val();
		var patient4name = this.formFields[6].val();
		var patient4dob = this.formFields[7].val();
		var nursename = this.formFields[5].val();
		var rangestartdate = this.formFields[6].val();
		var rangeenddate = this.formFields[7].val();


		$.ajax({
			url: "/booking",
			type: "POST",
			data: {patient1name:patient1name, patient1dob:patient1dob, patient2name:patient2name, patient2dob:patient2dob, patient3name:patient3name, patient3dob:patient3dob, patient4name:patient4name, patient4dob:patient4dob, nursename:nursename, rangestartdate:rangestartdate, rangeenddate:rangeenddate},
			success: function(data){
				res.redirect('/booking-success');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				res.redirect('/booking-failure');
			}
		});
	}


	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/home",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}


	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}
}

