function ArrayUtils() {};

ArrayUtils.contains = function (array, object)
{
	for (var i = 0; i < array.length; i++)
	{
		if (array[i] == object)
		{
			return true;	
		}	
	}
	return false;
}



