<?php 
$mili = microtime(true) * 10000;
$img = $_POST['img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
// $file = "s/" . $mili . '.png';
$src = imagecreatefromstring($data);
// imagefilledrectangle($src, 0, 0, $width, $height, $transparent);

// $success = file_put_contents($file, $data);
echo $mili;
?>