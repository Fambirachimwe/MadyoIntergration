<?php
/*
Plugin Name: Nyaradzo Form 
Plugin URI: http://example.com
Description: Multistep Form
Version: 1.0
Author: Tatenda Fambirachimwe
Author URI: https://tatenda-fambirachimwe.web.app/
*/

function nyaradzoForm(){
    echo '
    <div class="loader">
        <div class="_loader_circle"></div>
        <h2 class="title">Processing please wait ...</h2>
    </div>
    ';

    echo '

    <div class="nyaradzo_form">
        <div class="contents">
            <div class="fieldset">
                <div class="nstep1">

                    <div class="title_container">
                        <h2 class="title">Pay Nyaradzo policy</h2>
                        <img src="https://madyointergration-production.up.railway.app/nyaradzo.jpg" alt="" srcset="">
                    </div>

                    <form>


                        <input required type="text" id="n-policyNumber" placeholder="Policy Number">

                        <input required type="number" id="n-months" placeholder="Number of Months to pay">

                        <input required type="text" id="n-mobileNumber" placeholder="Mobile Number">

                        <input required id="next_1" class="next" type="button" value="Next">
                    </form>


                </div>
            </div>

            <div class="fieldset">
                <div class="nstep2">

                    <h2 class="title">Verify Details</h2>
                    <p>Check the details below before making payment</p>

                    <div class="details_container">
                        <div class="_row">
                            <p>Customer details</p>
                            <p id="pdetails" class="_dt"></p>
                        </div>
                        <div class="_row">
                            <p>Policy Number</p>
                            <p id="policyNumber" class="_dt"></p>
                        </div>
                        <div class="_row">
                            <p>Monthly premium</p>
                            <p id="pamount" class="_dt"></p>
                        </div>

                        <div class="_row">
                            <p>Balance</p>
                            <p id="pbalance" class="_dt"></p>
                        </div>
                    </div>


                    <div class="btn_container">
                        <button id="next_2" class="next">Next</button>
                        <button id="back_2" class="back">Back</button>
                    </div>


                </div>
            </div>

            <div class="fieldset">
                <div class="zesa_step3">
                    <h2 class="title">Confirm Your Payment</h2>
                    <p>Check the details below befor making payment</p>

                    <div class="zesa_confirmBox">
                        <p>
                            You are about to pay $<span id="c_amount"></span> to Nyaradzo for policy number <span
                                id="c_policyNumber"></span>. This amount is Balance remaining + monthly premium
                        </p>

                    </div>

                    <h2 class="title">Choose payment method</h2>

                    <button class="zesa_method">
                        <img src="https://madyointergration-production.up.railway.app/logo-1-ecocash.png" alt="" srcset="">
                        or
                        <img src="https://madyointergration-production.up.railway.app/logo-2-money-1.png" alt="" srcset="">
                    </button>

                    <div id="mobileMoneyContainer" class="mobileForm_container">
                        <p>This will use your Ecocash or OneMoney wallet to pay for this transaction</p>
                        <h3>Mobile Number</h3>

                        <input required type="text" id="nyaradzo-payingNumber" placeholder="Enter Mobile Number">
                        <button id="npay">Pay</button>
                        <button id="ncancel">Cancel</button>
                    </div>


                </div>
            </div>
        </div>
    </div>

    ';
}


