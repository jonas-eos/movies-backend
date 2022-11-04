# Movie API

## Technologies

This project was develop with the following technologies:

- JavaScript
- NodeJS
- Express
- SQLIte
- Knex
- brcyptjs

## Project

Movie API is a platform that users registry movies with descriptions and their own rating score with API Request

## How to use?

Clone this repository and with your terminal, enter in the directory

1. Run the command `npm install` to install the dependencies
2. After, run the command `npm run dev` to init the application and build de database
3. And to finish, run `npm run migrate` to create the database tables structures

The router request are the follow:

/users
1. GET - to list all users
2. GET /:user_id - to list a specific user
3. POST - body: name, email and password - to create a new user
4. PUT /:user_id - body: name, email, password, old_password - to update a user data

/movies
1. GET - query: user_id, title, tags - To list all movies to the user, you can use title and tags to filter
2. GET - /:movie_id/:user_id - To show a movie data
3. POST - /:user_id - body: title, description, rating (1 to 5), tags (array) - To create a new movie note on database
4. PUT - /:movie_id/:user_id - body: title, description, rating (1 to 5) - To update a movie note
5. DELETE - /:movie_id/:user_id - To delete the movie note
