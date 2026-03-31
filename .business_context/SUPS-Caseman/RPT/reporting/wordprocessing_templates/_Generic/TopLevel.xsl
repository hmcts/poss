<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:supsfo="http://eds.com/supsfo" 
	exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan">
	<!-- ======================================== -->
	<!-- Linking in all the required stylesheets  -->
	<!-- ======================================== -->	
	<xsl:import href="@word.processing.url.xsl@formatAddress.xsl"/>
	<xsl:import href="@word.processing.url.xsl@formatCaseConversion.xsl"/>
	<xsl:import href="@word.processing.url.xsl@formatTextAreaText.xsl"/>
	<xsl:import href="@word.processing.url.xsl@formatDate.xsl"/>
	<xsl:import href="@word.processing.url.xsl@Addressee.xsl"/>
	<xsl:import href="@word.processing.url.xsl@EnterVariableText.xsl"/>
	<xsl:import href="@word.processing.url.xsl@formatDateOfBirth.xsl"/>
	<xsl:import href="@word.processing.url.xsl@manualDOB.xsl"/>
	
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<!-- ================================================================		
		Description: This xsl contains high level variables that are needed in some forms.
		eg. todays date.
		
		Other more specific variables related to specific forms should be created in the appropriate xsl.

		This stylesheets main purpose is two-fold:
		- 1: store variables 
		- 2: store (utility) templates 
		================================================================= -->
	<!-- 
			High Level Variables
	-->

	<xsl:variable name="datetoday">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/today) > 0">
				<xsl:call-template name="format-date">
					<xsl:with-param name="date-string-dd-MMM-yyyy"><xsl:value-of select="variabledata/today"/></xsl:with-param>		
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$emptyDate"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

</xsl:stylesheet>