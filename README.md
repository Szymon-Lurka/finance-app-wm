﻿# A simple financial management application.

## The application allows you to:
- Create an account, login, change account information, change password, password reminder (send email)
- Adding categories (title, description, category color)
- Ability to add expenses/income and pin them to the selected category
- Account balance
- Expense/income reports (by category, etc.) with the ability to set a date range


## Tech stack
### a) Frontend:
- Vue 3
- Pinia for state management
- Primevue as UI library
- vee-validate for better validation
- yup for better validation rules
- JS chart for reports
### b) Backend:
- node JS + express
- bcryptjs for password hashing
- cors for cors management
- express-rate-limit
- nodemailer for sending emails
- validator for validation
- handlebars for managing email templates
- jsonwebtoken for auth
- mongoDB as database
- mongoose for better and simpler interactions with mongoDB
### c) Common:
- dayjs for managing dates
### d) Server:
- linux VPS, shell scripts for deploy automations
- docker (docker compose)
- nginx in VPS
- cert bot for SSL
### e) CI/CD:
- github actions
- shell scripts

