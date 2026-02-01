# DaphOS Frontend Coding Challenge

## Overview
This project is a single page application built as part of the DaphOS frontend coding challenge.

The application allows managing employees and their working shifts, including calculated summary metrics derived from recorded work times.

The focus of this implementation is on:
- clear structure
- readable and maintainable code
- realistic frontend architecture
- preparation for a future backend API integration

Visual perfection and feature completeness beyond the requirements were intentionally not the goal.

---

## Setup Instructions

### Prerequisites
- Node.js 20.20.0 LTS
- npm 10.8.2

### Install dependencies
npm install

### Run locally
npm start

Open the application at: http://localhost:4200

## Scope of the Application

### Employees
- List all employees with name, role and status
- Create new employees
- Edit existing employees
- Deactivate employees (soft deactivation)
- Inactive employees remain visible and are read only

### Shifts
- Display shifts per employee
- Create, edit and delete shifts
- Shifts are sorted chronologically
- Validation rules:
  - End time must be after start time
  - Break time cannot exceed shift duration
  - Required fields must be filled
- Shifts cannot be modified for inactive employees

### Summary per Employee
The following metrics are calculated and displayed per employee:
- total_shifts
- total_hours_worked
- total_break_hours
- average_work_length

All summary values are derived from the employee's recorded shifts.

---

## UX and UI
- Master detail layout (employee list on the left, details on the right)
- Clear validation feedback per field
- Disabled actions for inactive employees
- Basic responsive layout
- Lightweight visual polish without external UI frameworks

---

## Technical Approach

- Framework: Angular
- Language: TypeScript
- Styling: SCSS
- Data persistence: Browser local storage
- Backend simulation via service layer

Components do not directly interact with local storage.
All data access goes through services, allowing easy replacement with real HTTP APIs in the future.

Validation errors are returned from services in a backend like format and handled consistently in the UI.

---

## Data Storage
The application stores data locally in the browser using:
- daphos_employees_v1
- daphos_shifts_v1

---

## Example Data Models

### Employee
{
  "id": "emp_1",
  "name": "Maria Papadopoulou",
  "role": "Nurse",
  "status": "active"
}

### Shift
{
  "id": "shift_1",
  "employeeId": "emp_1",
  "date": "2026-01-29",
  "startTime": "09:00",
  "endTime": "17:00",
  "breakMinutes": 30
}

### Validation Error Example
{
  "status": 422,
  "message": "Validation failed",
  "fieldErrors": {
    "endTime": "End time must be after start time",
    "breakMinutes": "Break time cannot exceed shift duration"
  }
}

