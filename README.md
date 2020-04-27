# Resum As A Service backend

## Setup

1. Install Serverless with `npm install -g serverless`
2. Install the dependencies `npm install`

Run `npm test` and check that all tests are passed

## Setting the credentials and project

Create your Google Cloud project following this [doc](https://serverless.com/framework/docs/providers/google/guide/credentials/).
Update the `credentials` and your `project` property in the `serverless.yml` file.

## Deployment

```bash
serverless deploy
```

## Getting started

Call GET /render/template1/john and check the result png file
Description of other endpoints see below

## Endpoints List

### POST /render/:templateId

**Request**
payload: application/json
{
    userData: {}
}

**Response**

```application/json
{
    pngUrl: '',
    pdfUrl: ''
}
```

### POST /render/:templateId/:dummyUserId

**Request**
payload: application/json
{
    userData: {}
}

**Response**

```application/json
{
    pngUrl: '',
    pdfUrl: ''
}
```

### GET /assets/templates/

**Response**

```application/json
{
    templates: ["a", "b", "c"]
}
```

### GET /assets/dummy-users/

**Response**

```application/json
{
    users: ["John", "Ben"]
}
```
