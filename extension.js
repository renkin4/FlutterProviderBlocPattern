// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require("fs");
const path = require('path'); 

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
		let folderPath = vscode.workspace.workspaceFolders; // get the open folder path 
		let rootFolderPath = folderPath[0].uri.fsPath;
		// Display a message box to the user
		let choosenPath = await vscode.window.showInputBox({prompt: "Folder Path", value : path.join(rootFolderPath, "lib")});
		let name = await vscode.window.showInputBox({prompt: "Bloc Name"});

		// IDK how to setup template folder so I just keep the strings here
		let blocFile = `import 'package:flutter/widgets.dart';
		class ${name}Bloc extends ChangeNotifier {
			BuildContext context;

			${name}Bloc({@required this.context});
		}`;

		let repoFile = `class ${name}Repository{}`;

		let defaultFile = `import 'package:flutter/material.dart';
		
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
		
		let blockFolderPath = path.join(choosenPath, "bloc");
		let neworkFolderPath = path.join(choosenPath, "network");
		let uiFolderPath = path.join(choosenPath, "ui");


		let blocFilePath = path.join(blockFolderPath, `${name}_bloc.dart`);
		let networkFilePath = path.join(neworkFolderPath, `${name}_repository.dart`);
		let uiFilePath = path.join(uiFolderPath, `${name}.dart`);

		if(!fs.existsSync(blockFolderPath)){
			fs.mkdir(blockFolderPath, {recursive : true}, () => {});
		}
		if(!fs.existsSync(neworkFolderPath)){
			fs.mkdir(neworkFolderPath, {recursive : true}, () => {});
		}
		if(!fs.existsSync(uiFolderPath)){
			fs.mkdir(uiFolderPath, {recursive : true}, () => {});
		}

		let errorHandler = (err) => {
			if(err){
				console.error(err);
				return vscode.window.showErrorMessage("Failed to genrate folder structure");
			}
		}

		await fs.writeFile(blocFilePath, blocFile, errorHandler);
		await fs.writeFile(networkFilePath, repoFile,errorHandler);
		await fs.writeFile(uiFilePath, defaultFile,errorHandler);

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
