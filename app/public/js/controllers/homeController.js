
function HomeController()
{

// bind event listeners to button clicks //
	var that = this;

//handle user home button click
	$('#btn-home').click(function(){ 
		window.location.href = '/home';		
	});


// handle user logout //
	$('#btn-logout-user').click(function(){ that.attemptLogout(); });

	//handle user home button click
	$('#btn-set-availability').click(function(){ 
		window.location.href = '/availability';		
	});


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

