# Capstone-Restaurant-Reservation-System

> This is the final assignment for Thinkful's full-stack software engineering program.
> This app is a reservation system for a fictional restaurant called "Periodic Tables."
> It is for internal use within the restaurant.
> The frontend of this app was written in Javascript, using React and Bootstrap.
> The backend is a fully-fledged RESTful API and uses PostgreSQL for the database.

## Components
The app has four main components: the dashboard, the reservation form, the search screen, and the new table form.

### Dashboard
The dashboard shows reservations for a given date, defaulting to today.
There are navigation buttons allowing the user to jump to the previous day, next day, or today.
There are two subcomponents: the Reservations component, and the Tables component.

![Image](https://i.ibb.co/0KgcC8y/Dashboard.png)

#### Reservations
The Reservations component shows reservations for the selected date.
The table contains name, mobile number, reservation date and time, party size, and current status.
Each reservation in the table has buttons which conditionally render based on whether the option is currently available.
These include an option to seat the reservation at a table (more on that shortly), edit, or cancel the reservation.

#### Tables
The Tables component shows all tables at the restaurant and whether or not they are currently occupied.
Each row displays a table along with its name, occupied status, and capacity, as well as a "finish" button
which renders conditionally based on whether the table is currently occupied.
When clicked, this button frees the table for another reservation to be seated.

### Reservation Form
This component is used both for creating a new reservation and editing an existing one.
Validation on the backend is mostly shared as well.

![Image](https://i.ibb.co/Br8Pzvx/New-reservation-form.png)

### Search
The search function allows the user to find reservations matching a given mobile number.
Search also uses the Reservations subcomponent to display matching reservations.

![Image](https://i.ibb.co/MRCLv54/search.png)

### New Table
The New Table component allows for creation of new tables, prompting the user to enter a table name and max capacity.
There is some minimal validation run on the inputs, ensuring that the table name has at least two characters,
and that the input for the max capacity is indeed a number.

![Image](https://i.ibb.co/g69PxyV/new-table.png)

## Backend
The backend is a RESTful API, connected to an SQL database hosted on ElephantSQL.
There is extensive validation done on all operations, ensuring that confounding data cannot make it to the database.
This includes:
- All fields are required
- All fields are of the correct datatype
- When sending GET requests to the database, reservations with status "cancelled" or "finished" are omitted
- Dates are formatted uniformly
- Validation on the dates and times check to ensure time zones are correct, however:
  - As this app is meant for use in-house, it does not check for edge cases where the reservation was entered from a different time zone, then accessed from the restaurant.
- All errors include appropriate HTTP codes
- The system does not accept reservations on Tuesdays, as the restaurant is closed
- The system does not accept reservations outside the restaurant's hours of operation, or one hour prior to restaurant closing
- Errors are all passed to the frontend and displayed in an error component which renders conditionally
- Updating a reservation runs validation ensuring that the requested changes can actually be made
- The search function does allow for searching of a partial phone number, as well

The deployed app can be found at https://rqd-resto-res-client.herokuapp.com

This assignment is currently passing all the tests, but please do let me know if you find any bugs!
