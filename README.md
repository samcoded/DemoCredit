# Demo Credit

## ABOUT

Demo Credit is a mobile lending app that requires wallet functionality. This is needed as borrowers need a wallet to receive the loans they have been granted and also send the money for repayments.

## TOOLS

NODEJS (Typescript) - Server framework

EXPRESS - Web framework

MYSQL (KNEX) - Database framework

## API DOCUMENTATION

https://documenter.getpostman.com/view/14158032/2s83zjtPNb (API DOCUMENTATION ON POSTMAN)

## LIVE DEMO

https://samuel-anozie-lendsqr-be-test.herokuapp.com/api (deployed to Heroku)

## DATABASE design

![DB DESIGN](/DBDesign.png 'DB DESIGN')

## INSTALL

Rename _.env.example_ to _.env_ and add credetials

` npm install`

## MIGRATION

`npm run migrate:production`

## RUNNING THE APP

` npm build`

` npm start`

## START APP DEV

`npm run dev`

## TESTING

`npm run test`

## ROUTES

```
#  Headers
Accept: application/json

# Public

POST   /api/login
@body: email, password

POST   /api/register
@body: name, email, password


# Protected (Needs Bearer Token)

-USER ROUTES

GET   /api/users - get all users

GET   /api/users/{user_id} - get user by id

PUT   /api/users/{user_id}  - update user
@body: email, name


-WALLET ROUTES
GET   /api/wallet/{user_id} - get wallet details by user_id

PUT   /api/wallet/fund/{user_id}  - fund user_id wallet
@body: amount

PUT   /api/wallet/transfer/{user_id}  - transfer to another user
@body: to, amount

GET   /api/wallet/{user_id} - get wallet transactions by user_id

```
