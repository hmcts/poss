<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSPY v2004 rel. 4 U (http://www.xmlspy.com) by Frederik Vandendriessche (EDS UK East Sol Center) -->
<!-- =======================================================================
	 This Stylesheet formats dates.
	  ======================================================================= -->
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:ora="http://www.oracle.com/XSL/Transform/java"
	exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan" >

<xsl:variable name="emptyDate">
		<xsl:text>___/___/______</xsl:text>
	</xsl:variable>
	<xsl:variable name="emptyTime">
		<xsl:text>______</xsl:text>
	</xsl:variable>

	<xsl:template name="format-seconds-as-hh-mm">
		<xsl:param name="seconds"/>
		<xsl:call-template name="leading-zero">
			<xsl:with-param name="number">
				<xsl:value-of select="floor($seconds div 3600)"/>
			</xsl:with-param>
		</xsl:call-template>:<xsl:call-template name="leading-zero">
			<xsl:with-param name="number">
				<xsl:value-of select="floor(($seconds div 3600) mod 60)"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="format-seconds-as-hh-mm-ss">
		<xsl:param name="seconds"/>
		<xsl:call-template name="leading-zero">
			<xsl:with-param name="number">
				<xsl:value-of select="floor($seconds div 3600)"/>
			</xsl:with-param>
		</xsl:call-template>:<xsl:call-template name="leading-zero">
			<xsl:with-param name="number">
				<xsl:value-of select="floor(($seconds div 3600) mod 60)"/>
			</xsl:with-param>
		</xsl:call-template>:<xsl:call-template name="leading-zero">
			<xsl:with-param name="number">
				<xsl:value-of select="floor($seconds mod 60)"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="leading-zero">
		<xsl:param name="number"/>
		<xsl:if test="string-length($number) = 1">0</xsl:if><xsl:value-of select="$number"/>
	</xsl:template>


	<xsl:template name="format-time">
		<xsl:param name="theTime"/>
		<xsl:value-of select="$theTime"/>
	</xsl:template>

	<!-- format-date -->
	<!-- - returns a date in the form d MMMM yyyy given the dd-MMM-yyyy format -->
	<!-- -->
	<xsl:template name="format-date">
		<xsl:param name="date-string-dd-MMM-yyyy"/>
		<!-- Strip off the day before the first hyphen -->
		<xsl:variable name="day">
			<xsl:value-of select="substring-before($date-string-dd-MMM-yyyy, '-')"/>
		</xsl:variable>
		<!-- Strip out the month between the hyphens and call the template to get the full name -->
		<xsl:variable name="month">
			<xsl:call-template name="format-month-name">
				<xsl:with-param name="month-string-MMM" select="substring-before(substring-after($date-string-dd-MMM-yyyy, '-'), '-')"/>
			</xsl:call-template>
		</xsl:variable>
		<!-- Strip off the year after the last hyphen -->
		<xsl:variable name="year">
			<xsl:value-of select="substring-after(substring-after($date-string-dd-MMM-yyyy, '-'), '-')"/>
		</xsl:variable>
		<!-- Concatenate the day, month and year together, removing leading zeroes from the day by treating it as a number -->
		<xsl:value-of select="concat($day+0,' ',$month,' ',$year)"/>
	</xsl:template>
	<!-- -->
	<!-- format-month-name -->
	<!-- - returns the full month name (MMMM format) given the MMM format -->
	<!-- -->
	<xsl:template name="format-month-name">
		<xsl:param name="month-string-MMM"/>
		<!-- Match the upper or lower case version of the parameter and return the full name -->
		<xsl:choose>
			<xsl:when test="$month-string-MMM = 'JAN' or $month-string-MMM='Jan'">January</xsl:when>
			<xsl:when test="$month-string-MMM = 'FEB' or $month-string-MMM='Feb'">February</xsl:when>
			<xsl:when test="$month-string-MMM = 'MAR' or $month-string-MMM='Mar'">March</xsl:when>
			<xsl:when test="$month-string-MMM = 'APR' or $month-string-MMM='Apr'">April</xsl:when>
			<xsl:when test="$month-string-MMM = 'MAY' or $month-string-MMM='May'">May</xsl:when>
			<xsl:when test="$month-string-MMM = 'JUN' or $month-string-MMM='Jun'">June</xsl:when>
			<xsl:when test="$month-string-MMM = 'JUL' or $month-string-MMM='Jul'">July</xsl:when>
			<xsl:when test="$month-string-MMM = 'AUG' or $month-string-MMM='Aug'">August</xsl:when>
			<xsl:when test="$month-string-MMM = 'SEP' or $month-string-MMM='Sep'">September</xsl:when>
			<xsl:when test="$month-string-MMM = 'OCT' or $month-string-MMM='Oct'">October</xsl:when>
			<xsl:when test="$month-string-MMM = 'NOV' or $month-string-MMM='Nov'">November</xsl:when>
			<xsl:when test="$month-string-MMM = 'DEC' or $month-string-MMM='Dec'">December</xsl:when>
			<xsl:otherwise>error: <xsl:value-of select="$month-string-MMM"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="format-week-name">
		<xsl:param name="week-string-WWW"/>
		<xsl:choose>
			<xsl:when test="$week-string-WWW = 'MON' or $week-string-WWW='Mon'">Monday</xsl:when>
			<xsl:when test="$week-string-WWW = 'TUE' or $week-string-WWW='Tue'">Tuesday</xsl:when>
			<xsl:when test="$week-string-WWW = 'WED' or $week-string-WWW='Wed'">Wednesday</xsl:when>
			<xsl:when test="$week-string-WWW = 'THU' or $week-string-WWW='Thu'">Thursday</xsl:when>
			<xsl:when test="$week-string-WWW = 'FRI' or $week-string-WWW='Fri'">Friday</xsl:when>
			<xsl:when test="$week-string-WWW = 'SAT' or $week-string-WWW='Sat'">Saturday</xsl:when>
			<xsl:when test="$week-string-WWW = 'SUN' or $week-string-WWW='Sun'">Sunday</xsl:when>
			<xsl:otherwise>error: <xsl:value-of select="$week-string-WWW"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	

	<!---
		Reoccuring function on EnterVariableText.xsl 
		This template formats the date correctly and returns an emptyDate when the date hasn't been populated.
	-->
	<xsl:template name="format-date-placeholder">

		<xsl:param name="date-xpath"/>

			<xsl:choose>
				<xsl:when test="string-length($date-xpath) > 0">
					<xsl:call-template name="format-date">
						<xsl:with-param name="date-string-dd-MMM-yyyy">
							<xsl:value-of select="$date-xpath"/>
						</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$emptyDate"/>
				</xsl:otherwise>
			</xsl:choose>
			
	</xsl:template>	
</xsl:stylesheet>

