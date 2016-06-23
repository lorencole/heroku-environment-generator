# heroku-environment-generator

## Synopsis

Export environment variables from heroku to your local shell.

## Code Example

```
$ generate-env --app heroku-app-name
$ source heroku-app-name.config
```
You *must* use '''source''' to export the resulting config.

## Dependencies
The heroku toolbelt must be installed. https://toolbelt.heroku.com/
