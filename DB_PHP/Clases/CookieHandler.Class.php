<?php
class CookieHandler
{
    public function setCookies(string $name, string $value)
    {
        $arr_cookie_options = array (
            'expires' => 0, 
            'path' => '/'
        );
        
        setcookie($name, $value, 0);
    }
    public function getCookies(string $name)
    {
        if(isset($_COOKIE[$name])){
            return $_COOKIE[$name];
        }

    }

}
?>