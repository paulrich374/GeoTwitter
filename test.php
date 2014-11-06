
<?php
require('twitteroauth.php'); // path to twitteroauth library


$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];

//echo $lat."tttttt".$lng;

$consumerkey = 'goc6I8JfdXlGcuGQAE1Pw';
$consumersecret = 'Kpfr042oznk46OGZ6AxIodAjtpkJwSlkPu7JS4MxM0';
$accesstoken = '1732585237-6v8hdBiyhsxp55Wk1QeQajy9WMnPJxHW8MDtImu';
$accesstokensecret = 'sveUhTkpo9Gf4f5F3a6Ut79VCjeZ3DpXnOJwBa9jac';



$twitter = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
//$tweets = $twitter->get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=weihung&count=10');
//$tweets = $twitter->get('https://api.twitter.com/1.1/geo/search.json?lat='.$lat.'&long='.$lng.'&accuracy=100ft');
$tweets = $twitter->get('https://api.twitter.com/1.1/search/tweets.json?geocode='.$lat.','.$lng.',1mi');



//print_r($tweets);
echo json_encode($tweets);

//file_put_contents('test.txt',$lat."tttttt".$lng);
?>