<?php

class Roles
{
    private Query $objQuery;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
    }

    public function RecuperarRoles(){
        $sql_SELECTRoles = "SELECT IDRol,Rol FROM roles WHERE IDRol > 1 AND IDRol < 4";
        $roles = $this->objQuery->ejecutarConsulta($sql_SELECTRoles, array());
        echo json_encode($roles);
    }
}
