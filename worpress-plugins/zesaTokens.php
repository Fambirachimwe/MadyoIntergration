<?php
/*
Plugin Name: Zesa Token Form
Plugin URI: http://example.com
Description: AirTime Form
Version: 1.0
Author: Tatenda Fambirachimwe
Author URI: https://tatenda-fambirachimwe.web.app/
*/

function zesaResult(){
    echo '<div id="result">This is the result section of the response</div>';
}

function zesa_form() {

    echo '<div id="zesa_response"></div>';
	echo '<form  action="http://localhost:8000/?page_id=87" method="post">';
	echo '<p>';
	echo 'Amount (required) <br/>';
	echo '<input type="text" name="cf-amount" pattern="[a-zA-Z0-9 ]+" value="' . ( isset( $_POST["cf-amount"] ) ? esc_attr( $_POST["cf-amount"] ) : '' ) . '" size="40" />';
	echo '</p>';


	echo '<p>';
	echo 'Meter Number (required) <br/>';
	echo '<input type="text" name="cf-meterNumber" pattern="[a-zA-Z0-9 ]+" value="' . ( isset( $_POST["cf-meterNumber"] ) ? esc_attr( $_POST["cf-meterNumber"] ) : '' ) . '" size="40" />';
	echo '</p>';


	echo '<p>';
	echo 'Phone Number (required) <br/>';
	echo '<input type="text" name="cf-phoneNumber" pattern="[a-zA-Z0-9 ]+" value="' . ( isset( $_POST["cf-phoneNumber"] ) ? esc_attr( $_POST["cf-phoneNumber"] ) : '' ) . '" size="40" />';
	echo '</p>';


	echo '<p><input type="submit" name="cf-submitted" value="Pay"></p>';


	echo '</form>';
}


function alertError($message) {
      
    // Display the alert box 
    // echo "<script>alert('$message');</script>";
    echo " 
    <script>
        Swal.fire({
            title: 'Error!',
            text: '$message',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    </script>
    ";
}


function alertSuccess2($message) {
      
    // Display the alert box 
    // echo "<script>alert('$message');</script>";
    echo " 
    <script>
        Swal.fire({
            title: 'Success!',
            text: '$message',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    </script>
    ";
}

function alertSuccess3($message) {
      
    // Display the alert box 
    // echo "<script>alert('$message');</script>";

    // {"processingCode": "U50000", "transactionAmount": 5000, "transmissionDate": "30920081415", "vendorNumber": "V3003616720091", "transactionReference": "P1584561929472", "responseCode": "00", "arrears": "Debt Recovery|898766677|800|0|7700", "utilityAccount": "41234567890", "narrative": "Transaction Successfully Processed", "paymentType": "PREPAID", "token": "21644392780719203722|41.5|41.5 kWh @ 2.0 $/kWh: : :|POWERT3EMDB1413342|8299|1215|0%", "fixedCharges": "RE Levy (6%)|POWERT3EMDB1413342|486|0|6%", "miscellaneousData": "", "currencyCode": "ZWL", "merchantName": "ZETDC", "productName": "ZETDC_PREPAID" }
    echo " 
    <script>
        Swal.fire({
            title: 'Success!',
            html: '
                'Token: $message->token,  <br>' 
                'MeterNumber: $message->utilityAccount,  <br>' 
                'Amount: $message->transactionAmount,  <br>' 
                ',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    </script>
    ";
}

//TODO: display the response to the frontend

function displayToFrontEnd($responseData){
    echo '<div>';
	echo '<p>Zesa token purchase Sucessfull</p>';
    echo ''.$responseData;
	echo '</div>';
}






function deliver_mail1() {

	// if the submit button is clicked, send the email
	if ( isset( $_POST['cf-submitted'] ) ) {
        // Redirect('http://localhost:8000/?page_id=97', false);

        // header("Location:http://localhost:8000/?page_id=97");

		// sanitize form values
		$amount   = sanitize_text_field( $_POST["cf-amount"] );
		$meterNumber = sanitize_text_field( $_POST["cf-meterNumber"] );
        $phoneNumber = sanitize_text_field( $_POST["cf-phoneNumber"] );

		
        // get the url to post data to
        // TODO: change the url of the local server using ngrok
        $url = "https://3ed7-41-174-78-234.ngrok.io/zesa/buyToken";  // change this to the server deployed URL

        $body = array(

            
            'amount'    => $amount,
            'meterNumber'    => $meterNumber,
            'phoneNumber'    => $phoneNumber,
            
        );

        $args = array(
            'method'    => 'POST',
            'body'        => $body,
            'timeout'     => '180',
        );

        // make a post request to the provided url 

        $response = wp_remote_post( $url, $args );
        // print_r($response);
        // echo "<script>console.log('Debug Objects: " .  wp_remote_retrieve_body( $response )  . "' );</script>";


        if ( is_wp_error( $response ) ) {
            $error_message = $response->get_error_message();
            print_r($error_message);
            return "Something went wrong: $error_message";
        } else {

            $_body = wp_remote_retrieve_body( $response );
         

            if(json_decode(wp_remote_retrieve_body( $response ))->error === "err01"){

                // display to frontend
                // print_r(json_decode(wp_remote_retrieve_body( $response )));

                // displayToFrontEnd(json_decode(wp_remote_retrieve_body( $response )));
                alertError(json_decode(wp_remote_retrieve_body( $response ))->message);

                
            }
            
            if(json_decode(wp_remote_retrieve_body( $response ))->error === "09"){
                // header("Location: http://localhost:8000/?page_id=97");

                // display to frontend

                alertError(json_decode(wp_remote_retrieve_body( $response))->message );
            }

            if(json_decode(wp_remote_retrieve_body( $response ))->code === "00"){
                // header("Location: http://localhost:8000/?page_id=97");

                // display to frontend

                // displayToFrontEnd(json_decode(wp_remote_retrieve_body( $response )));
                alertSuccess(json_decode(wp_remote_retrieve_body( $response )));
            }
            

            

            // echo '<div>';
			// echo '<p>Airtime purchase Sucessfull check your balance.</p>';
			// echo '</div>';
            // echo "<script>console.log('Debug Objects: " . wp_remote_retrieve_body( $response ) . "' );</script>";

            // echo '<script> console.log($response) </script>'
        }

        // redirect to a success page after the post has been made displaying the data
	}
}

function cf_shortcode1() {
	ob_start();
	deliver_mail1();
    zesaResult();
	zesa_form();

	return ob_get_clean();
}

add_shortcode( 'zesa_tokens', 'cf_shortcode1' );

?>