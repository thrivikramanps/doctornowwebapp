function eVisitReviewController()
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


	$('.evisitrecordactiondelete').click(function(event) {
	    $target = $(event.target)
	    var idevisit = $target.attr('evisitid');
	    
	    $.ajax({
	      type: 'POST',
	      url: '/evisitreview',
	      data: {
	      	action 	 : 'delete',
	        identity : idevisit
	      },
	      success: function(response) {
	        $target.parent().parent().remove();
	        that.showLockedAlert('record was removed.');
	      },
	      error: function(jqXHR) {
	        console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
	      }
	    })
  	});

  	$('.evisitrecordactionfetch').click(function(event) {
	    $target = $(event.target)
	    var idevisit = $target.attr('evisitid');

	    $.ajax({
	      type: 'POST',
	      url: '/evisitreview',
	      data: {
	      	action 	 : 'fetch',
	        identity : idevisit
	      },
	      success: function(response) {
	      	that.insertPatientRecords(response);
	      },
	      error: function(jqXHR) {
	        console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
	      }
	    })
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
		$('.modal-alert button').click(function(){});
		setTimeout(function(){window.location.href = '/';}, 3000);
	}

	this.insertPatientRecords = function(patientRecords){
		var parent_element = document.getElementById('patientlistcontainer');

		var tr = document.createElement('tr');
		var td0 = document.createElement('td');
		var td1 = document.createElement('td');
		td0.appendChild(document.createTextNode(patientRecords[0].patient1name));
		td1.appendChild(document.createTextNode(patientRecords[0].patient1dob));

		tr.appendChild(td0);
		tr.appendChild(td1);
		parent_element.appendChild(tr);

		
		tr = document.createElement('tr');
		td0 = document.createElement('td');
		td1 = document.createElement('td');
		td0.appendChild(document.createTextNode(patientRecords[0].patient2name));
		td1.appendChild(document.createTextNode(patientRecords[0].patient2dob));

		tr.appendChild(td0);
		tr.appendChild(td1);
		parent_element.appendChild(tr);

		
		tr = document.createElement('tr');
		td0 = document.createElement('td');
		td1 = document.createElement('td');
		td0.appendChild(document.createTextNode(patientRecords[0].patient3name));
		td1.appendChild(document.createTextNode(patientRecords[0].patient3dob));

		tr.appendChild(td0);
		tr.appendChild(td1);
		parent_element.appendChild(tr);

		
		tr = document.createElement('tr');
		td0 = document.createElement('td');
		td1 = document.createElement('td');
		td0.appendChild(document.createTextNode(patientRecords[0].patient4name));
		td1.appendChild(document.createTextNode(patientRecords[0].patient4dob));

		tr.appendChild(td0);
		tr.appendChild(td1);
		parent_element.appendChild(tr);

		

	}
}

