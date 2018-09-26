<?php
$newSub = $_POST['newSub']; //works
$newSubObj = json_decode($newSub);
//echo "endpoint \n";
//echo $newSubObj->endpoint;
//echo "\n public key \n";
//echo $newSubObj->keys->p256dh;
//echo "\n private key \n";
//echo $newSubObj->keys->auth;

$oldFile = "subscriptions.json";

try{

  $oldFileLoaded = file_get_contents($oldFile);
  $oldFileArray = json_decode($oldFileLoaded);
  array_push($oldFileArray,$newSubObj);
  $newFile = json_encode($oldFileArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
  if(file_put_contents($oldFile,$newFile)){
    echo "saved successfully";
  }else{
    echo "error";
  }

}catch(Exception $e){
  echo 'Caught exception: ',  $e->getMessage(), "\n";
}
/*
$oldFile = "subscriptions.json";

  try
  {
       $newSubStr = json_decode($newSub);

       /*
	   $newData = array(
          'sub'=>$newSubStr
       );
       

	   //Get data from existing json file
	   $jsondata_old = file_get_contents($oldFile);

	   // converts json data into array
	   $arr_data = json_decode($jsondata_old, true);

	   // Push user data to array
       array_push($arr_data,$newSubStr);

       //Convert updated array to JSON
       $jsondata_new = json_encode($arr_data,JSON_PRETTY_PRINT);
	   
	   //write json data into data.json file
	   if(file_put_contents($oldFile, $jsondata_new)) {
        //header("location: server.html");
        echo "Successfully subscribed to notifications";
	    }
	   else 
	        echo "error";
   }
   catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
   }
   */

?>