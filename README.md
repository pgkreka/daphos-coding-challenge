# DaphOS Frontend Coding Challenge

## Overview
This project is a single page application built as part of the DaphOS frontend coding challenge.  
The application allows managing employees and their working shifts, including summary metrics derived from the recorded work times.

The goal of this implementation is not completeness or visual perfection, but a clear structure, readable code, and an architecture that can easily be extended with a real backend API.

---

## Setup Instructions

### Prerequisites
- Node.js 20 LTS
- npm 10

### Install dependencies
npm install

### Run locally
npm start

Open the application at:
http://localhost:4200

## Scope of the Application

### Employees
- List all employees with name, role and status
- Create new employees
- Edit existing employees
- Deactivate employees (soft deactivation)

### Shifts
- Display shifts per employee
- Create, edit and delete shifts
- Validation errors are handled and displayed in the UI

### Summary per Employee
The following metrics are calculated and displayed per employee:
- total_shifts
- total_hours_worked
- total_break_hours
- average_work_length

All summary values are derived from the employee's recorded shifts.

---

## UX and UI
- Clear master detail layout with employee list and details view
- User friendly validation messages
- Basic responsive layout for smaller screens

---

## Technical Approach

- Framework: Angular
- Language: TypeScript
- Styling: SCSS
- Data persistence: Browser local storage

The application is structured with a service layer that simulates backend behavior.  
Components do not directly interact with local storage, which allows replacing the mocked services with real HTTP API calls in the future.

Validation errors are simulated in the service layer and returned in a backend like error format.

---

## Data Storage
Data is stored locally in the browser using versioned local storage keys.

- daphos_employees_v1
- daphos_shifts_v1

---

## Example Data Models

### Employee
```json
{
  "id": "emp_1",
  "name": "Maria Papadopoulou",
  "role": "Nurse",
  "status": "active"
}

