# KSQL VSCode Syntax Highlighting

This provides syntax highlighting for [KSQL - the streaming SQL engine for Apache Kafka](https://www.confluent.io/product/ksql/).

![screencam of KSQL syntax highlighting in action](images/ksql-vscode.gif)

## How to install

From VSCode, go to Extensions (View->Extensions) and search for `KSQL`. Click on `Install` :) 

You can also download the `vsix` file from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=rmoff.ksql) directly to install it locally. 

## How to use it

Any file with the extension `.ksql` will be automagically detected. 

To apply it to any other file, switch the language mode to `KSQL`. You can do this one of two ways: 

1. from the bottom-right of the screen in the status bar, click on the current language name, and change it
2. by going to the command palette (Shift-Cmd-P on the Mac) and entering 'Change Language Mode' (or a subset of it; it will auto-complete), select the match, and then type KSQL. 

The second option is verbose to explain but much faster if you're a keyboard-warrior 😎

When you install the extension you get a Kafka icon in the activity bar, and you can see the topics, streams and tables in your connected instance. You can refresh the Explorer with Ctrl+Shift+P and choose the `Refresh KSQL Explorer` command. 

![Example of KSQL Explorer showing Topics, Streams, and Tables](https://user-images.githubusercontent.com/9764640/44015952-40250d68-9ed3-11e8-8c17-a4c7b7f6866e.png)

The extension assumes that your KSQL server is at `localhost:8088`. If it is not change the endpoint URL in the workspace config. 

![Using Workspace Config to change the KSQL endpoint](https://user-images.githubusercontent.com/9764640/44016309-cd067bbc-9ed4-11e8-867e-43181ecbe678.png)

## Get up and start developing straight away

* Open the terminal in the root of the folder and call `npm install`
* Press `F5` to open a new window with this extension loaded.
* open a file with the .ksql extension in the newly openened window.
* Set breakpoints in the code inside `src/KSQLMain.ts` to debug the extension.
* Find output from the extension in the debug console of the initial window.

## TODO

PRs very welcome!

* Differentiate between keywords, datatypes, etc in formatting
* Formatting capabilities
    * Indents
    * Line breaks (including line continuation character)
    * UPPER CASE on keywords
* Syntax checking

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## Authors

* [@dgcaron](https://twitter.com/dgcaron/)
* [@rmoff](https://twitter.com/rmoff/)