function nyaradzoFormJs(){
    echo '
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

    <script>

        $(document).ajaxStart(function () {
            // Show image container
            $(".loader").show();
        });
        $(document).ajaxComplete(function () {
            // Hide image container
            $(".loader").hide();
        });

        $(document).ajaxError(function () {
            // Show image container
            Swal.fire({
                title: "Error!",
                text: `Error While processing data. Check network connectivity`,
                icon: "error",
                confirmButtonText: "OK"
            });
        });

        $(document).ready(function () {

            $(".nstep2").hide();
            $(".zesa_step3").hide();
            $("#mobileMoneyContainer").hide();
            let policyNumber;
            let monthsToPay;
            let mobileNumber;
            let _policyType = 1;

            let payingNumber;

            function getPolicyHolder() {
                var policyUrl = "https://madyointergration-production.up.railway.app/lifeAssurrence/getCustomer";

                var pdata = {
                    mobileNumber,
                    utilityAccount: policyNumber,
                    policyType: 1
                }

                console.log(pdata);

                $.post(policyUrl, pdata, function (res) {

                    console.log(res);
                    if (res.responseCode === "00") {
                        $("#pdetails").html(function () {
                            return res.narrative.split(".")[0]
                        });

                        $("#policyNumber").html(function () {
                            return res.utilityAccount
                        });

                        $("#pamount").html(function () {
                            return parseFloat(res.amount) ;
                        });

                        $("#pbalance").html(function () {
                            return res.customerBalance;
                        });

                        $("#c_amount").html(function () {
                            return parseFloat(res.amount) * monthsToPay + parseFloat(res.customerBalance)
                        });

                        $("#c_policyNumber").html(function () {
                            return res.utilityAccount
                        })

                    } else {

                        $(".next").hide();
                        Swal.fire({
                            title: "Error!",
                            text: `Detail Verification Failed`,
                            icon: "error",
                            confirmButtonText: "OK"
                        });

                    }
                })
            }

            // validate input here 
            $(".next").hide();

            function validateInput(){
                let _policyNumber = $("#n-policyNumber").val();
                let _monthsToPay = $("#n-months").val();
                let _mobileNumber = $("#n-mobileNumber").val();
                
                if(_policyNumber.length == "" || _monthsToPay.length == "" || _mobileNumber.length == ""){
                    $(".next").hide()
                    return false;
                } else {
                    $(".next").show();
                }
            }

            $("#n-policyNumber").keyup(function(){
                validateInput();
            });
            $("#n-months").keyup(function(){
                validateInput();
            });
            $("#n-mobileNumber").keyup(function(){
                validateInput();
            });

            // validate payingNumber
            
            $("#npay").hide();
            function validatePayingNumber(){
                let __payingNumber = $("#nyaradzo-payingNumber").val();
                if(__payingNumber.length == "" || __payingNumber.length < 10){
                    $("#npay").hide()
                    return false;
                } else {
                    
                    $("#npay").show();
                }
            }

            $("#nyaradzo-payingNumber").keyup(function(){
                validatePayingNumber();
            });


            $("#next_1").click(function () {
                $(".nstep1").hide();
                $(".nstep2").show();

                // get customer
                // set values
                policyNumber = $("#n-policyNumber").val();
                monthsToPay = $("#n-months").val();
                mobileNumber = $("#n-mobileNumber").val();
                

                // verify the customer details here
                getPolicyHolder();




            })

            $("#back_2").click(function () {
                $(".nstep2").hide();
                $(".nstep1").show();
            })

            $("#next_2").click(function () {
                $(".nstep1").hide();
                $(".nstep2").hide()
                $(".zesa_step3").show();
            });

            $(".zesa_method").click(function () {
                $("#mobileMoneyContainer").show();
            });

            $("#ncancel").click(function () {
                $(".nstep1").show();
                $(".nstep2").hide();
                $(".zesa_step3").hide();
                $("#mobileMoneyContainer").hide();
            });

            $("#npay").click(function () {
                const nyaradzoUrl = "https://madyointergration-production.up.railway.app/lifeAssurrence/pay";
                payingNumber = $("#nyaradzo-payingNumber").val();

                var data = {
                    mobileNumber: mobileNumber,
                    utilityAccount: policyNumber,
                    numberOfMonths: monthsToPay,
                    policyType: 1,
                    payingNumber: payingNumber
                }

                console.log(data)

               


                $.post(nyaradzoUrl, data, function (res) {
                    if (res.error === "err01") {
                        const message = res.message;

                        Swal.fire({
                            title: "Error!",
                            text: `Mobile confirmation failed`,
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                    else if (res.responseCode === "00") {
                        Swal.fire({
                            title: "Success!",
                            text: "Transaction processed successfully ",
                            icon: "success",
                            confirmButtonText: "OK"
                        });
                    }

                    else if (res.responseCode === "09") {
                        Swal.fire({
                            title: "Success!",
                            text: "Transaction in progress",
                            icon: "info",
                            confirmButtonText: "OK"
                        });
                    }
                })
            })




        })



    </script>
    ';
}


function nyaradzoFormStyles (){

    echo '
    <style type="text/css">

    .zesa_form {
        position: relative;
        width: 350px;
        margin: auto auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0px 4px 13px 2px rgba(0, 0, 0, 0.25);
        /* background-color: red; */
    
    }
    
    .loader {
        display: none;
        position: absolute;
        width: 100vw;
        height: 100%;
        left: 50%;
        transform: translate(-50%);
        background-color: rgba(255, 255, 255, 0.952);
        z-index: 100;
    
    }
    
    .loader > h2 {
        text-align: center;
    }
    
    ._loader_circle {
        /* display: none; */
        /* position: relative; */
        /* top: 10%; */
        /* left: 50%; */
        /* transform: translate(-50%, -10%); */
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #43b02a; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        z-index: 100;
        margin: 50px auto ;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    h2 {
        font-size: 20px;
        margin: 5px 0px;
    }
    
    .title_container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    
    }
    
    .title_container > img{
        width: 60px;
    }
    
    form {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin: 10px 0px;
        
    }
    
    form > input{
        margin: 5px 0px;
        padding: 10px;
        border-radius: 3px;
        border: 1px solid #5C5C5C;
    }
    
    .next {
        color: #ffffff;
        background-color: #383838;
        margin-bottom: 30px;
    }
    
    /* .zesa_step2 {
     display: flex;
     flex-direction: column;   
    } */
    
    .zesa_step2 > .title {
        line-height: 5px;
    }
    
    .zesa_step3 > .title {
        line-height: 5px;
    }
    .zesa_step3 > .title > p {
        font-size: 10px;
    }
    
    
    .zesa_step2 > .title > p {
        font-size: 10px;
    }
    
    .details_container {
        display: flex;
        flex-direction: column;
    
        background-color: #B5F2B4;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 30px;
    }
    
    .details_container > ._row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        /* justify-content: space-between; */
        align-items: center;
    }
    
    .details_container > ._row > p{
        font-size: 14px;
    }
    
    .details_container > ._row > ._dt {
        /* span this class to fill up the container */
        grid-column: 2 / 4 ;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
    }
    
    
    .btn_container{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        margin-bottom: 30px;
    }
    
    .next{
        background-color: #4E8E4D;
    }
    
    .back{
        background-color: #D9D9D9;
    
    }
    
    .next , .back {
        padding: 10px;
        margin: 8px 0;
        border-radius: 5px;
        border: none;
        font-weight: bold;
    }
    
    
    .zesa_confirmBox {
        background-color: #B5F2B4;
        padding: 5px;
        font-size: 14px;
        border-radius: 5px;
        margin-bottom: 40px;
    }
    
    .zesa_step3 > .title {
        margin-bottom: 30px;
    }
    
    .zesa_step3 {
        display: flex;
        flex-direction: column;
    }
    
    .zesa_method  {
        display: flex;
        justify-content: center;
        /* list-style-type: none; */
        margin: 0;
        margin-bottom: 10px;
        padding: 10px;
        align-items: center;
        transition: 150ms ease-in;
        border-radius: 5px;
        border: none;
        background-color: #ffffff;
        box-shadow: 0px 5px 10px 2px rgba(201, 176, 176, 0.418);
    }
    .zesa_method:hover{
        /* background-color: rgb(219, 219, 219); */
        box-shadow: 0px 5px 6px 2px rgba(105, 105, 105, 0.603);
    }
    
    .zesa_method img {
        width: 100px;
        padding: 0 10px;
    }
    
    
    .mobileForm_container {
        display: flex;
        flex-direction: column;
    
    }
    .mobileForm_container p {
        font-size: 14px;
        margin-top: 30px;
    }
    
    .mobileForm_container input, button {
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
        border: 1px solid #000000;
    }
    
    .mobileForm_container button{
        border: none;
    } 
    
    #pay , #npay {
        background-color: #4E8E4D;
    }
    
    #cancel , #ncancel {
        background-color: #D9D9D9;
    }
    
    .nyaradzo_form {
        position: relative;
        width: 350px;
        margin: auto auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0px 4px 13px 2px rgba(0, 0, 0, 0.25);
        /* background-color: red; */
    }




    </style>
    ';

   
}


function nyaradzo_sCode() {
	ob_start();
	nyaradzoFormStyles();
	nyaradzoForm();
    nyaradzoFormJs();

	return ob_get_clean();
}


add_shortcode( 'Nyaradzo_Form', 'nyaradzo_sCode' );


?>