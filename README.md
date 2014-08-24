Herramientas
============

### Servidor
* Node.js
* Express
* Sails
* Melon.js
* MySQL/MongoDB

### Cliente
* Angular.js
* Easel.js
* Melon.js

## Desarrollo
* Tiled
* Eclipse o WebStorm


Base
====

servidor-cliente
----------------

* Foro ingame (recompensas por like)
* Quest aleatorios a intervalos de tiempo que permitan ganar más items,recursos


Interface Web
=============

HTML
----

* login
* vista de items
* guia de mision
* listado de amigos
* vista del personaje
* chat
* mini-mapa
* coliseo (pregunta2)
* hp
* mp 
* Dialogos de Quest
* logros
* talentos


### Ver si en canvas o HTML: Minijuegos,

#### Juego Canvas:

* Personaje
  * Definir atributos{hombre o mujer}
  * Energía
    * cada vez que haces un ejercicio se pierde un poco de energia,
    * Cada dia se recupera el 100% de la energia,
    * Con monedas se puede comprar energia de intentos fallidos,
  * Talentos{se alcanza con cada ejercicio superado},
  * Vestimenta
    * se compra con monedas,
    * cada vestimenta tiene atributos que se traspasan al personaje,
    * No se pueden utilizar todos simultaneamente,
  * Monedas,
  * Nivel {para cambiar de nivel, ejercicios resueltos y N talentos nuevos},


Quest
=====

* Texto de introducción,
* NPC,
* item de quest,
* Texto de espera,
* minijuego,
* Tiempo,
* Texto de conclucion,
* NPC,
* Reconpensa,
* oro,
* experiencia,
* talento,
* Activar otros quest,


RPG
===

* Tiled {mapa genérico},
* Comunicación con NPC’s {interactuar con el QuestGiver},
* Entrar a casas o zonas,
* Interacción con el terreno
  * cavar,
  * examinar,
  * mover obstaculo,
  * usar objeto con,
  * deslizarse(patinar),
  * Juntar objetos,


Multiplayer
===========

* hablar,
* comparar {equipos, logros},
* intercambiar items,
* coliseo(preguntados),
* Visualizacion de otro Personaje,
* Niveles y experiencia,
* Arena
  * Posición,
  * Victorias,
  * Muertes,
  * partida{
    * va incrementando su precio de ingreso,
    * se reinicia al dia siguiente,
    1 Ganador
      * gana precio promedio de entrada // (cantidad monedas) actual y siguiente (pago 10, la siguiente es 20, el promedio es 15)
      * Suma estadisticas
    2 Perdedor {suma muertes}


Minijuegos
==========

* Momia,
* Rompecabezas,
* Cartas, //(hearthstone, might and magic)
* multiples choice,
* Completar,
* ahorcado,
* sopa de letras,


Extras
=====

* Filtros por estaciones y horas del dia (activación)



