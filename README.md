# Dev Confessions

An anonymous confession app for developers to share their bugs, deadline stress, imposter syndrome, and vibe-coding sessions.

## Live URL

https://challenge-1-11.onrender.com/

## Endpoints

- GET /api/v1/confessions
- POST /api/v1/confessions
- GET /api/v1/confessions/:id
- GET /api/v1/confessions/category/:cat
- DELETE /api/v1/confessions/:id

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT`
- `DELETE_TOKEN`
- `MAX_CONFESSION_TEXT_LENGTH`

## Run with

`npm install && npm