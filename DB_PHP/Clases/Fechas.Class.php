<?php
class Fechas
{
    private static $instancia;
    private string $FechaSiguiente;
    private int $intervalo;
    private string $diaSiguiente;

    public static function ObtenerInstancia(): Fechas
    {
        if (self::$instancia === null) {
            self::$instancia = new self();
        }
        return self::$instancia;
    }

    private function __construct()
    {
        date_default_timezone_set("America/Mexico_City");
    }

    private function CalcularDiaSiguiente(): void
    {
        $dia_siguiente_nombre = null;

        switch (date("l")) {
            case "Monday":
                $dia_siguiente_nombre = "Martes";
                break;
            case "Tuesday":
                $dia_siguiente_nombre = "Miercoles";
                break;
            case "Wednesday":
                $dia_siguiente_nombre = "Jueves";
                break;
            case "Thursday":
                $dia_siguiente_nombre = "Viernes";
                break;
            case "Friday":
                $dia_siguiente_nombre = "Sabado";
                break;
            case "Saturday":
                $dia_siguiente_nombre = "Lunes";
                break;
            case "Sunday":
                $dia_siguiente_nombre = "Lunes";
                break;
        }
        $this->diaSiguiente = $dia_siguiente_nombre;
    }

    private function CalcularIntervalo()
    {
        $desplasamiento = null;

        switch (date("l")) {
            case "Saturday":
                $desplasamiento = 2;
                break;
            default:
                $desplasamiento = 1;
                break;
        }

        $this->intervalo = $desplasamiento;
    }

    private function CalcularFechaSiguiente(string $Formato)
    {
        $this->CalcularIntervalo();
        $this->FechaSiguiente = date($Formato, strtotime('+' . $this->intervalo . ' day'));
    }

    public function DiaSig()
    {
        $this->CalcularDiaSiguiente();
        return $this->diaSiguiente;
    }

    public function FechaSig(string $Formato = "Y-m-d")
    {
        $this->CalcularFechaSiguiente($Formato);
        return $this->FechaSiguiente;
    }

    public function HrAct(string $Formato = "H:i:s")
    {
        return date($Formato);
    }

    public function FechaAct(string $Formato = "Y-m-d")
    {
        return date($Formato);
    }
}
