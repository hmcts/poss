
function PreviewDocument() {};


// Generic Undefined command (usually used when a command is under development).
FCKPreviewDocumentCommand = function()
{
	this.Name = 'PreviewDocument' ;
}

FCKPreviewDocumentCommand.prototype.Execute = function()
{
	GUIAdaptorRef.doPreview();
}

FCKPreviewDocumentCommand.prototype.GetState = function()
{
	return FCK_TRISTATE_OFF ;
}

// Register the related command.
FCKCommands.RegisterCommand('PreviewDocument', new FCKPreviewDocumentCommand() ) ;

// Create the toolbar button.
var oPreviewDocumentItem = new FCKToolbarButton( 'PreviewDocument', FCKLang.PreviewDocumentBtn ) ;
oPreviewDocumentItem.IconPath = FCKPlugins.Items['PreviewDocument'].Path + 'preview.gif' ;
FCKToolbarItems.RegisterItem( 'PreviewDocument', oPreviewDocumentItem ) ;





