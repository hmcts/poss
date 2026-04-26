<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:xalan="http://xml.apache.org/xalan" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:supsfo="http://eds.com/supsfo"
	exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan"
	>
<!-- Template called from *-FO.xml which need to display a manual DOB (eight boxes for MM/DD/YYYY) on the output -->	
<xsl:template name="manualDOB">
<fo:table table-layout="fixed">
	<!--
		RenderX Replacement: Removed redundant table-column element as it didn't match number of
		columns in each row and added margin-left to table-cells to ensure that contents are centred.
	-->
	<fo:table-body>
		<fo:table-row>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">D</fo:block>
			</fo:table-cell>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">D</fo:block>
			</fo:table-cell>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">M</fo:block>
			</fo:table-cell>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">M</fo:block>
			</fo:table-cell>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">Y</fo:block>
			</fo:table-cell>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">Y</fo:block>
			</fo:table-cell>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">Y</fo:block>
			</fo:table-cell>
			<fo:table-cell height="0.5cm" width="0.5cm" border-top-style="solid" border-left-style="solid" 
						border-bottom-style="solid" border-right-style="solid"
						border-top-width="0.02cm" border-left-width="0.02cm"
						border-bottom-width="0.02cm" border-right-width="0.02cm"
						margin-left="0cm">
				<fo:block text-align="center" font-size="4pt">Y</fo:block>
			</fo:table-cell>
		</fo:table-row>
	</fo:table-body>
</fo:table>

	</xsl:template>
</xsl:stylesheet>