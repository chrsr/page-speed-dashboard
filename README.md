# Google Page Speed Dashboard

A dashboard to display the page speed score of a set of urls.

## Installation

With Node, NPM and Bower installed run:

    $ npm install

    $ bower install


## Visualisation
The dashboard runs in your browser.

### View the dashboard
localhost:3000

### Auto-testing mode (for auto-refresh)
localhost:3000?refresh=true

### Pages endpoint
localhost:3000/pages.json

### Test results endpoint
localhost:3000/results.json

## Extending
Add more pages.

### Add page
To add a page to test, update pages.json, include:
    - Name
    - URL