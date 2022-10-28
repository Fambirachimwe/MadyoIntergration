<?php
/*
Plugin Name: Dstv Form
Plugin URI: http://example.com
Description: Dstv Recharge
Version: 1.0
Author: Tatenda Fambirachimwe
Author URI: https://tatenda-fambirachimwe.web.app/
*/




function dstvForm(){

    echo '<div id="loader"></div>';
    echo '
   
    <div class="container border rounded">

        
        <form id="dstv_form">
                <fieldset>
                <h2>Step 1: </h2>

                <div class="form-group">
                    <label for="cf-type">Select Package (required)</label><br/>
                    <select name="cf-type" id="cf-type" value="">
                        <option selected="selected" value="premium">Premium</option>
                        <option value="compact_plus">Compact Plus</option>
                        <option value="compact">Compact</option>
                    </select><br /> 
                </div>

                <div class="form-group">
                    <label for="cf-utilityAccount">Dstv Account</label>
                    <input required type="text" name="cf-utilityAccount" class="form-control" id="cf-utilityAccount" placeholder="Meter Number">
                </div>
                
                <div class="form-group">
                    <label for="cf-amount">Amount</label>
                    <input required type="text" class="form-control" id="cf-amount" placeholder="Amount">
                </div>

                

                
                <input type="button" id="step1_next" name="data[password]" class="next btn btn-info" value="Next" />
            </fieldset>


            <fieldset>
                <h2> Step 2: Verify Details </h2>

                <table class="table ">
                   
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Customer Data</td>
                        <td id="address"></td>
                    
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Utility Account</td>
                        <td id="utility_account"></td>
                        
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td >Package</td>
                        <td id="package"></td>
                        </tr>
                        
                    </tbody>
                </table>

                
            
                <input type="button" name="previous" class="previous btn btn-secondary" value="Previous" />
                <input type="button" name="data[password]" class="next btn btn-info" value="Next" />
               
            </fieldset>

            <fieldset>
                <h2> Step 3: Payment using Ecocash or OneMoney </h2>
                <div class="form-group">
                    <label for="fName">Ecocash or OneMoney Number</label>
                    <input type="text" required id="cf-payingNumber" class="form-control" name="data[fName]" id="fName" placeholder="Ecocash Number or OneMoney  Number">
                </div>
            
                <input type="button" name="previous" class="previous btn btn-secondary" value="Previous" />
                
                <input type="submit" required name="submit" id="_submit" class="submit btn btn-success rounded" value="Submit" id="submit_data" />
            </fieldset>

            
            
                
        </form>
  </div>
   
    ';
}




function dstvformJs (){
    echo '
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
                var baseUrl = "https://madyointergration-production.up.railway.app/dstv/pay";
                


                var data = {
                    amount: $("#cf-amount").val(),
                    type: $("#cf-type").val(),
                    payingNumber: $("#cf-payingNumber").val(),
                    utilityAccount: $("#cf-utilityAccount").val()
                };

            
                $.post(baseUrl, data, function(res) {
                    // $(".loader").css("display", "none");
                    // console.log(res);
                    
                    if(res.error === "err01"){
                        const message = res.message;
                        
                        Swal.fire({
                            title: "Error!",
                            text: `Token Purchase Failed`,
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    } 
                    else if(res.responseCode === "00") {
                        Swal.fire({
                            title: "Success!",
                            text: "Transaction processed successfully ",
                            icon: "success",
                            confirmButtonText: "OK"
                        });
                    }	

                    else if(res.responseCode === "09") {
                        Swal.fire({
                            title: "Success!",
                            text: "Transaction in progress",
                            icon: "info",
                            confirmButtonText: "OK"
                        });
                    }

                    // display the data to the frontend
                })
            });

        });

        
        

        
    </script>';


}

function getCustomerDstv(){
    echo '
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

            var getCustomerUrl = "https://madyointergration-production.up.railway.app/dstv/getCustomer";

            

            $("#step1_next").click(function(event){

                var _data = {
                    meterNumber: $("#cf-meterNumber").val()
                };
    
                console.log($("#cf-meterNumber").val());
                $.post(getCustomerUrl, _data, function(res){
                    console.log(res);

                    if(res.responseCode === "00"){
                        $("#address").html(function(){
                            return res.customerAddress;
                        });
                        
                        $("#details").html(function(){
                            return res.customerData;
                        });

                        $("#amount").html(function(){
                            return $("#cf-amount").val();
                        });

                        $("#meterNumber").html(function(){
                            return $("#cf-meterNumber").val();
                        });
                        
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: `Detail Verification Failed`,
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
    
                })
            });

            


        });


    </script> ;

    ';
}




function dstvformStyles(){
    echo '<style type="text/css">
	#dstv_form fieldset:not(:first-of-type) {
		display: none;
	}

    #loader {
        display: none;
		position: relative;
		// top: 50%;
		// left: 50%;
		// transform: translate(-50%, -50%);
		border: 16px solid #f3f3f3; /* Light grey */
		border-top: 16px solid #3498db; /* Blue */
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



function dstvcf_sCode() {
	ob_start();
	dstvformStyles();
	dstvForm();
    dstvformJs();
    getCustomerDstv();

	return ob_get_clean();
}



add_shortcode( 'dstv_multiStep_form', 'dstvcf_sCode' );




?>