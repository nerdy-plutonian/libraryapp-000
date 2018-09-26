<?php
    require_once('vendor/autoload.php');
    use Minishlink\WebPush\WebPush;
    use Minishlink\WebPush\Subscription;
    $publicKey = "BFZxKYazb3F1HdLLMoQiN91NjFPrQpb1efz_fnK2_aCj69HMRZk0o4L8FfTAs973Onv3_Ww8imakZF2ZEPyrRSo";
    $privateKey = "xNlAe81i0zkT5CJ0554egFp5pGrMPi2K6XNxZJfWZe4";


    $isbn = $_POST['isbn'];
    $title = $_POST['title'];
    $author = $_POST['author'];
    $description = $_POST['description'];

    $oldFile = "../student/books.json";
   $newFile = array(); // create empty array

  try
  {
	   //Get form data
	   $newData = array(
	      'isbn'=> $_POST['isbn'],
	      'title'=> $_POST['title'],
          'author'=>$_POST['author'],
          'description'=>$_POST['description']
	   );

	   //Get data from existing json file
	   $jsondata_old = file_get_contents($oldFile);

	   // converts json data into array
	   $arr_data = json_decode($jsondata_old, true);

	   // Push user data to array
	   array_push($arr_data,$newData);

       //Convert updated array to JSON
	   $jsondata_new = json_encode($arr_data, JSON_PRETTY_PRINT);
	   
	   //write json data into data.json file
	   if(file_put_contents($oldFile, $jsondata_new)) {
        //push();
        pushNotification();
	    }
	   else {
            echo "error";
       }
   }
   catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
   }

   function pushNotification(){
    $subFile = "subscriptions.json";
    $subFileLoaded = file_get_contents($subFile);
    $subArray = json_decode($subFileLoaded);
    foreach($subArray as $sub){
        $subscription = Subscription::create([
            'endpoint' => $sub->endpoint, // Firefox 43+,
            'publicKey' => $sub->keys->p256dh, // base 64 encoded, should be 88 chars
            'authToken' => $sub->keys->auth, // base 64 encoded, should be 24 chars
        ]);

        $auth = array(
            'VAPID' => array(
                'subject' => 'https://github.com/Minishlink/web-push-php-example/',
                'publicKey' => 'BFZxKYazb3F1HdLLMoQiN91NjFPrQpb1efz_fnK2_aCj69HMRZk0o4L8FfTAs973Onv3_Ww8imakZF2ZEPyrRSo',
                'privateKey' => 'xNlAe81i0zkT5CJ0554egFp5pGrMPi2K6XNxZJfWZe4', // in the real world, this would be in a secret file
            ),
        );

        $webPush = new WebPush($auth);
        $webPush->sendNotification(
            $subscription,
            $_POST['title']." added!",
            true
        );
        
    }
   }
?>