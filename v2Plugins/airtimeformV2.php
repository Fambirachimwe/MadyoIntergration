<?php
/*
Plugin Name: Airtime Form V2
Plugin URI: http://example.com
Description: Multistep Form
Version: 1.0
Author: Tatenda Fambirachimwe
Author URI: https://tatenda-fambirachimwe.web.app/
*/



function Form(){
    // loader

    echo '
    <div class="loader">
        <div class="_loader_circle"></div>

        <h2 class="title">Processing transaction please wait ...</h2>
    </div>';

    // form
    echo '
    <div class="airtime_form">




        <div class="contents">

            <div class="fieldset">
                <div id="step1" class="form_container_1">
                    <h2 class="title">Mobile Recharge</h2>
                    <div class="operator_list_container">


                        <div class="op_item"><img src="https://madyointergration-production.up.railway.app/econet.jpg" alt="" srcset=""></div>
                        <div class="op_item"><img src="https://madyointergration-production.up.railway.app/netone.jpg" alt="" srcset=""></div>
                        <div class="op_item"><img src="https://madyointergration-production.up.railway.app/telecel.jpg" alt="" srcset=""></div>
                    </div>
                    <label for="select_oparator">Select Operator</label>
                    <form>
                        <select name="select_oparator" id="cf-type" value="">
                            <option value="econet">Econet</option>
                            <option value="netone">Netone</option>
                            <option value="telecel">Telecel</option>
                        </select>

                        <input required type="text" id="cf-targetMobile" placeholder="Mobile Number">

                        <input required type="text" id="cf-amount" placeholder="Amount">

                        <input required class="next" type="button" value="Next">
                    </form>
                </div>

            </div>




        </div>

        <div class="fieldset">
            <div id="step2" class="form_container_2">
                <h2 class="title">Confirm Your Payment</h2>
                <p class="_tagline">Check the details below before making payment</p>

                <div class="confirmBox">
                    <p>Youre about to topup <span id="confirm_mobileNumber"></span> with ZWL <span
                            id="confirm_amount"></span> </p>
                </div>


                <div class="payment_method">
                    <h2 class="title">Choose Payment Method</h2>

                    <button class="method">
                        <img src="https://madyointergration-production.up.railway.app/logo-1-ecocash.png" alt="" srcset="">
                        or
                        <img src="https://madyointergration-production.up.railway.app/logo-2-money-1.png" alt="" srcset="">
                    </button>

                    <div id="mobileMoneyContainer" class="mobileForm_container">
                        <p>This will use your Ecocash or OneMoney wallet to pay for this transaction</p>
                        <h3>Mobile Number</h3>

                        <input required type="text" id="cf-payingNumber" placeholder="Enter Mobile Number">
                        <button id="pay">Pay</button>
                        <button id="cancel">Cancel</button>
                    </div>
                </div>


            </div>

        </div>



    </div>
    ' ;
}


