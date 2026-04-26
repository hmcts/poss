//==================================================================
// XPathParser
//  Class for parsing XPaths
//==================================================================

//@import XPathParserError
//@import XPathListener

/**
 * Class which implements a simple xpath parser XPathParser
 *
 * @constructor
 * @private
 */
function XPathParser()
{
	this.m_xp = null;
	this.m_listener = null;
}


/**
 * Get the xpath currently being parsed
 *
 * @return the xpath currently being parsed, or null if no xpath is being parsed.
 * @type String
 * @private
 */
XPathParser.prototype.getXPath = function()
{
	return this.m_xp;
}


/**
 * Parse an xpath
 *
 * @param xp the xpath string to parse
 * @param listener the object which will listen to the parse events as
 *        they occur.
 * @throws XPathParseException if an error occured during parsing
 * @private
 */
XPathParser.prototype.parse = function(xp, listener)
{
	fc_assert(xp != null, "XPathParser.parse(): XPath must not be a null string");
	fc_assert(listener != null, "XPathParser.parse(): listener must not be null");
	
	// Initialise internal variables
	this.m_xp = xp;
	this.m_listener = listener;
	
	var p = 0;
	
	if(p < xp.length)
	{
		switch (xp.charAt(p))
		{
			case '/':
				this._startNode(++p);
				break;
				
			default:
				this._exception(p, "XPath must start at root - first character must be /");
		}
	}
	else
	{
		this._exception(p, "XPath was empty");
	}
	
	// Reset internal state.
	this.m_xp = null;
	this.m_listener = null;
}


/**
 * Start parsing a node
 *
 * @param p position in xpath to start parsing
 * @throws XPathParseException if an error occured during parsing
 * @private
 */
XPathParser.prototype._startNode = function(p)
{
	var xp = this.m_xp;
	if(p < xp.length)
	{
		switch(xp.charAt(p))
		{
			case '/':
				// Match recursive element i.e. //
				this.m_listener.node('/');
				this._decendantNode(++p);
				break;
				
			case "'":
			case '"':
			case '[':
			case ']':
				this._exception(p, "Illegal character '" + xp.charAt(p) + "' in startNode");
				break;
				
			default:
				this._parseNode(p);
				break;
		}
	}
}


/**
 * Start parsing a node after a decendant node match
 *
 * @param p position in xpath to start parsing
 * @throws XPathParseException if an error occured during parsing
 * @private
 */
XPathParser.prototype._decendantNode = function(p)
{
	var xp = this.m_xp;
	if(p < xp.length)
	{
		switch(xp.charAt(p))
		{
			case '/':
			case "'":
			case '"':
			case '[':
			case ']':
				this._exception(p, "Illegal character '" + xp.charAt(p) + "' in decendantNode");
				break;
				
			default:
				this._parseNode(p);
		}
	}
	else
	{
		this._exception(p, "Recursive match must be followed by a node match");
	}
}


/**
 * Start parsing a node name
 *
 * @param p position in xpath to start parsing
 * @throws XPathParseException if an error occured during parsing
 * @private
 */
XPathParser.prototype._parseNode = function(p)
{
	var s = p;
	var xp = this.m_xp;
	var le = xp.length;
	
	while(p < le && s != -1)
	{
		switch(xp.charAt(p))
		{
			case '/':
				// TODO add element
				this.m_listener.node(xp.substring(s, p));
				this._startNode(++p);
				s = -1;
				break;
				
			case '[':
				// TODO add element
				this.m_listener.node(xp.substring(s, p));
				this._startPredicate(++p);
				s = -1;
				break;
				
			case "'":
			case '"':
			case ']':
				this._exception(p, "Illegal character '" + xp.charAt(p) + "' in parseNode");
				break;
			
			default:
				p++;
		}
	}
	
	// Run out of chars, so if we haven't previously reported element name and this
	// wasn't simply a trailing / then report the element name.
	if(s != -1 && s != p)
	{
		this.m_listener.node(xp.substring(s, p));
	}
}


/**
 * Start parsing a predicate
 *
 * @param p position in xpath to start parsing
 * @throws XPathParseException if an error occured during parsing
 * @private
 */
XPathParser.prototype._startPredicate = function(p)
{
	var s = p;
	var xp = this.m_xp;
	var le = xp.length;
	
	// Keeps a count of how many '[' characters have been parsed so far
	// in this predicate.
	var nestedPredicateCount = 1;  // First '[' has already been identified

	while(p < le && s != -1)
	{
		switch(xp.charAt(p))
		{
			case '"':
			case "'":
				p++;
				var e = xp.indexOf(xp.charAt(p - 1), p);    // Also returns -1 if p >= length of string
				if(-1 == e)
				{
					this._exception(p, "Unterminated quoted string");
				}
				else
				{
					p = e + 1;
				}
				break;
				
			case '[':
			  p++;
				nestedPredicateCount++;
				break;				
				
			case ']':
			  nestedPredicateCount--;
			  if (nestedPredicateCount == 0) // All '[' characters matched.
			  {
			    this.m_listener.predicate(xp.substring(s,p));
				  this._endPredicate(++p);
				  s = -1;
				  break;
			  }	
			default:
				p++;
		}
	}


	// Run out of chars, so if we haven't previously reported element name and this
	// wasn't simply a trailing / then report the element name.
	if(s != -1 && s != p)
	{
		this._exception(p, "Unclosed predicate");
	}
}


/**
 * End parsing a predicate
 *
 * @param p position in xpath to start parsing
 * @throws XPathParseException if an error occured during parsing
 * @private
 */
XPathParser.prototype._endPredicate = function(p)
{
	var xp = this.m_xp;
	if(p < xp.length)
	{
		switch(xp.charAt(p))
		{
			case '/':
				this._startNode(++p);
				break;
			
			case '[':
			  this._startPredicate(++p);
			  break;
				
			default:
				this._exception(p, "Illegal character after predicate '" + xp.charAt(p) + "' in endPredicate");
				break;
		}
	}
}


/**
 * Utility function to throw useful parsing exception
 *
 * @param position the character position within the xpath which caused the parsing exception
 * @param message the message for the exception
 * @throws XPathParseError always
 * @private
 */
XPathParser.prototype._exception = function(position, message)
{
	throw new XPathParseError(message + " at char: " + position + " in xpath: " + this.m_xp);
}
