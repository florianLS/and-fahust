<?php 
saveBase64ImagePng($_POST["base64"],$_POST["folder"],$_POST["id"],$_POST["meta"],$_POST["allMeta"]);
function saveBase64ImagePng($base64Image, $imageDir,$id,$meta,$allMeta)
{
    //set name of the image file
    if (!file_exists(dirname(__FILE__)."/img/generated/".$id.".json")) {
        $fileName =  $id.'.png';

        $base64Image = trim($base64Image);
        $base64Image = str_replace('data:image/png;base64,', '', $base64Image);
        $base64Image = str_replace('data:image/jpg;base64,', '', $base64Image);
        $base64Image = str_replace('data:image/jpeg;base64,', '', $base64Image);
        $base64Image = str_replace('data:image/gif;base64,', '', $base64Image);
        $base64Image = str_replace(' ', '+', $base64Image);

        $imageData = base64_decode($base64Image);
        //Set image whole path here 
        $filePath = dirname(__FILE__)."/img/generated/"  . $fileName;
        file_put_contents($filePath, $imageData);
        
        $filePath = dirname(__FILE__)."/img/generated/_metadata.json";
        file_put_contents($filePath, ($allMeta));
    
        $filePath = dirname(__FILE__)."/img/generated/".$id.".json";
        file_put_contents($filePath, ($meta));
    }

   echo json_encode('test');
   die();

}
?>