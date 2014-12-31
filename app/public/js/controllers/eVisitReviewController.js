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
			that.showLockedAlert('record was removed.', false);
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

	$('#uploadform').submit(function() {

		$.ajaxSubmit({

			error: function(xhr) {
					status('Error: ' + xhr.status);
					that.showLockedAlert('Upload failed', false);
			},

			success: function(response) {
					  console.log(response);
					  that.showLockedAlert('Uploaded success', false);
			}
		});

		return false;
	}); 

	
	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/home",
			type: "POST",
			data: {logout : true},
			success: function(data){
				that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.', true);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}


	this.showLockedAlert = function(msg, redirect){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){if (redirect) window.location.href = '/';});
		setTimeout(function(){if (redirect) window.location.href = '/';}, 3000);
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
				td2.style.width = "100px";
				var uploadform = document.createElement('form');
				uploadform.name = 'uploadform';
				uploadform.method = 'post';
				uploadform.action = '/upload/patientfiles';
				uploadform.id = 'uploadform';
				uploadform.id = 'multipart/form-data';

				var input1 = document.createElement('input');
				input1.setAttribute('type', 'file');
				input1.setAttribute('name', 'datafile');
				input1.setAttribute('accept', 'image/*');
				uploadform.appendChild(input1);
				
				var input2 = document.createElement('input');
				input2.setAttribute('type', 'file');
				input2.setAttribute('name', 'historyfile');
				input2.setAttribute('accept', 'image/*');
				uploadform.appendChild(input2);

				var input3 = document.createElement('input');
				input3.setAttribute('type', 'submit');
				input3.setAttribute('value', 'Submit');
				uploadform.appendChild(input3);
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
				td2.appendChild(uploadform);
			}	

			tr.appendChild(td0);
			tr.appendChild(td1);
			if (role.value === 'Admin'){
				tr.appendChild(td2);
			}
			
			parent_element.appendChild(tr);

		}
		
		

		

	}
}

