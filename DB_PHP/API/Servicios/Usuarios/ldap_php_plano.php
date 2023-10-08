<?php
function oauth()
{

	//We store user name, id, and tokens in session variables
	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}

	$provider = new \League\OAuth2\Client\Provider\GenericProvider([
		'clientId' => env('OAUTH_APP_ID'),
		'clientSecret' => env('OAUTH_APP_PASSWORD'),
		'redirectUri' => env('OAUTH_REDIRECT_URI'),
		'urlAuthorize' => env('OAUTH_AUTHORITY') . env('OAUTH_AUTHORIZE_ENDPOINT'),
		'urlAccessToken' => env('OAUTH_AUTHORITY') . env('OAUTH_TOKEN_ENDPOINT'),
		'urlResourceOwnerDetails' => '',
		'scopes' => env('OAUTH_SCOPES')
	]);

	if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['code'])) {
		$authorizationUrl = $provider->getAuthorizationUrl();

		// The OAuth library automaticaly generates a state value that we can
		// validate later. We just save it for now.
		$_SESSION['state'] = $provider->getState();

		header('Location: ' . $authorizationUrl);

		//header('Location: http://localhost:8000/home');

		exit();
	} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['code'])) {
		// Validate the OAuth state parameter
		if (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['state'])) {
			unset($_SESSION['state']);
			exit('State value does not match the one initially sent');
		}

		// With the authorization code, we can retrieve access tokens and other data.
		try {
			// Get an access token using the authorization code grant
			$accessToken = $provider->getAccessToken('authorization_code', [
				'code' => $_GET['code']
			]);
			$_SESSION['access_token'] = $accessToken->getToken();
			//$token= $accessToken->getToken();



			// The id token is a JWT token that contains information about the user
			// It's a base64 coded string that has a header, payload and signature
			$idToken = $accessToken->getValues()['id_token'];
			//dd($idToken);

			$decodedAccessTokenPayload = base64_decode(
				explode('.', $idToken)[1]
			);
			//dd($decodedAccessTokenPayload);
			$jsonAccessTokenPayload = json_decode($decodedAccessTokenPayload, true);

			$miemail = $jsonAccessTokenPayload['preferred_username'];


			$_SESSION['preferred_username'] = $miemail;

			$pos = strpos($miemail, '@');
			$long = strlen($miemail);

			$dominiocorreo = substr($miemail, $pos + 1, $long - $pos - 1);

			$_SESSION['given_name'] = $jsonAccessTokenPayload['name'];

			$correoadmin = 'nombre_usuario@correo.uady.mx';



			$user = User::where('email', '=', $miemail)->first();
			if (count($user) <= 0) { // si es primera vez que ingresas al sistema, asigna roles
				$user = User::firstOrCreate(['email' => $miemail, 'password' => 'defaul', 'imagenurl' => '/mifoto/logouady.png']);

				if ((strcmp($correoadmin, $miemail) !== 0) && (count($user) <= 0)) {
					$user->assignRole(7);
				} else {
					$user->assignRole(3); //accede como administrador

				}
			}



			if (strcmp($dominiocorreo, 'correo.uady.mx') !== 0) {

				//echo "<script type='text/javascript'>alert('No es posible ingresar con ese correo');</script>";

				//auth()->logout();
				//return redirect()->to("https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=https://sub_dominio.uady.mx");
				return redirect()->to('/WAHJKaebncen456899267@18539mnQPFHSwe');
			} else {

				if (count($user) > 0)
					auth()->login($user);

				return redirect()->to('/home');
			}


			//header('Location: http://localhost:8000/home');
			exit();
		} catch (League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {
			echo 'Something went wrong, couldn\'t get tokens: ' . $e->getMessage();
		}
	}
}
