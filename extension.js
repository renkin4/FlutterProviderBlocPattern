// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutterproviderblocpattern" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('flutterproviderblocpattern.createFlutterBloc', async function () {
		// The code you place here will be executed every time your command is executed
		let path = require('path'); 
		let folderPath = vscode.env.appRoot; // get the open folder path 
		// Display a message box to the user
		let choosenPath = await vscode.window.showInputBox({prompt: "Folder Path", value : path.join(folderPath, "lib")});
		let name = await vscode.window.showInputBox({prompt: "Bloc Name"});

		// IDK how to setup template folder so I just keep the strings here
		let blocFile = String.raw`import 'package:flutter/widgets.dart';
		class ${name}Bloc extends ChangeNotifier {
			BuildContext context;

			${name}Bloc({@required this.context});
		}`;

		let repoFile = String.raw`class ${name}Repository{}`;

		let defaultFile = String.raw`import 'package:flutter/material.dart';
		
		class ${name}Screen extends StatefulWidget {
			${name}Screen({Key key}) : super(key: key);
		  
			@override
			_${name}ScreenState createState() => _${name}ScreenState();
		}

		class _${name}ScreenState extends State<${name}Screen> {
			final ${name}Repository _repository = ${name}Repository();

			@override
			void initState() {
			  super.initState();
			}

			@override
			Widget build(BuildContext context) {
				return Scaffold(
					body : ChangeNotifierProvider(
						create: (BuildContext context) => ${name}Bloc(context : context),
						child: Container(),
					),
				);
			}
		}
		`;
		
		let blocFilePath = path.join(path.join(choosenPath, "bloc"), `${name}_bloc.dart`);
		let networkFilePath = path.join(path.join(choosenPath, "network"), `${name}_repository.dart`);
		let uiFilePath = path.join(path.join(choosenPath, "ui"), `${name}.dart`);

		await vscode.workspace.fs.writeFile(vscode.Uri.parse(blocFilePath), Buffer.from(blocFile));
		await vscode.workspace.fs.writeFile(vscode.Uri.parse(networkFilePath), Buffer.from(repoFile));
		await vscode.workspace.fs.writeFile(vscode.Uri.parse(uiFilePath), Buffer.from(defaultFile));

		vscode.window.showInformationMessage("Yep Finish. Enjoy =D");
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
