//==================================================================
//
// String.js
//
// Contains utility functions for managing Strings.
//
//==================================================================




/**
 * Regexp used to trim whitespace from a beginning and end of a string
 *
 * @type RegExp
 * @private
 */
String.m_trimRegExp = /^\s*(.*?)\s*$/;


/**
 * Trim leading and trailing whitespace from a string.
 *
 * NOTE: This is implemented as a static method, rather than an
 * instance method as I don't want to bloat a string instance 
 * any further with another function - Each instance in JavaScript
 * will have it's own reference to each instance member.
 *
 * @param s the String to trim
 * @return the trimmed String
 * @type String
 */
String.trim = function(s)
{
	return s.replace(String.m_trimRegExp, "$1");
}


/**
 * Lexically compare two strings in the same way as C strcmp
 *
 * @param s1 First string
 * @param s2 Second string
 * @return -1 if s1 is "less" than s2, +1 if s1 is "greater" than s2
 *   and 0 if they are equal.
 * @type Integer
 */
String.strcmp = function(s1, s2)
{
	if(s1 > s2)
	{
		return 1;
	}
	else if(s1 < s2)
	{
		return -1;
	}
	return 0;
}
