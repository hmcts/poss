function Comparators(){};

Comparators.numericalSort = function(a, b)
{
	var n1 = parseInt(a);
	var n2 = parseInt(b);
	if(isNaN(n1)) n1 = 0;
	if(isNaN(n2)) n2 = 0;
	//return n1 - n2;
	// RWW - This is actually wrong, but it makes numerical sort consistent
	// with alphabetical sort!
	return n2 - n1;
}

Comparators.numericalFloatingPointSort = function(a, b)
{
    var returnValue = null;
    
    var f1 = parseFloat(a);
    var f2 = parseFloat(b);
    
    // Check for non-numeric values
    var isf1NaN = false;
    if(isNaN(f1))
    {
        isf1NaN = true;
    }
    
    var isf2NaN = false;
    if(isNaN(f2))
    {
        isf2NaN = true;
    }
    
    if(isf1NaN && isf2NaN)
    {
        // Both input values are not numbers, therefore, assume equality
        returnValue = 0;
    }
    else if(isf1NaN && !isf2NaN)
    {
        // Assume f2 > f1
        returnValue = 1;
    }
    else if(!isf1NaN && isf2NaN)
    {
        // Assume f1 > f2
        returnValue = -1;
    }
    else
    {
        // Two valid numbers
        if( f2 > f1 )
        {
            returnValue = 1;
        }
        else if( f1 > f2 )
        {
            returnValue = -1;
        }
        else
        {
            // Note that sometimes floating point numbers
            // do not easily manage equality.
            returnValue = 0;
        }
    }
    
    return returnValue;
}

Comparators.alphabeticalSort = function(a, b)
{
	if(a > b)
		return -1;
	else if(b > a)
		return 1;
	else
		return 0;
}

Comparators.alphabeticalSortLowToHigh = function(a, b)
{
	return (-1 * Comparators.alphabeticalSort(a,b));
}

Comparators.alphabeticalLocaleCompareSort = function(a, b)
{
	return a.localeCompare(b);
}

Comparators.alphabeticalCaseInsensitiveSort = function(a, b)
{
	var Ua = a.toUpperCase();
	var Ub = b.toUpperCase();
	if(Ua > Ub)
		return -1;
	else if(Ub > Ua)
		return 1;
	else
		return 0;
}
