<?php
$PATH_STATE="../state/state.json";
$PATH_GAMES="../games/";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // collect value of input field
    $json = $_POST['json'];
    if (empty($json)) {
        echo "EMPTY_STRING";
    } else {
        
        $filename='games_'.date('Y-m-d_H-i-s').'.json';
        file_put_contents($PATH_GAMES.$filename, $json);
        
        $statefile=json_decode(file_get_contents($PATH_STATE));
        $statefile->activeSaveFile=$filename;
        file_put_contents($PATH_STATE, json_encode($statefile));
        echo $json;
    }
}
?>