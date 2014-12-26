
function AvailabilityController()
{

// bind event listeners to button clicks //
	var that = this;
	this.formFields = [$('#date-tf'), $('#starttime-tf'), $('#endtime-tf')];

//handle user home button click
	$('#btn-home').click(function(){ 
		window.location.href = '/home';		
	});


// handle user logout //
	$('#btn-logout-user').click(function(){ that.attemptLogout(); });

	//handle user home button click
	$('#btn-availability-submit').click(function(){ 
		that.submitAvailability();	
	});

	$('#btn-availability-view').click(function(){
		that.displayCurrentAvailability();
	});

	this.submitAvailability = function()
	{
		var that = this;
		var date = this.formFields[0].val();
		var starttime = this.formFields[1].val();
		var endtime = this.formFields[2].val();

		$.ajax({
			url: "/availability",
			type: "POST",
			data: {action: 'enter to db', date:date, starttime: starttime, endtime: endtime},
			success: function(data){
	 			//that.showUpdatedList();
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	//this function adds the successul form entry post-db commit to the current view of free days/times
	this.showUpdatedList = function()
	{
		var that = this;
		var date = this.formFields[0].val();
		var starttime = this.formFields[1].val();
		var endtime = this.formFields[2].val();

		//find the availability-results elements and add the new element to it
	}

	//this function just fetches the entire record list corresponding to the current user and displays it for viewing
	this.displayCurrentAvailability = function()
	{
		var that = this;
		$.ajax({
			url: "/availability",
			type: "POST",
			data: {action: 'display current availability'},
			success: function(data){
				
				var n = data.length;
				console.log(" successfully reached availabilityController" + data[2].date + " " + data[2]._id + " " + data[2].starttime + " " + data[2].endtime + " "+ data[2].user);
	 			//add the result set to the availability-results element
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
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

