# anagrams

This application retreives anagrams (case sensitive or not, partial match or not) from a given text file.

# Version

The latest version is the 1.0.0

# Scripts

#### Quick overview on the `package.json` scripts

###### Reminder

First run `npm i` from the project root.

`npm run build`: Creates the bundle in production mode. By default the destination is `./dist`. Messages for debugging purpouse as well as exception stack traces are not visible in the console but the they are logged in the file system. This bundle is minified.

`npm run build:staging`: Creates the bundle in staging mode. By default the destination is `./tmp`. The difference between this mode and the production is that exception stack traces are shown in the console but not `silly` messages that are prints in order to not lose informations about the user prompts (in any case they are stored in log files). This version has been created in order to test the application with an experience close to the user since it uses the full dictionary file. This bundle is not minified.

`npm run start`: Creates the bundle in productions mode in `./dist` and runs it immediatly.

`npm run start:dev`: Transpiles the TypeScript code and runs the application with `nodemon` so it restarts at every file change in order to test immediately the changes.

`npm run nodemon`: For internal use.

`npm run test`: Runs all the tests in the solution.

`npm run coverage`: Runs all the tests and shows the code coverage of the application.

`npm run coverage`: Runs all the tests and shows the code coverage of the application, when it is done a browser page will open showing the code coverage page. Default folder for the coverage files is `./coverage` and the default port for the web server is `8080`.

`npm run eslint`: Runs `eslint` on the solution and shows what could be wrong with it.

`npm run eslint:fix`: Same as the previous one but tries to fix the issues by itself when possibile.

`npm run prettier`: Runs `prettier` on the solution and shows what is wrong with the code formatting.

`npm run prettier:fix`: Same as the previous one but tries to fix the issues by itself.

`npm run check-up`: Runs some script like code formatters, test coverage and builds to make sure everything is OK with the code. It is reccomended to run it before `commit` and `push` in order to keep the code clean. Don't forget to run also `node ./dist/main.js` to catch runtime errors!

`npm run clean`: Deletes the folders `./coverage, ./dev, ./dist, ./tmp, ./node_modules` and runs `npm ci` to reinstall the dependensies
