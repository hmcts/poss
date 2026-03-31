/*
 * Framework FCK Editor custom configurations file
 */
 
FCKConfig.Plugins.Add('JSpellCheck','en');
FCKConfig.Plugins.Add('SUPSVar','en');
FCKConfig.Plugins.Add('SaveDocument','en');
FCKConfig.Plugins.Add('PreviewDocument','en');
FCKConfig.Plugins.Add('PrintDocument','en');


FCKConfig.ToolbarSets["All"] =
[
	['SaveDocument', 'NewPage', 'PreviewDocument', 'Cut', 'Copy', 'PrintDocument', 'JSpellCheck', 'Undo', 'Redo', 'Find', 'Replace', 'SelectAll', 'RemoveFormat']
	, 
	['Bold', 'Italic', 'Underline', 'StrikeThrough', 'Subscript', 'Superscript', 'OrderedList', 'UnorderedList', 'Outdent', 'Indent', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull',  'SpecialChar']
	, 
	['SUPSVar']
	,
	['Style', 'FontFormat', 'FontName', 'FontSize']
];

FCKConfig.ToolbarSets["EditTextOnly"] =
[
	['Cut', 'Copy', 'Paste', 'JSpellCheck']
	, 
	['Undo', 'Redo', 'Find', 'Replace', 'SelectAll', 'RemoveFormat']
];

FCKConfig.ToolbarSets["SUPSDefault"] =
[
    ['Copy', 'Cut', 'Paste', 'PasteText', 'SelectAll']
      ,
	['Undo','Redo']
      ,
	['Italic', 'Bold', 'Underline']
	  ,
	['FontName']
	  ,
	['JustifyFull', 'JustifyCenter', 'JustifyLeft', 'JustifyRight']
	  ,
    ['Outdent', 'Indent', 'OrderedList', 'UnorderedList']
      ,
    ['JSpellCheck']
];
