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

	this.insertPatientRecords = function(patientRecords, evisit_id){

		var inputsname = [patientRecords[0].patient1name, patientRecords[0].patient2name, patientRecords[0].patient3name, patientRecords[0].patient4name];
		var inputsdob =  [patientRecords[0].patient1dob, patientRecords[0].patient2dob, patientRecords[0].patient3dob, patientRecords[0].patient4dob];
		var parent_element = document.getElementById('patientlistcontainer');

		var role = document.getElementById('role');
		
		for (var i =0; i<4; i++){
			var tr = document.createElement('tr');
			var td0 = document.createElement('td');
			td0.style.width = "75px";
			var td1 = document.createElement('td');
			td1.style.width = "75px";
			
			if (role.value === 'Admin'){
				var td2 = document.createElement('td');
				td2.style.width = "75px";
				var td3 = document.createElement('td');
				td3.style.width = "75px";
				var input1 = document.createElement('input');
				input1.setAttribute('type', 'submit');
				input1.setAttribute('value', 'Upload Data');
				var input2 = document.createElement('input');
				input2.setAttribute('type', 'submit');
				input2.setAttribute('value', 'Upload History');
			}

			var span1 = document.createElement('span');
			var span2 = document.createElement('span');

			span1.style.display = "block";
			span1.style.textAlign = "center";
			span1.innerHTML = inputsname[i];
			span2.style.display = "block";
			span2.style.textAlign = "center";
			span2.innerHTML = inputsdob[i];

			td0.appendChild(span1);
			td1.appendChild(span2);
			if (role.value === 'Admin'){
				td2.appendChild(input1);
				td3.appendChild(input2);
			}	

			tr.appendChild(td0);
			tr.appendChild(td1);
			if (role.value === 'Admin'){
				tr.appendChild(td2);
				tr.appendChild(td3);
			}
			
			parent_element.appendChild(tr);

		}
		
		

		

	}
}

