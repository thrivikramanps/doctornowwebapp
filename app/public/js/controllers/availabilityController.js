
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
		var freedate = this.formFields[0].val();
		var starttime = this.formFields[1].val();
		var endtime = this.formFields[2].val();

		$.ajax({
			url: "/availability",
			type: "POST",
			data: {action: 'enter to db', freedate:freedate, starttime: starttime, endtime: endtime},
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

				that.insertAvailabilityRecords(data);
				
				/*var n = data.length;

				var delete_element = document.getElementById('FreeTimeRecordHolderDiv');

				if (delete_element)
					delete_element.parentNode.removeChild(delete_element);
				
				var title_div = document.createElement('div');
				title_div.setAttribute('id', 'FreeTimeRecordHolderDiv');
				var parent_element = document.getElementById('availability-results');
				parent_element.appendChild(title_div);

				parent_element = document.getElementById('FreeTimeRecordHolderDiv');

				for (var i =0; i<n; i++) {
					//console.log(String(data[i].freedate) + " " + String(data[i].starttime) + " " + String(data[i].endtime) + " " + String(data[i]._id));
					if (String(data[i].freedate) != "undefined" && String(data[i].starttime) != "undefined" && String(data[i].endtime) != "undefined" && String(data[i]._id) !="undefined"){
						var div_new = document.createElement('div');
						div_new.setAttribute('id', String(data[i]._id));
						var text_new = document.createTextNode(String(data[i].freedate) + " " + String(data[i].starttime) + " " + String(data[i].endtime));
						var button_new = document.createElement('input');
						button_new.setAttribute('value', 'Delete');
						button_new.setAttribute('type', 'button');
						button_new.setAttribute('class', 'btn btn-primary');
						div_new.appendChild(text_new);
						text_new = document.createTextNode(" ");
						div_new.appendChild(text_new);
						div_new.appendChild(button_new);

						parent_element.appendChild(div_new); 	//add the result set to the availability-results element
						button_new.addEventListener("click",function(){that.deleteRecord(this.parentNode.id);});
						//parent_element.appendChild(button_new);
					}	
				}*/
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.deleteRecord = function(msg)
	{
		var that = this;
		var delnode = document.getElementById('availability-results'); 
		var identity = document.getElementById(msg);
		 

		$.ajax({
			url: "/availability",
			type: "POST",
			data: {action: 'delete from db', identity:msg},
			success: function(data){
	 			delnode.removeChild(identity);
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

	this.insertAvailabilityRecords = function(data){

		var n = data.length;

		var parent_element = document.getElementById('availability-results');

		while (parent_element.firstChild) {
    		parent_element.removeChild(parent_element.firstChild);
		}

		for (var i =0; i<n; i++){
			var tr = document.createElement('tr');
			tr.setAttribute('id', String(data[i]._id));
			var td0 = document.createElement('td');
			td0.style.width = "147px";
			var td1 = document.createElement('td');
			td1.style.width = "147px";
			var td2 = document.createElement('td');
			td2.style.width = "147px";
			var td3 = document.createElement('td');
			td3.style.width = "147px";

			var span1 = document.createElement('span');
			var span2 = document.createElement('span');
			var span3 = document.createElement('span');

			var button_new = document.createElement('input');
			button_new.setAttribute('value', 'Delete');
			button_new.setAttribute('type', 'button');
			button_new.setAttribute('class', 'btn');
			button_new.addEventListener("click",function(){that.deleteRecord(this.parentNode.parentNode.id);});

			span1.style.display = "block";
			span1.style.textAlign = "center";
			span1.innerHTML = String(data[i].freedate);
			span2.style.display = "block";
			span2.style.textAlign = "center";
			span2.innerHTML = String(data[i].starttime);
			span3.style.display = "block";
			span3.style.textAlign = "center";
			span3.innerHTML = String(data[i].endtime);

			td0.appendChild(span1);
			td1.appendChild(span2);
			td2.appendChild(span3);
			td3.appendChild(button_new);

			tr.appendChild(td0);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);

			parent_element.appendChild(tr);
		}

	}
}

