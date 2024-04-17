# Northcoders News API

## A fully functional REST API that provides data on Northcoders News!

This project is designed to outline building and accesssing a REST API, which provides a back-end service for a front-end architecture to utilise.

Link to the live API: https://nc-news-7e8z.onrender.com

All endpoints are handled in `app.js`.

A comprehensive list of these endpoints are contained in `endpoints.json`.

`.husky` is a node package only used for development purposes.

`listen.js` binds the app to the relevant port it can listen for requests on.

`db` folder contains all of the required seeding and local database files.

## Clone

```zsh
git clone https://github.com/HanzoDaBoss/nc-news-be-project.git
```

## Install Dependencies

```zsh
npm install
```

## Databases

Run this script to initialise the local databases

```zsh
npm run setup-dbs
```

To connect to the local databases, run the following commands

```zsh
echo "PGDATABASE = nc_news_test" > .env.test
echo "PGDATABASE = nc_news" > .env.development
```

## Seeding

Run this script to seed the development database

```zsh
npm run seed
```

## Testing

Run this script to test the database

```zsh
npm t app.test
```

## Minimum Version Requirements

Node.js: `v21.5.0`

PostgreSQL: `v14.11`
