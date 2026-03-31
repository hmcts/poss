
function SaveDocument() {};


// Generic Undefined command (usually used when a command is under development).
FCKSaveDocumentCommand = function()
{
	this.Name = 'SaveDocument' ;
}

FCKSaveDocumentCommand.prototype.Execute = function()
{
	GUIAdaptorRef.doSave();
}

FCKSaveDocumentCommand.prototype.GetState = function()
{
	return FCK_TRISTATE_OFF ;
}

// Register the related command.
FCKCommands.RegisterCommand('SaveDocument', new FCKSaveDocumentCommand() ) ;

// Create the toolbar button.
var oSaveDocumentItem = new FCKToolbarButton( 'SaveDocument', FCKLang.SaveDocumentBtn ) ;
oSaveDocumentItem.IconPath = FCKPlugins.Items['SaveDocument'].Path + 'save.gif' ;
FCKToolbarItems.RegisterItem( 'SaveDocument', oSaveDocumentItem ) ;





