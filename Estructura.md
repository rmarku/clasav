Estructura:
views/layout.ejs: 
 Header
  Inicializa el html, vincula librerias y ccs
  /js/dependencies(bootstrap): libreria de estilos
  /styles: ccs particulares a la pagina
 
 Body{ 
  Login
   #/crear-cuenta
    ng-controller: AlumnoCreateCtl
     /auth/local/register
      ng-model(agrega): alumno .nombre .apellido .e_mail .sexo .contrasena
   ng-model(filtra?): alumno.e_mail	alumno.contrasena
   propiedades utilizadas: user .nombre .apellido
   /logout

  Botonera
   Home
   Misiones: #/misiones
   Estadisticas
    Personaje
    Ranking
   Coliseo
   Juego: #/game
    data/sprites/characters/ym/face/
    images/iconos/
    ng-controller:InventarioContr
     ng-repeat: x in inventario
  
  ng-view
   por defecto: assets/templates/index.html
   
}
 jst: arcchivo que genera sails al compilar
 Vincula librerias js
  sails
  angular
   -resource
   -route
   -sails-bind
  jquery
  bootstrap
  melonjs
  debugPanel
  lodash:libreria js con funciones tales como busqueda burbuja, etc
  

/assets/templates/index.html: Cabecera del sitio, contiene el nombre y una breve introduccion

Funciones especiales:
Angular:
ng-model: relaciona un control(input,select,textarea) a una propiedad del scope
ng-view: servicio $route. incluye un template en el main que lo llama.
 $route: linkea urls a vistas y controladores (parciales)
ng-controller: adjunta una clase controlador, con atributos y funciones
ng-repeat: toma una lista y la va barriendo (se aplica en algun divisor (ul-li ej))
 $index: indice del elemento activo de la lista



