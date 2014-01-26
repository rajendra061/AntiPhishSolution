 <form id="form1" name="form1" method="post" action="">
 <label>Please Enter Question Number:
 <input type="text" name="msg" id="msg" />
 </label>
 <label>and your name
 <input type="text" name="name" id="name" />
 </label>
 
 <input type="checkbox" name="display_users" value="10">Show Users Information<br>

 <p>
  <input type="submit" name="submit" id="submit" value="Submit" />
 </p>
 
 </form>

<?php 
if($_POST)
{
 $ques = $_POST['msg'];
 $username = $_POST['name'];
 $display_users = 0;
 if(isset($_POST['display_users']))
 {
	  $display_users = $_POST['display_users'];	 
	}

 $correct_users = getCorrectUsers($ques);
 $wrong_users =  getMistakeUsers($ques);
 $wrong_ans = getMistakes($username);
 $correct_ans = getCorrects($username);
 $displayed = getUsers();
?>

 <br />
 <?php 
 	if($ques != 0) 
	{	//checking no input in question
	echo 'The number of correct users for question no'.$ques. 'is '. count($correct_users); 
	  foreach ($correct_users as $ans => $value) :
	  {
			echo '<li><strong>' . $ans. '</strong>: ' .  $value . '</li>';
			
		}
	endforeach;
	
 ?>