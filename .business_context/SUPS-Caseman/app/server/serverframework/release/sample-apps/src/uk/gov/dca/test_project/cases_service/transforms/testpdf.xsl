<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.1" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" exclude-result-prefixes="fo">
	<xsl:output method="xml" version="1.0" omit-xml-declaration="no" indent="yes"/>

	<xsl:param name="intParam"/>	
	<xsl:param name="stringParam"/>	
	<xsl:param name="boolParam"/>	
	
  	<!-- =============================== -->
  	<!-- root element: Value   -->
  	<!-- =============================== -->
  	
  	<xsl:template match="Value">
	    <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
		
			<!-- Begin the page layout definition -->
			<fo:layout-master-set>
			
			    <!-- Defines the layout for the first page of the report --> 
				<fo:simple-page-master master-name="page"
			    	page-height="21cm"
			    	page-width="29.7cm"
			    	margin-top="1cm"
			    	margin-bottom="1cm"
			    	margin-left="1cm"
			    	margin-right="1cm">
			    	<fo:region-start extent="1cm"/>
			  		<fo:region-end extent="1cm"/>
			    	<fo:region-body margin-top="4cm" margin-bottom="1cm"/>
			    	<fo:region-before region-name="header" extent="4cm"/>
			    	<fo:region-after region-name="footer" extent="1cm"/>
				</fo:simple-page-master>
					
				</fo:layout-master-set>
				<!-- End definition of page layout -->
		
			<fo:page-sequence master-reference="page">
		
				<!-- COMMENCE HEADER -->
				
				<fo:static-content flow-name="header">
					<fo:block font-size="12pt" text-align-last="center">
						<xsl:value-of select="$stringParam"/>
					</fo:block>
				</fo:static-content>
				<!-- END HEADER  -->
			
				<!-- COMMENCE FOOTER -->
				
				<fo:static-content flow-name="footer">
					<fo:block font-size="12pt" text-align="center">
						<xsl:value-of select="$boolParam"/>
					</fo:block>
				</fo:static-content>
				<!-- END FOOTER  -->
					
				<fo:flow flow-name="xsl-region-body">
					<fo:block font-size="12pt">
						Q:<xsl:text> </xsl:text><xsl:value-of select="."/><xsl:text> </xsl:text>A: <xsl:text> </xsl:text><xsl:value-of select="$intParam"/>
					</fo:block>
				</fo:flow>
			</fo:page-sequence>
	    </fo:root>
	</xsl:template>
	
</xsl:stylesheet>