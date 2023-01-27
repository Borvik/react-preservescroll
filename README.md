# @borvik/react-preservescroll

Provides a react component that is a drop-in replacement for a scrollable `<div>`.  All your css still applies to make it scrollable.  This just attaches handlers to record and restore the scroll position when you navigate the page either via history operations, or standard navigation.

The only difference from a `<div>` is that an `id` prop is _required_.

# Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Start by installing dependencies with `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Deployment

Deployment should be done using `npm publish`.