# [Nodejs + Express + Mongodb]  
![enter image description here](https://d33wubrfki0l68.cloudfront.net/ee5af837fdabb4d29b35d25748c0072d1816c255/3f3a0/public/assets/images/jxavz9h.png)  
> ### [Nodejs + Express + Mongodb]
This Project was created to demonstrate an application built with **Nodejs + express + MongoDB** including CRUD operations, authentication, routing

This Project is about book store back-end, You can wirte a book and then publish the your book

# Endpoints 
### User
**Authentication** 

POST `/api/users/login`

Request body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/1.png" />

Required fields: username, password

Return body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/2.png" />

**Get Current User**

GET `/api/user`

Authentication required

Return body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/3.png" />

**Registration**

POST `/api/users/register`

Request body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/4.png" />

Required fields: username, password, author, pseudonym

Return body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/5.png" />

**Get User By Username**

GET `/api/user/:user`

Return body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/6.png" />

**Update User:**

PUT `/api/user/edit`

Request body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/7.png" />

Authentication required

Accepted fields: user, author, pseudonym

Return body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/8.png" />

**User Change Password**

PUT `/api/user/change_password`

Request body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/9.png" />

Authentication required

Accepted fields: user, author, pseudonym

Return body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/10.png" />

### Book

**Get book**

No authentication required, will return single article

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/11.png" />

**List Book**

GET `/api/book/`

Returns most recent articles globally by default, pseudonym , author or price query parameter to filter results

Query Parameters:
  Filter by author:
  `?author=Luke`
  Filter by price:
  `?price=249`
  Filter by pseudonym:
  `?pseudonym=Skywalker`
  
  <img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/12.png" />
  
  `/api/books?author=Luke&price=249&pseudonym=Skywalker`
  
Authentication optional, will return `multiple` books

Create Book:

POST `/api/book/`

Request body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/13.png" />

Authentication required

Required fields: `title`, `description`

Optional fields: `publish`, `image`, `price`

Return body: 

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/14.png" />

Update Book:

PUT `/api/book/:book`

Request body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/15.png" />

Authentication required

Accepted fields: `title`, `description`, `price`, `image`, `publish`

Return body:

<img src="https://github.com/Dischapongpoom/BookStore/blob/main/image/16.png" />

Delete Book:

DELETE `/api/book/:book`

Authentication required

# Getting started  
  
 1. add `.env` file with fallowing values:   
    `SERVER_PORT=8000`             
    `MONGODB_URI=mongodb://localhost:27017/medium`   
    `JWT_KEY = secret-key`
    
 2. `npm install`  
 3. `npm run server`  
 4. Head to `http://localhost:8000` to check graphql playground.
