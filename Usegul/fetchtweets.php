<?php
session_start();
require_once("twitteroauth.php"); //Path to twitteroauth library
 
$twitteruser = "weihung";
$notweets = 30;
//$consumerkey = "12345";
//$consumersecret = "123456789";
//$accesstoken = "123456789";
//$accesstokensecret = "12345";


$consumerkey = 'goc6I8JfdXlGcuGQAE1Pw';
$consumersecret = 'Kpfr042oznk46OGZ6AxIodAjtpkJwSlkPu7JS4MxM0';
$accesstoken = '1732585237-6v8hdBiyhsxp55Wk1QeQajy9WMnPJxHW8MDtImu';
$accesstokensecret = 'sveUhTkpo9Gf4f5F3a6Ut79VCjeZ3DpXnOJwBa9jac';
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
 
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);
 
echo json_encode($tweets);
?>