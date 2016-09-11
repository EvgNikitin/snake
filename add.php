<?php
$name=$_GET["name"];
$score=$_GET["score"];
$f=fopen('results.txt','a+b');
fwrite($f,$name.'__'.$score."\r\n");
fclose($f);
$scores=array();
$strings=file('results.txt');
for($i=0;$i<count($strings);$i++){
	$string=explode('__',$strings[$i]);
	$arr['name']=$string[0];
	$arr['score']=$string[1];
	$scores[]=$arr;
}
echo json_encode($scores);
?>