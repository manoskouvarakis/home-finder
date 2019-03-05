# home-finder

Given a specific search url, find newly published ads.
 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes

### Prerequisites

In order to run the application locally, you will only need [Node.js](https://nodejs.org/en/) installed on your computer. 

### Configuration

In configuration file (config.js) you can set:
- The search url
- The interval (in minutes) of each search
- Enable/Disable Mail
- If mail is enabled, you should set user, pass and recipients addresses

### Installation

In order to run the project:

```
- Clone the repository in your pc
- Navigate to /home-finder
- Run "npm install"
```

### Execution

```
- Navigate to /home-finder/app
- Run "node index.js" 
```

### Built With

* [NodeJS](https://nodejs.org)
* [LokiJS](http://lokijs.org/) - In-memory NoSQL database
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
