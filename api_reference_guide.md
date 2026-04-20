# API Reference Guide

## Base URL
`/api`

## Authentication
`POST /auth/login` - Authenticate users  
`POST /auth/register` - Register new user  

## Tables
`GET /tables` - Fetch all tables in system  
`POST /tables` - Create a new table  
`PUT /tables/{id}/status` - Update table status  
`DELETE /tables/{id}` - Delete a table  

## Orders
`GET /orders` - Fetch orders  
`POST /orders` - Place a new order  
`PUT /orders/{id}/status` - Update order progression status  

## Menu
`GET /menu` - Fetch all menu items  
`POST /menu` - Add a new menu item  
`PUT /menu/{id}` - Modify existing menu item  
`DELETE /menu/{id}` - Remove menu item
