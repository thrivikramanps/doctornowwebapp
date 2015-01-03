
function eVisitSessionController()
{

// bind event listeners to button clicks //
	var that = this;

//handle user home button click
	$('#btn-home').click(function(){ 
		window.location.href = '/home';		
	});

	var role = $('#user-role').attr('roletype');

	if (role !== 'Doctor')
	{
		$('#notesselector').hide();
		var general = document.getElementById('generalselector');
		var history = document.getElementById('historyselector');
		var notes = document.getElementById('notesselector');
		general.style.width = "30%";
		history.style.width = "30%";
		notes.style.width = "30%";
	}


// handle user logout //
	$('#btn-logout-user').click(function(){ that.attemptLogout(); });

	$('#generalselector').click(function(){
		var general = document.getElementById('generalselector');
		var history = document.getElementById('historyselector');
		var notes = document.getElementById('notesselector');
		var list = document.getElementById('listselector');
		general.style.backgroundColor = "black";
		general.style.color = "white";
		history.style.backgroundColor = "white";
		history.style.color = "black";
		if (notes){
			notes.style.backgroundColor = "white";
			notes.style.color = "black";
		}
		if (list && list.display !== "none"){
			list.style.backgroundColor = "white";
			list.style.color = "black";
		}

	});

	$('#historyselector').click(function(){
		var general = document.getElementById('generalselector');
		var history = document.getElementById('historyselector');
		var notes = document.getElementById('notesselector');
		history.style.backgroundColor = "black";
		history.style.color = "white";
		general.style.backgroundColor = "white";
		general.style.color = "black";
		if (notes){
			notes.style.backgroundColor = "white";
			notes.style.color = "black";
		}
		if (list && list.display !== "none"){
			list.style.backgroundColor = "white";
			list.style.color = "black";
		}
	});

	$('#notesselector').click(function(){
		var general = document.getElementById('generalselector');
		var history = document.getElementById('historyselector');
		var notes = document.getElementById('notesselector');
		notes.style.backgroundColor = "black";
		notes.style.color = "white";
		general.style.backgroundColor = "white";
		general.style.color = "black";
		history.style.backgroundColor = "white";
		history.style.color = "black";
		if (list && list.display !== "none"){
			list.style.backgroundColor = "white";
			list.style.color = "black";
		}
	});

	$('#listselector').click(function(){
		var general = document.getElementById('generalselector');
		var history = document.getElementById('historyselector');
		var notes = document.getElementById('notesselector');
		notes.style.backgroundColor = "white";
		notes.style.color = "black";
		general.style.backgroundColor = "white";
		general.style.color = "black";
		history.style.backgroundColor = "white";
		history.style.color = "black";
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

