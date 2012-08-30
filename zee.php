<?php
/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
/* You must fill in the "Service Logins
/* values below for the example to work	
/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

// Config

$default = 15.00;

$size = 1; // Normal
$weight = 5; // 5 pounds...default
$zip_code = 90001;

if($_REQUEST['w'] != ""){
	$weight = $_REQUEST['w'];
}
if($_REQUEST['s'] != ""){
	if($_REQUEST['s'] >= 0 || $_REQUEST['s'] <= 3){
		$size = $_REQUEST['s'];
	}
}
if($_REQUEST['z'] != ""){
	$zip_code = $_REQUEST['z'];
}
$box_l = array('8','12','16','24');
$box_w = array('8','12','16','24');
$box_h = array('4','8','12','16');

$fuel = 0.00;
$box_r = 0.00;

$config = array(
	// Weight
	'weight' => $weight, // Default = 1
	'weight_units' => 'lb', // lb (default), oz, gram, kg
	// Size
	'size_length' => $box_l[$size], // Default = 8
	'size_width' => $box_w[$size], // Default = 4
	'size_height' => $box_h[$size], // Default = 2
	'size_units' => 'in', // in (default), feet, cm
	// From
	'from_zip' => 43072, 
	'from_state' => "OH", // Only Required for FedEx
	'from_country' => "US",
	// To
	'to_zip' => $zip_code,
	'to_country' => "US",
	
	// Service Logins
	//'ups_access' => '0C2D05F55AF310D0', // UPS Access License Key
	//'ups_user' => 'dwstudios', // UPS Username  
	//'ups_pass' => 'dwstudios', // UPS Password  
	//'ups_account' => '81476R', // UPS Account Number
	'ups_access' => '5C9D51DED071B5A8',
	'ups_user' => 'izerop', // UPS Username  
	'ups_pass' => 'teleFRAG12', // UPS Password  
	'ups_account' => '736V2V', // UPS Account Number
	
	'usps_user' => '229DARKW7858', // USPS User Name
	'fedex_account' => '510087020', // FedEX Account Number
	'fedex_meter' => '100005263' // FedEx Meter Number 
);

// Shipping Calculator Class
require_once "ShippingCalculator.php";
// Create Class (with config array)
$ship = new ShippingCalculator($config);
// Get Rate
$rates = $ship->calculate('ups','03'); // UPS Ground Shipping

// Print Array of Rates

//print_r($rates);

$price = $rates["ups"]["03"];
if($price == ""){
	$price = $default;
}
$total = $price + $fuel + ($box_r * $size);

print $total;

?>