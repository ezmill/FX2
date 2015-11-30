<?php 

$img = $_POST['img'];
$frame = $_POST['frame'];
$folder = $_POST['folder'];
$width = $_POST['imgWidth'];
$height = $_POST['imgHeight'];

$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);

$src = imagecreatefromstring($data);
$newImg = imagecreatetruecolor($width, $height);
imagealphablending($newImg, false);
imagesavealpha($newImg,true);
$transparent = imagecolorallocatealpha($newImg, 0, 0, 0, 127);
imagefilledrectangle($newImg, 0, 0, $width, $height, $transparent);
imagecopyresampled($newImg, $src, 0, 0, 0, 0, $width, $height, $width, $height);

$alpha = imagecolorallocatealpha($newImg, 0, 0, 0, 127);
imagecolortransparent($newImg, $alpha);

if (!file_exists('gifTemp/' . $folder . '/')) {
    mkdir('gifTemp/' . $folder . '/', 0777, true);
}

$file = "gifTemp/" . $folder . "/test.jpg";

imagejpeg($newImg, $file);

imagedestroy($src);
imagedestroy($newImg);

?>