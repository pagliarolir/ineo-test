# Ineo Test

## Description

Ineo Test is a take-home project for the company Ineo. The core technology is Angular v18, complemented by other technologies including PrimeNG and a mock JSON server.

## Features

- Utilizes Angular 18.2.0
- Integrated with PrimeNG for UI components
- Mock JSON server setup with `json-server`

## Technologies Used

- Angular: ^18.2.0
- RxJS: ~7.8.0
- PrimeNG: ^17.18.9
- PrimeIcons: ^7.0.0
- json-server: 0.17.4

## Installation

1. Clone the repository:
    ```bash
    git clone <REPOSITORY_URL>
    ```
2. Navigate to the project folder:
    ```bash
    cd ineo-test
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the mock JSON server:
    ```bash
    json-server db.json --watch
    ```
2. Start the Angular development server:
    ```bash
    npm start
    ```

The application will be available at `http://localhost:4200`.

## Project Structure

- `src/app/`: Contains the main components, services, and modules.
- `src/assets/`: Static resources such as images and styles.
- `src/environments/`: Configuration for development and production environments.
- `db.json`: Configuration file for `json-server`.

## Authors

- Roberto Pagliaroli - Developer
