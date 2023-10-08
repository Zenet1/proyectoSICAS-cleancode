<?php

class ReservaQuery
{
    private string $INSERTReservaPer;
    private string $INSERTReservaPro;

    public function __construct()
    {
        $this->INSERTReservaPer = "INSERT INTO reservacionespersonal (FechaReserva,HoraActual,FechaActual,IDPersonal) SELECT :fchR,:hrA,:fchA,:idp FROM DUAL WHERE NOT EXISTS (SELECT IDPersonal,FechaReserva FROM reservacionespersonal WHERE IDPersonal=:idp AND FechaReserva=:fchR) LIMIT 1";

        $this->INSERTReservaPro = "INSERT INTO reservacionesacademicos (FechaReserva,HoraActual,FechaActual,IDPersonal) SELECT :fchR,:hrA,:fchA,:idp FROM DUAL WHERE NOT EXISTS (SELECT IDPersonal,FechaReserva FROM reservacionesacademicos WHERE IDPersonal=:idp AND FechaReserva=:fchR) LIMIT 1";
    }

    public function InsertarReservaPer(): string
    {
        return $this->INSERTReservaPer;
    }

    public function InsertarReservaPro(): string
    {
        return $this->INSERTReservaPro;
    }

    public function RecuperarID(string $tabla): string
    {
        return "SELECT IDReserva FROM $tabla WHERE IDPersonal=:idp AND FechaActual=:fchR";
    }
}
