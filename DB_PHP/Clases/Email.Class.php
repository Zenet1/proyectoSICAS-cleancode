<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'Env.Utileria.php';

class CorreoManejador
{
    private $mail;
    private $isArchivo;

    public function __construct()
    {
        $this->isArchivo = false;
        $this->mail = new PHPMailer(true);
        try {
            //$this->mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $this->mail->isSMTP();                                            //Send using SMTP
            $this->mail->Host = $_ENV['HOSTEMAIL'];                     //Set the SMTP server to send through
            $this->mail->SMTPAuth = true;                                   //Enable SMTP authentication
            $this->mail->Username = $_ENV['EMAILACCOUNT'];                     //SMTP username
            $this->mail->Password = $_ENV['EMAILACCOUNTPASSWORD'];                             //SMTP password
            $this->mail->SMTPSecure = "STARTTLS";            //Enable implicit TLS encryption
            $this->mail->Port = $_ENV['EMAILPORT'];                             //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
            $this->mail->CharSet = 'UTF-8';
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }

    public function EnviarCorreo(array $destinatarios, string $asunto, string $mensaje, $archivo = NULL)
    {
        try {
            $this->mail->setFrom($_ENV['EMAILACCOUNT'], 'SICAS');
            $this->mail->addAddress($_ENV['EMAILACCOUNT'], 'SICAS');

            foreach ($destinatarios as $correo => $nombre) {
                if ($correo !== "null") {
                    $this->mail->addCC($correo, $nombre);
                }
            }

            if ($this->isArchivo) {
                $this->mail->addAttachment($archivo);
            }

            $this->mail->isHTML(true);
            $this->mail->Subject = $asunto;
            $this->mail->Body = $mensaje;
            $this->mail->send();
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }

    public function setArchivo(bool $booleano)
    {
        $this->isArchivo = $booleano;
    }
}
