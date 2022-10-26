<?php
/*
Plugin Name: Buy Airtime Form
Plugin URI: http://example.com
Description: AirTime Form
Version: 1.0
Author: Tatenda Fambirachimwe
Author URI: https://tatenda-fambirachimwe.web.app/
*/

function html_form_code() {
	echo '<form  method="post">';

   

    // action="' . esc_url( $_SERVER['REQUEST_URI'] ) . '"

	echo '<p>';
	echo 'Type (required) <br/>';
	echo ' <select name="cf-type" value="' . ( isset( $_POST["cf-type"] ) ? esc_attr( $_POST["cf-type"] ) : '' ) . '">
    <option selected="selected" value="econet">Econet</option>
    <option value="netone">Netone</option>
    <option value="telecel">Telecel</option>
    </select><br /> ';
	echo '</p>';


	echo '<p>';
	echo 'Amount (required) <br/>';
	echo '<input type="text" name="cf-amount" pattern="[a-zA-Z0-9 ]+" value="' . ( isset( $_POST["cf-amount"] ) ? esc_attr( $_POST["cf-amount"] ) : '' ) . '" size="40" />';
	echo '</p>';


	echo '<p>';
	echo 'TargetMobile (required) <br/>';
	echo '<input type="text" name="cf-targetMobile" pattern="[a-zA-Z0-9 ]+" value="' . ( isset( $_POST["cf-targetMobile"] ) ? esc_attr( $_POST["cf-targetMobile"] ) : '' ) . '" size="40" />';
	echo '</p>';


	echo '<p>';
	echo 'PayingNumber (required) <br/>';
	echo '<input type="text" name="cf-payingNumber" pattern="[a-zA-Z0-9 ]+" value="' . ( isset( $_POST["cf-payingNumber"] ) ? esc_attr( $_POST["cf-payingNumber"] ) : '' ) . '" size="40" />';
	echo '</p>';


	echo '<p><input type="submit" name="cf-submitted" value="Pay"></p>';


	echo '</form>';
}


function function_alert($message) {
      
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


function alertSuccess($message) {
      
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

function deliver_mail() {

	// if the submit button is clicked, send the email
	if ( isset( $_POST['cf-submitted'] ) ) {

		// sanitize form values
		$type    = sanitize_text_field( $_POST["cf-type"] );
		$amount   = sanitize_text_field( $_POST["cf-amount"] );
		$targetMobile = sanitize_text_field( $_POST["cf-targetMobile"] );
        $payingNumber = sanitize_text_field( $_POST["cf-payingNumber"] );

        $end = '';

        // print_r($type);

        switch ($type) {
            case 'econet':
                # code...
                $end = '/econet/buy';
                break;

            case 'netone':
                # code...
                $end = '/netone/buy';
                break;

            case 'telecel':
                # code...
                $end = '/telecel/buy';
                break;
            
            default:
                # code...
                break;
        }
		
        // get the url to post data to
        $url = "https://3ed7-41-174-78-234.ngrok.io/airtime" .$end;  // change this to the server deployed URL

        $body = array(

            'type'  => $type,
            'amount'    => $amount,
            'targetMobile'    => $targetMobile,
            'payingNumber'    => $payingNumber,
            
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
            // print_r(json_decode(wp_remote_retrieve_body( $response ))->error);

            if(json_decode(wp_remote_retrieve_body( $response ))->error === "err01"){
                function_alert(json_decode(wp_remote_retrieve_body( $response ))->message);
            } else {
                
                alertSuccess(json_decode(wp_remote_retrieve_body( $response ))->narrative );
               
            }
            
        }

        // redirect to a success page after the post has been made displaying the data
	}
}

function cf_shortcode() {
	ob_start();
	deliver_mail();
	html_form_code();

	return ob_get_clean();
}

add_shortcode( 'sitepoint_contact_form', 'cf_shortcode' );

?>