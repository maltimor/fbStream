# fbStream
Raspberry Pi 2B fb streamer

Este proyecto permite visualizar el contenido del frame buffer de la raspberry pi directamente en el navegador.

# Instalación

Primero hay que modificar el fichero /boot/config.txt para activar el frameBuffer.
framebuffer_width=320
framebuffer_height=240

Nota: si se cambia la resolución hay que modificar el código

Segundo: instalar node.js en la rpi

wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb

Tercero: instalar las dependencias npm

npm install

# Ejecución

Ejecutar en la raspberry:

node server.js

Desde un navegador y conociendo la IP de la raspberry abrir el puerto 3000

http://192.168.1.1:3000/


Debería aparecer la consola de la rpi.

