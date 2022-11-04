<?php
/*
Plugin Name: Airtime Multistep Form
Plugin URI: http://example.com
Description: Multistep Form
Version: 1.0
Author: Tatenda Fambirachimwe
Author URI: https://tatenda-fambirachimwe.web.app/
*/




function Form(){

    echo '<div id="loader"></div>';
    echo '
   
    <div class="container border rounded">

        
        <form id="regiration_form">
                <fieldset>
                <h2>Step 1: </h2>
                <div class="form-group">
                    <label for="cf-type">Type (required)</label><br/>
                    <select name="cf-type" id="cf-type" value="">
                        <option selected="selected" value="econet">Econet</option>
                        <option value="netone">Netone</option>
                        <option value="telecel">Telecel</option>
                    </select><br /> 
                </div>
                <div class="form-group">
                    <label for="cf-amount">Amount</label>
                    <input required type="text" class="form-control" id="cf-amount" placeholder="Amount">
                </div>

                <div class="form-group">
                    <label for="cf-targetMobile">Mobile Number</label>
                    <input required type="text" name="cf-targetMobile" class="form-control" id="cf-targetMobile" placeholder="Mobile Number">
                </div>
                <input type="button" name="data[password]" class="next btn btn-success" value="Next" />
            </fieldset>
            <fieldset>
                <h2> Step 2: Payment using Ecocash or Onemoney </h2>
                <div class="form-group">
                <label for="fName">Ecocash Number</label>
                <input type="text" required id="cf-payingNumber" class="form-control" name="data[fName]" id="fName" placeholder="Ecocash number or Onemoney nubmer">
            </div>
            
                <input type="button" name="previous" class="previous btn btn-secondary" value="Previous" />
                <input type="submit" required name="submit" id="_submit" class="submit btn btn-success rounded" value="Submit" id="submit_data" />
            </fieldset>
            
                
        </form>
  </div>
   
    ';
}




function formJs (){
    echo'
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

    <script type="text/javascript">

    $(document).ajaxStart(function(){
        // Show image container
        $("#loader").show();
      });
      $(document).ajaxComplete(function(){
        // Hide image container
        $("#loader").hide();
      });

        $(document).ready(function(){
            var current = 1,current_step,next_step,steps;
            steps = $("fieldset").length;
            
            $(".next").click(function(){
                current_step = $(this).parent();
                next_step = $(this).parent().next();
                
                next_step.show();
                current_step.hide();
                
            });

            $(".previous").click(function(){
                current_step = $(this).parent();
                next_step = $(this).parent().prev();
                
                next_step.show();
                current_step.hide();
                
            });
            // submit data to the api here

            $("#_submit").click(function(event){
                event.preventDefault();
                var type = $("#cf-type").val();
                var baseUrl = "https://madyointergration-production.up.railway.app/v2";
                let ajaxUrl;
                switch(type){
                    case "econet":
                        ajaxUrl = baseUrl + "/airtime/econet/buy";
                        break;
                        
                    case "netone":
                        ajaxUrl = baseUrl + "/airtime/netone/buy";
                        break;
                        
                    case "telecel":
                        ajaxUrl = baseUrl + "/airtime/telecel/buy";
                        break;
                }

                var data = {
                    amount: $("#cf-amount").val(),
                    targetMobile: $("#cf-targetMobile").val(),
                    payingNumber: $("#cf-payingNumber").val()
                };

                // console.log(data);


            
                $.post(ajaxUrl, data, function(res) {
                    // $(".loader").css("display", "none");
                    console.log(res);
                    
                    if(res.error === "err01"){
                        const message = res.message;
                        
                        Swal.fire({
                            title: "Error!",
                            text: `Air time purchase failed`,
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    } else if(res.responseCode === "00") {
                        Swal.fire({
                            title: "Success!",
                            text: "Transaction processed successfully ",
                            icon: "success",
                            confirmButtonText: "OK"
                        });
                    }	
                })
            });

        });

        
        

        
    </script>';
}




function formStyles(){
    echo '<style type="text/css">
	#regiration_form fieldset:not(:first-of-type) {
		display: none;
	}

    #loader {
        display: none;
		position: relative;
		// top: 50%;
		// left: 50%;
		// transform: translate(-50%, -50%);
		border: 16px solid #f3f3f3; /* Light grey */
		border-top: 16px solid #43b02a; /* Blue */
		border-radius: 50%;
		width: 120px;
		height: 120px;
		animation: spin 2s linear infinite;
        z-index: 100;
	}

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }
	
  </style>';
}



function cf_sCode() {
	ob_start();
	formStyles();
	Form();
    formJs();

	return ob_get_clean();
}



add_shortcode( 'air_multi_step_form', 'cf_sCode' );




?>