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

	$('#generalselector').click(function(){
		var general = document.getElementById('generalselector');
		var history = document.getElementById('historyselector');
		var notes = document.getElementById('notesselector');
		general.style.backgroundColor = "black";
		general.style.color = "white";
		history.style.backgroundColor = "white";
		history.style.color = "black";
		if (notes){
			notes.style.backgroundColor = "white";
			notes.style.color = "black";
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
	});


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
		});
	});

	var general = document.getElementById('generalselector');
	var tabselected = general.style.color === "white"? "general":"history";

	$('.pdffetchform').ajaxForm({
		//console.log("passed values are " + idevisit + " " + tabselected);	
			beforeSubmit : function(formData, jqForm, options){
				// append 'remember-me' option to formData to write local cookie //
					console.log("entered before submit region");
					formData.push({name:'action', value: 'fetchpdf'}, {name:'type', value: tabselected});
					return true;
			},
			success: function(response) {
					console.log("patientpdf response is " + response);
					//that.displayPdfinTabSelected(response, tabselected);
			},
			error: function(jqXHR) {
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
	});

	/*$('#uploadform').submit(function() {
        console.log('uploading the file ...');
 
        $(this).ajaxSubmit({                                                                                                                 
 
            error: function(xhr) {
				console.log('Error: ' + xhr.status);
            },
 
            success: function(response) {

				if(response.error) {
            		console.log('Opps, something bad happened');
            		return;
        		}

        		//var pdfurlonServer = response.path;

        		console.log("ok");
        		//$('<div/>').attr('src', imageUrlOnServer).appendTo($('body'));
            }
		});
 
	// Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this                                                                                                                      
		return false;
    });*/
		
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


	this.pdffetcher = function(event){
		console.log("reached the pdffetcher function");
		$target = $(event.target);
		$target.form.submit();
	}


	this.insertPatientRecords = function(patientRecords, evisit_id)
	{

		var inputsname = [patientRecords[0].patient1name, patientRecords[0].patient2name, patientRecords[0].patient3name, patientRecords[0].patient4name];
		var inputsdob =  [patientRecords[0].patient1dob, patientRecords[0].patient2dob, patientRecords[0].patient3dob, patientRecords[0].patient4dob];
		var parent_element = document.getElementById('patientlistcontainer');

		while (parent_element.firstChild) {
    		parent_element.removeChild(parent_element.firstChild);
		}

		//var role_element = document.getElementById('user-role');
		var role = $('#user-role').attr('roletype');

		var elementWidth;

		if (role === 'Doctor' || role === 'Admin')
			elementWidth = "70px";
		else
			elementWidth = "75px";
		
		for (var i =0; i<4; i++){
			var tr = document.createElement('tr');
			tr.style.verticalAlign = "top";
			var td0 = document.createElement('td');
			td0.style.width = elementWidth;
			var td1 = document.createElement('td');
			td1.style.width = elementWidth;
			if (role === "Admin"){
				var td2 = document.createElement('td');
				td2.style.width = elementWidth;
			}

			if (role === "Admin"){

				var form_element = document.createElement('form');
				form_element.method = "POST";
				form_element.action = "/evisitreview";
				form_element.className = "pdffetchform";

				var input_element = document.createElement('input');
				input_element.type = "hidden";
				input_element.name = "identity";
				input_element.value = inputsname[i]+"_"+inputsdob[i];
				form_element.appendChild(input_element);

				var button = document.createElement('input');
				button.type = "button";
				button.value = "fetch";
				button.name = "submit";
				button.className = "pdffetchsubmit";
				form_element.appendChild(button);
				button.addEventListener("click", that.pdffetcher);
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

			if (role === 'Admin')
				td2.appendChild(form_element);

			tr.appendChild(td0);

			if (role !== 'Doctor')
				tr.appendChild(td1);

			if (role === 'Admin')
				tr.appendChild(td2);
			
			//tr.id = inputsname[i] + ":" + inputsdob[i];
			tr.className = "patientrecord";

			parent_element.appendChild(tr);

		}
	}

	this.displayPdfinTabSelected = function(response, selectedtab){

		if (selectedtab === 'general')
			document.getElementById("upload_target_general").contentWindow.document.body.innerHTML=response;
		else if (selectedtab === 'history')
			document.getElementById("upload_target_history").contentWindow.document.body.innerHTML=response;

	}
}

