
function PrintDocument() {};


// Generic Undefined command (usually used when a command is under development).
FCKPrintDocumentCommand = function()
{
	this.Name = 'PrintDocument' ;
}

FCKPrintDocumentCommand.prototype.Execute = function()
{
	GUIAdaptorRef.doPrint();
}

FCKPrintDocumentCommand.prototype.GetState = function()
{
	return FCK_TRISTATE_OFF ;
}

// Register the related command.
FCKCommands.RegisterCommand('PrintDocument', new FCKPrintDocumentCommand() ) ;

// Create the toolbar button.
var oPrintDocumentItem = new FCKToolbarButton( 'PrintDocument', FCKLang.PrintDocumentBtn ) ;
oPrintDocumentItem.IconPath = FCKPlugins.Items['PrintDocument'].Path + 'print.gif' ;
FCKToolbarItems.RegisterItem( 'PrintDocument', oPrintDocumentItem ) ;





