<?php
/*
Plugin Name: ZesaToken Form V2
Plugin URI: http://example.com
Description: Multistep Form
Version: 1.0
Author: Tatenda Fambirachimwe
Author URI: https://tatenda-fambirachimwe.web.app/
*/


function ZesaForm (){
    echo '
    <div class="loader">
        <div class="_loader_circle"></div>
        <h2 class="title">Processing transaction please wait ...</h2>
    </div>
    ';


    echo '

    <div class="zesa_form">
        <div class="contents">
            <div class="fieldset">
                <div class="zesa_step1">

                    <div class="title_container">
                        <h2 class="title">Purchase ZEDTC tokens</h2>
                        <img src="./images/payment-2.png" alt="" srcset="">
                    </div>

                    <form>


                        <input required type="text" id="zesa-meterNumber" placeholder="Meter Number">

                        <input required type="text" id="zesa-amount" placeholder="Amount">

                        <input required type="text" id="zesa-mobileNumber" placeholder="Mobile Number">

                        <input required id="next_1" class="next" type="button" value="Next">
                    </form>




                </div>
            </div>

            <div class="fieldset">
                <div class="zesa_step2">
                    <h2 class="title">Verify Details</h2>
                    <p>Check the details below befor making payment</p>

                    <div class="details_container">
                        <div class="_row">
                            <p>Customer details</p>
                            <p id="details" class="_dt"></p>
                        </div>
                        <div class="_row">
                            <p>Meter Number</p>
                            <p id="meterNumber" class="_dt"></p>
                        </div>
                        <div class="_row">
                            <p>Amount</p>
                            <p id="amount" class="_dt"></p>
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
                            You are about to purchase zetdc token worth $<span id="zesa_confirm_amount"></span>.00
                        </p>

                    </div>

                    <h2 class="title">Choose payment method</h2>

                    <button class="zesa_method">
                        <img src="./images/logo-1-ecocash.png" alt="" srcset="">
                        or
                        <img src="./images/logo-2-money-1.png" alt="" srcset="">
                    </button>

                    <div id="mobileMoneyContainer" class="mobileForm_container">
                        <p>This will use your Ecocash or OneMoney wallet to pay for this transaction</p>
                        <h3>Mobile Number</h3>

                        <input required type="text" id="zesa-payingNumber" placeholder="Enter Mobile Number">
                        <button id="pay">Pay</button>
                        <button id="cancel">Cancel</button>
                    </div>


                </div>
            </div>

        </div>
    </div>

    ' ;
}

function ZesFormJs(){
    echo '

    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>

        $(document).ajaxStart(function () {
            // Show image container
            $(".loader").show();
        });
        $(document).ajaxComplete(function () {
            // Hide image container
            $(".loader").hide();
        });

        $(document).ready(function () {

            let meterNumber;
            let mobileNumber;
            let amount;
            let payingNumber;

            function getCustomer() {
                var getCustomerUrl = "https://madyointergration-production.up.railway.app/zesa/getCustomer";

                var _data = {
                    meterNumber: meterNumber
                };

                $.post(getCustomerUrl, _data, function (res) {
                    // console.log(res);

                    if (res.responseCode === "00") {

                        $("#details").html(function () {
                            return res.customerData;
                        });

                        $("#amount").html(function () {
                            return $("#zesa-amount").val();
                        });



                        $("#meterNumber").html(function () {
                            return $("#zesa-meterNumber").val();
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


            }

            $(".zesa_step2").hide();
            $(".zesa_step3").hide();
            $(".mobileForm_container").hide();
            // $(".zesa_step2").hide();

            $("#next_1").click(function () {
                $(".zesa_step1").hide();
                $(".zesa_step2").show();
                meterNumber = $("#zesa-meterNumber").val();
                amount = $("#zesa-amount").val();
                mobileNumber = $("#zesa-mobileNumber").val();
                $("#zesa_confirm_amount").html(function () {
                    return amount
                })
                getCustomer();


            })

            $("#next_2").click(function () {
                $(".zesa_step2").hide();
                $(".zesa_step3").show();
            });

            $("#back_2").click(function () {
                $(".zesa_step1").show();
                $(".zesa_step2").hide();
            });

            $(".zesa_method").click(function () {
                $(".mobileForm_container").show();
            });

            $("#cancel").click(function () {
                $(".zesa_step1").show();
                $(".zesa_step2").hide();
                $(".zesa_step3").hide();
                $(".mobileForm_container").hide();
            })

            $("#pay").click(function (event) {

                var url = "https://madyointergration-production.up.railway.app/v2/zesa/buyToken";

                payingNumber = $("#zesa-payingNumber").val();
                var data = {
                    amount, targetMobile: mobileNumber,
                    payingNumber,
                    meterNumber
                }

                $.post(url, data, function (res) {
                    // $(".loader").css("display", "none");
                    // console.log(res);

                    if (res.error === "err01") {
                        const message = res.message;

                        Swal.fire({
                            title: "Error!",
                            text: `Token Purchase Failed`,
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

                    // display the data to the frontend
                })

            })


            function getCustomer() {
                var getCustomerUrl = "https://madyointergration-production.up.railway.app/zesa/getCustomer";

                var _data = {
                    meterNumber: meterNumber
                };

                $.post(getCustomerUrl, _data, function (res) {
                    // console.log(res);

                    if (res.responseCode === "00") {

                        $("#details").html(function () {
                            return res.customerData;
                        });

                        $("#amount").html(function () {
                            return $("#zesa-amount").val();
                        });

                        $("#meterNumber").html(function () {
                            return $("#zesa-meterNumber").val();
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


            }


        })

    </script>

    ';
}


function ZesaStyles(){
    echo '
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
        height: 25px;
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
    
    #pay {
        background-color: #4E8E4D;
    }
    
    #cancel {
        background-color: #D9D9D9;
    }
    ';
}


function Zesacf_sCodeV2() {
	ob_start();
	ZesaStyles();
	ZesaForm();
    ZesFormJs();
	return ob_get_clean();
}

add_shortcode( 'Zesa_Form', 'Zesacf_sCodeV2' );


?>