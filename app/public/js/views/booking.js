$(document).ready(function() {
  var bc = new BookingController();

  $('patient1dob-tf').datepicker({changeMonth: true, changeYear: true});
  $('patient2dob-tf').datepicker({changeMonth: true, changeYear: true});
  $('patient3dob-tf').datepicker({changeMonth: true, changeYear: true});
  $('patient4dob-tf').datepicker({changeMonth: true, changeYear: true});
  $('rangestartdate-tf').datepicker({changeMonth: true, changeYear: true});
  $('rangeenddate-tf').datepicker({changeMonth: true, changeYear: true});

  
});