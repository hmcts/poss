/*
 * Implementation of SUPSVAR - allowing the placement and altering of sups variables in a document
 */

// Register the related command.
FCKCommands.RegisterCommand( 'SUPSVar', new FCKDialogCommand( 'SUPSVar', FCKLang.SUPSVarDlgTitle, FCKPlugins.Items['SUPSVar'].Path + 'supsvar.html', 340, 170 ) ) ;

// Create the "Plaholder" toolbar button.
var oSUPSVarItem = new FCKToolbarButton( 'SUPSVar', FCKLang.SUPSVarBtn ) ;
oSUPSVarItem.IconPath = FCKPlugins.Items['SUPSVar'].Path + 'supsvar.gif' ;
FCKToolbarItems.RegisterItem( 'SUPSVar', oSUPSVarItem ) ;


// The object used for all SUPSVar operations.
var SUPSVar = new Object() ;

// Add a new supsvar at the actual selection.
SUPSVar.Add = function( name )
{
	var oSpan = FCK.CreateElement( 'SPAN' ) ;
	this.SetupSpan( oSpan, name ) ;
}

SUPSVar.SetupSpan = function( span, name )
{
	span.innerHTML =  name ;

	span.className = 'SUPSVAR';
	span.contentEditable = false;

	// To avoid it to be resized.
	span.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}

SUPSVar._SetupClickListener = function()
{
	SUPSVar._ClickListener = function( e )
	{
		if ( e.target.tagName == 'SPAN' && e.target.className == 'SUPSVAR' )
			FCKSelection.SelectNode( e.target ) ;
		//if ( e.target.className == 'SUPSVAR' )
	}

	FCK.EditorDocument.addEventListener( 'click', SUPSVar._ClickListener, true );
	//SUPSEvent.addEventHandler(FCK.EditorDocument, 'click', SUPSVar._ClickListener,true);
//	var element = FCK.EditorDocument;
//	var action = SUPSVar._ClickListener;
//	var eventName = "click";
//	var capture = false;
//
//	  // Add onload event handler to allow us to resize the form
//	  if (element.attachEvent)
//	  {
//		  // IE DOM syntax
//	      element.attachEvent("on" + eventName, action);    
//	  }
//	  else if (element.addEventListener)
//	  {
//	    // W3C DOM (and Mozilla) syntax
//		element.addEventListener(eventName, action, null != capture ? capture : false);
//	  }

}

// Open the SUPSVar dialog on double click.
SUPSVar.OnDoubleClick = function( span )
{
	if ( span.tagName == 'SPAN' && span.className == 'SUPSVAR' )
	{
		FCKCommands.GetCommand( 'SUPSVar' ).Execute() ;
	}
}

FCK.RegisterDoubleClickHandler( SUPSVar.OnDoubleClick, 'SPAN' ) ;

SUPSVar.Exist = function( name )
{
}

//SUPSVar.Redraw = function()
//{
//SUPSVar._SetupClickListener();
//}






if ( FCKBrowserInfo.IsIE )
{
	SUPSVar.Redraw = function()
	{
	}
}
else
{
	SUPSVar.Redraw = function()
	{
		var oInteractor = FCK.EditorDocument.createTreeWalker( FCK.EditorDocument.body, NodeFilter.SHOW_TEXT, SUPSVar._AcceptNode, true ) ;

		var	aNodes = new Array() ;

		while ( oNode = oInteractor.nextNode() )
		{
			aNodes[ aNodes.length ] = oNode ;
		}

		for ( var n = 0 ; n < aNodes.length ; n++ )
		{
			var aPieces = aNodes[n].nodeValue.split( /(\[\[[^\[\]]+\]\])/g ) ;

			for ( var i = 0 ; i < aPieces.length ; i++ )
			{
				if ( aPieces[i].length > 0 )
				{
					if ( aPieces[i].indexOf( '[[' ) == 0 )
					{
						var sName = aPieces[i].match( /\[\[\s*([^\]]*?)\s*\]\]/ )[1] ;

						var oSpan = FCK.EditorDocument.createElement( 'span' ) ;
						SUPSVar.SetupSpan( oSpan, sName ) ;

						aNodes[n].parentNode.insertBefore( oSpan, aNodes[n] ) ;
					}
					else
						aNodes[n].parentNode.insertBefore( FCK.EditorDocument.createTextNode( aPieces[i] ) , aNodes[n] ) ;
				}
			}

			aNodes[n].parentNode.removeChild( aNodes[n] ) ;
		}
		
		SUPSVar._SetupClickListener() ;
	}

	SUPSVar._AcceptNode = function( node )
	{
		if ( /\[\[[^\[\]]+\]\]/.test( node.nodeValue ) )
			return NodeFilter.FILTER_ACCEPT ;
		else
			return NodeFilter.FILTER_SKIP ;
	}
}


FCK.Events.AttachEvent( 'OnAfterSetHTML', SUPSVar.Redraw ) ;

// The "Redraw" method must be called on startup.
SUPSVar.Redraw() ;


FCKXHtml.TagProcessors['span'] = function( node, htmlNode )
{
	//if ( htmlNode.className == 'SUPSVAR' )
		//node = FCKXHtml.XML.createTextNode( htmlNode.innerHTML  ) ;
	//else
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;

	return node ;
}






