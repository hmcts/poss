
function JSpellCheck() {};


// Generic Undefined command (usually used when a command is under development).
FCKJSpellCheckCommand = function()
{
	this.Name = 'JSpellCheck' ;
}

FCKJSpellCheckCommand.prototype.Execute = function()
{
GUIAdaptorRef.doSpellCheck();
}

FCKJSpellCheckCommand.prototype.GetState = function()
{
	return FCK_TRISTATE_OFF ;
}

// Register the related command.
FCKCommands.RegisterCommand('JSpellCheck', new FCKJSpellCheckCommand() ) ;

// Create the toolbar button.
var oJSpellCheckItem = new FCKToolbarButton( 'JSpellCheck', FCKLang.JSpellCheckBtn ) ;
oJSpellCheckItem.IconPath = FCKPlugins.Items['JSpellCheck'].Path + 'spellcheck.gif' ;
FCKToolbarItems.RegisterItem( 'JSpellCheck', oJSpellCheckItem ) ;