function formJs (){
    echo '

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script type="text/javascript">

        const paymentSelected = false;
        var step1 = document.getElementById("step1");
        var step2 = document.getElementById("step2");

        var mobileMoneyContainer = document.getElementById("mobileMoneyContainer");


        $(document).ajaxStart(function () {
            // Show image container
            $(".loader").show();
        });
        $(document).ajaxComplete(function () {
            // Hide image container
            $(".loader").hide();
        });

        $(document).ready(function () {
            var step = 1, current_step, next_step, steps;
            steps = $(".fieldset").length;


            let amount;
            let targetMobile;
            let payingNumber;


            $("#step2").hide();
            $("#mobileMoneyContainer").hide();
            // $()

            // console.log(steps)

            $(".next").click(function () {
                current_step = 1;
                $("#step1").hide();
                $("#step2").show();

                amount = $("#cf-amount").val();
                targetMobile = $("#cf-targetMobile").val();
                payingNumber = $("#cf-payingNumber").val();


                $("#confirm_mobileNumber").html(function () {
                    return targetMobile
                });
                $("#confirm_amount").html(function () {
                    return amount
                });
            });

            $(".method").click(function () {
                $("#mobileMoneyContainer").show();
            })

            $("#cancel").click(function () {
                $("#step1").show();

                $("#step2").hide();
                $("#mobileMoneyContainer").hide();
            });

            $("#pay").click(function (event) {
                //  do the payment logic here 
                // event.preventDefault();
                var type = $("#cf-type").val();
                var baseUrl = "https://madyointergration-production.up.railway.app/v2";
                let ajaxUrl;
                switch (type) {
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

                payingNumber = $("#cf-payingNumber").val();

                var data = {
                    amount, targetMobile, payingNumber
                }
                console.log(data)


                $.post(ajaxUrl, data, function (res) {
                    // $(".loader").css("display", "none");
                    console.log(res);

                    if (res.error === "err01") {
                        const message = res.message;

                        Swal.fire({
                            title: "Error!",
                            text: `Air time purchase failed`,
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    } else if (res.responseCode === "00") {
                        Swal.fire({
                            title: "Success!",
                            text: "Transaction processed successfully ",
                            icon: "success",
                            confirmButtonText: "OK"
                        });
                    }
                })

            })



        })

    </script>' ;
}


function formStyles(){ 
    echo '
        <style type="text/css">

        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");


        *{
            font-family: "Poppins", sans-serif !important;
        }


            .airtime_form {
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
                left: 50%;
                transform: translate(-50%);
            
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
            
            
            /* .operator_list_container > ul {
                list-style-type: none;
                display: flex;
                margin-left: 0;
                justify-content: space-around;
                flex-direction: column;
            
            } */
            
            .operator_list_container {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            
            form {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                margin: 10px 0px;
                
            }
            
            .next {
                color: #ffffff;
                background-color: #383838;
            }
            
            form > input, select{
                margin: 5px 0px;
                padding: 10px;
                border-radius: 3px;
                border: 1px solid #5C5C5C;
            }
            
            .form_container_2 {
                padding-bottom: 50px;
            }
            
            ._tagline {
                font-size: 14px;
                // font-weight: ;
                margin-top: 5px ;
                margin-bottom: 20px;
                font-family: "Poppins", sans-serif;
            }
            
            .confirmBox {
                padding: 3px 10px;
                background-color: #B5F2B4;
                border-radius: 3px;
                font-size: 14px;
                margin-bottom: 20px;
                margin-top: 20px;
            }
            
            
            .confirmBox > p >  span {
                font-weight: bolder;
            }
            
            .payment_method {
                display: flex;
                flex-direction: column;
            }
            
            .payment_method > .title {
                margin : 15px 0px;
            }
            
            .payment_method > button{
                padding: 15px;
                border: none;
                border-radius: 5px;
                background-color: #ffffff;
                box-shadow: 0px 4px 13px 2px rgba(0, 0, 0, 0.25);
            }
            
            
            .mobileForm_container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                /* align-items: center; */
                transition: 150ms ease-in;
            }
            
            .mobileForm_container > p {
            font-size: 14px;
            }
            
            .mobileForm_container > input, button  {
                padding: 10px;
                margin: 8px 0px;
                border-radius: 5px;
            }
            
            .mobileForm_container > button {
                text-align: center;
                border: none;
                font-weight: bold;
            }
            
            #pay {
                background-color: #4E8E4D;
                color: #ffffff;
                transition: 50ms ease-in;
            }
            
            #pay:hover {
                background-color: rgb(1, 85, 1) ;
                
            }
            
            #cancel {
                background-color: #818181;
                transition: 50ms ease-in;
            }
            
            #cancel:hover {
                background-color: #5e5e5e;
            } 
            
            .fieldset > .form_container_1 > label{
                font-weight: bold;
            
            }
            
            .op_item > img {
                height: 50px;
            }
            
            .method  {
                display: flex;
                justify-content: center;
                /* list-style-type: none; */
                margin: 0;
                margin-bottom: 10px;
                padding: 0;
                align-items: center;
                transition: 150ms ease-in;
            }
            .method:hover{
                /* background-color: rgb(219, 219, 219); */
                box-shadow: 0px 5px 13px 2px rgba(54, 54, 54, 0.418);
            }
            
            .method img {
                height: 25px;
                padding: 0 10px;
            }
            

        </style>
    ';
}


function cf_sCode() {
	ob_start();
	formStyles();
	Form();
    formJs();

	return ob_get_clean();
}



add_shortcode( 'Airtime_Form', 'cf_sCode' );




?>