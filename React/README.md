<img alt="node-current badge" src="https://img.shields.io/badge/node-%2014.15.1-brightgreen" />

# SBCA Docs - ReactJS

## Getting Started

### Install components

#### `yarn install`

Install all of the necessary components using yarn.

## Building & Testing locally

You'll need to create a self-signed SSL certificate in order to log in to the PROD database and API endpoint. Follow the instructions below.

### Install on macOS
```console
brew install mkcert
```

### Generate and install a local CA
```console
mkcert -install
```

*after install restart browser*

### Point localhost to SSL-Certified domain name
Edit your hosts file by running the command in terminal:

```
sudo vim /private/etc/hosts
```

To look like this:

![Screen Shot 2020-09-25 at 9 50 56 AM](https://user-images.githubusercontent.com/24490773/94294611-eb47c700-ff14-11ea-9347-ce3a5c461354.png)

*replace "local.sbcacomponents.com" if that is different from the domain name specified in the SSL Certificate creation*

### Create a new certificate
```console
mkdir .certs && cd .certs && mkcert local.sbcacomponents.com
```

*if you're redirecting to any other host from 127.0.0.1, turn that off in /private/etc/hosts*

###
Next, create a file at the root of the site called .env and add the following.
```console
REACT_APP_API_URL='https://docs2.sbcacomponents.com'
REACT_APP_GOOGLE_CLIENT_ID='357169123212-s7tvq1526drterrrjshbfj6c8lnh4irm.apps.googleusercontent.com'
# HTTPS stuff
PORT=443
# or don't specify a port and it will default to port 3000
HTTPS=true
SSL_CRT_FILE='.cert/local.sbcacomponents.com.pem'
SSL_KEY_FILE='.cert/local.sbcacomponents.com-key.pem'
```

[mkcert Source](https://diamantidis.github.io/tips/2020/06/26/serve-localhost-website-on-https-with-mkcert)

### Access the app on a browser
Launch the development server and navigate to the SSL-Certified domain you specified

## Scripts

### `sudo yarn start`

#### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Live Link
https://docs2.sbcacomponents.com

### Available Scripts

In the project directory, you can run:

Built by:
Molly Duggan Associates
