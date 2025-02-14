## Cliente Gateway
El gateway es el punto de comunicacion entre nuestros clientes y nuestros servicios.
Es el encargado de reciobir las petiociones, enviarlas a los servicios correspondientes y devolver la respuesta al cliente.

## DEV

1. Clona el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` a partir del archivo `.env.template`
4. Levantar el servidor de NATS
`docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats`
5. Tener levantados los microservicios que se van a consumir
6. Levantar proyecto con `npm run start:dev`