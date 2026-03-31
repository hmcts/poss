function FUnit() {};

FUnit.createInline = function()
{
	FUnitRenderer.createInline();
}

FUnit.continueTestRun = function()
{
	BatchTestRun.begin();
}

FUnit.interactiveMode = function()
{
	// TO DO - check is it really in interactive mode
	return true;
}
