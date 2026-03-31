Imports Microsoft.Office.Interop
Imports Microsoft.Office.Interop.Word.WdSaveFormat
' Cag Onganer
Module Module1

    Sub Main()
        ' Read the filenames from console
        Dim InputFileName As String
        Dim OutputFileName As String

        Dim CommandArray(2) As String

        If Command$() = "" Then
            System.Console.Out.WriteLine("Usage: wpml2doc {input file full path} {output file full path}")
        End If

        CommandArray = Command$().Split()

        InputFileName = CommandArray(0)
        OutputFileName = CommandArray(1)

        ' create the word object 
        Dim objWordML As Word.Application

        objWordML = New Word.Application
        objWordML.Visible = False

        System.Console.Out.WriteLine("Opening WordProcessingML Document...")
        objWordML.Documents().Open(InputFileName, False)

        System.Console.Out.WriteLine("Opening the document as a Word Document...")
        objWordML.ActiveDocument.SaveAs(OutputFileName, wdFormatDocument)

        System.Console.Out.WriteLine("Shutting down Microsoft Office Word 2003")
        objWordML.Quit()
        objWordML = Nothing
    End Sub

End Module
