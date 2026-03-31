<?xml version="1.0" encoding="UTF-8"?>
<!--

Copyright Antenna House, Inc. (http://www.antennahouse.com) 2001, 2002.

Since this stylesheet is originally developed by Antenna House to be used with XSL Formatter, it may not be compatible with another XSL-FO processors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, provided that the above copyright notice(s) and this permission notice appear in all copies of the Software and that both the above copyright notice(s) and this permission notice appear in supporting documentation.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Change History:
03/09/2010	Chris Vincent - Uncommented <xsl:template match="div[ancestor::ol] | div[ancestor::ul]"> to fix Trac 1733

-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml" xmlns:xalan="http://xml.apache.org/xalan" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:sl="http://schemas.microsoft.com/schemaLibrary/2003/core" xmlns:aml="http://schemas.microsoft.com/aml/2001/core" xmlns:wx="http://schemas.microsoft.com/office/word/2003/auxHint" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:st1="urn:schemas-microsoft-com:office:smarttags" exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan">
	<xsl:output method="xml" encoding="UTF-8"/>
	<xsl:variable name="font-size-lookup">
		<found value="1">9pt</found>
		<found value="2">10pt</found>
		<found value="3">11pt</found>
		<found value="4">12pt</found>
		<found value="5">13pt</found>
		<found value="6">14pt</found>
		<found value="7">15pt</found>
	</xsl:variable>
	<!--======================================================================
      Parameters
  =======================================================================-->
	<!-- page size -->
	<xsl:param name="page-height">29.7cm</xsl:param>
	<xsl:param name="page-width">21.0cm</xsl:param>
	<xsl:param name="page-margin-top">0.25in</xsl:param>
	<xsl:param name="page-margin-bottom">0.25in</xsl:param>
	<xsl:param name="page-margin-left">0.75in</xsl:param>
	<xsl:param name="page-margin-right">0.75in</xsl:param>
	<!-- page header and footer -->
	<xsl:param name="page-header-margin">0.5in</xsl:param>
	<xsl:param name="page-footer-margin">0.5in</xsl:param>
	<xsl:param name="title-print-in-header">false</xsl:param>
	<xsl:param name="page-number-print-in-footer">true</xsl:param>
	<!-- multi column -->
	<xsl:param name="column-count">1</xsl:param>
	<xsl:param name="column-gap">12pt</xsl:param>
	<!-- writing-mode: lr-tb | rl-tb | tb-rl -->
	<xsl:param name="writing-mode">lr-tb</xsl:param>
	<!-- text-align: justify | start -->
	<xsl:param name="text-align">start</xsl:param>
	<!-- hyphenate: true | false -->
	<xsl:param name="hyphenate">false</xsl:param>
	<!--======================================================================
      Attribute Sets
  =======================================================================-->
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Root
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:attribute-set name="root">
		<xsl:attribute name="writing-mode"><xsl:value-of select="$writing-mode"/></xsl:attribute>
		<xsl:attribute name="hyphenate"><xsl:value-of select="$hyphenate"/></xsl:attribute>
		<xsl:attribute name="text-align"><xsl:value-of select="$text-align"/></xsl:attribute>
		<!-- specified on fo:root to change the properties' initial values -->
	</xsl:attribute-set>
	<xsl:attribute-set name="page">
		<xsl:attribute name="page-width"><xsl:value-of select="$page-width"/></xsl:attribute>
		<xsl:attribute name="page-height"><xsl:value-of select="$page-height"/></xsl:attribute>
		<!-- specified on fo:simple-page-master -->
	</xsl:attribute-set>
	<xsl:attribute-set name="body">
		<!-- specified on fo:flow's only child fo:block -->
	</xsl:attribute-set>
	<xsl:attribute-set name="page-header">
		<!-- specified on (page-header)fo:static-content's only child fo:block -->
		<xsl:attribute name="font-size">small</xsl:attribute>
		<xsl:attribute name="text-align">center</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="page-footer">
		<!-- specified on (page-footer)fo:static-content's only child fo:block -->
		<xsl:attribute name="font-size">small</xsl:attribute>
		<xsl:attribute name="text-align">center</xsl:attribute>
	</xsl:attribute-set>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Block-level
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:attribute-set name="h1">
		<xsl:attribute name="font-size">2em</xsl:attribute>
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="space-before">0.67em</xsl:attribute>
		<xsl:attribute name="space-after">0.67em</xsl:attribute>
		<xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
		<xsl:attribute name="keep-together.within-column">always</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="h2">
		<xsl:attribute name="font-size">1.5em</xsl:attribute>
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="space-before">0.83em</xsl:attribute>
		<xsl:attribute name="space-after">0.83em</xsl:attribute>
		<xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
		<xsl:attribute name="keep-together.within-column">always</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="h3">
		<xsl:attribute name="font-size">1.17em</xsl:attribute>
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="space-before">1em</xsl:attribute>
		<xsl:attribute name="space-after">1em</xsl:attribute>
		<xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
		<xsl:attribute name="keep-together.within-column">always</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="h4">
		<xsl:attribute name="font-size">1em</xsl:attribute>
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="space-before">1.17em</xsl:attribute>
		<xsl:attribute name="space-after">1.17em</xsl:attribute>
		<xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
		<xsl:attribute name="keep-together.within-column">always</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="h5">
		<xsl:attribute name="font-size">0.83em</xsl:attribute>
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="space-before">1.33em</xsl:attribute>
		<xsl:attribute name="space-after">1.33em</xsl:attribute>
		<xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
		<xsl:attribute name="keep-together.within-column">always</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="h6">
		<xsl:attribute name="font-size">0.67em</xsl:attribute>
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="space-before">1.67em</xsl:attribute>
		<xsl:attribute name="space-after">1.67em</xsl:attribute>
		<xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
		<xsl:attribute name="keep-together.within-column">always</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="p">
		<!--  Chnaged from 3em to 1mm for N26 test -->
		<xsl:attribute name="space-before">1mm</xsl:attribute>
		<xsl:attribute name="space-after">1mm</xsl:attribute>
		<!-- e.g.,
    <xsl:attribute name="text-indent">1em</xsl:attribute>
    -->
	</xsl:attribute-set>
	<xsl:attribute-set name="p-initial" use-attribute-sets="p">
		<!-- initial paragraph, preceded by h1..6 or div -->
		<!-- e.g.,
    <xsl:attribute name="text-indent">0em</xsl:attribute>
    -->
	</xsl:attribute-set>
	<xsl:attribute-set name="p-initial-first" use-attribute-sets="p-initial">
		<!-- initial paragraph, first child of div, body or td -->
	</xsl:attribute-set>
	<xsl:attribute-set name="blockquote">
		<xsl:attribute name="start-indent">inherited-property-value(start-indent) + 24pt</xsl:attribute>
		<xsl:attribute name="end-indent">inherited-property-value(end-indent) + 24pt</xsl:attribute>
		<xsl:attribute name="space-before">1em</xsl:attribute>
		<xsl:attribute name="space-after">1em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="pre">
		<xsl:attribute name="font-size">0.83em</xsl:attribute>
		<xsl:attribute name="font-family">monospace</xsl:attribute>
		<xsl:attribute name="white-space">pre</xsl:attribute>
		<xsl:attribute name="space-before">1em</xsl:attribute>
		<xsl:attribute name="space-after">1em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="address">
		<xsl:attribute name="font-style">italic</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="hr">
		<xsl:attribute name="border">1px inset</xsl:attribute>
		<xsl:attribute name="space-before">0.67em</xsl:attribute>
		<xsl:attribute name="space-after">0.67em</xsl:attribute>
	</xsl:attribute-set>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       List
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:attribute-set name="ul">
		<xsl:attribute name="space-before">5mm</xsl:attribute>
		<xsl:attribute name="space-after">1em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="ul-nested">
		<xsl:attribute name="space-before">0pt</xsl:attribute>
		<xsl:attribute name="space-after">0pt</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="ol">
		<!--<xsl:attribute name="space-before">1em</xsl:attribute>
		<xsl:attribute name="space-after">1em</xsl:attribute>-->
		<xsl:attribute name="space-before">5mm</xsl:attribute>
		<xsl:attribute name="space-after">1mm</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="ol-nested">
		<xsl:attribute name="space-before">0pt</xsl:attribute>
		<xsl:attribute name="space-after">0pt</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="ul-li">
		<!-- for (unordered)fo:list-item -->
		<xsl:attribute name="relative-align">baseline</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="ol-li">
		<!-- for (ordered)fo:list-item -->
		<xsl:attribute name="relative-align">baseline</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="dl">
		<xsl:attribute name="space-before">1em</xsl:attribute>
		<xsl:attribute name="space-after">1em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="dt">
		<xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
		<xsl:attribute name="keep-together.within-column">always</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="dd">
		<xsl:attribute name="start-indent">inherited-property-value(start-indent) + 24pt</xsl:attribute>
	</xsl:attribute-set>
	<!-- list-item-label format for each nesting level -->
	<xsl:param name="ul-label-1">&#x2022;</xsl:param>
	<xsl:attribute-set name="ul-label-1">
		<xsl:attribute name="font-size">1em</xsl:attribute>
		<xsl:attribute name="font-family">serif</xsl:attribute>
	</xsl:attribute-set>
	<xsl:param name="ul-label-2">o</xsl:param>
	<xsl:attribute-set name="ul-label-2">
		<xsl:attribute name="font-size">0.67em</xsl:attribute>
		<xsl:attribute name="font-family">monospace</xsl:attribute>
		<xsl:attribute name="baseline-shift">0.25em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:param name="ul-label-3">&#x25A0;</xsl:param>
	<xsl:attribute-set name="ul-label-3">
		<xsl:attribute name="font-size">0.4em</xsl:attribute>
		<xsl:attribute name="font-family">ZapfDingbats</xsl:attribute>
		<xsl:attribute name="baseline-shift">0.05em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:param name="ul-label-4">&#x25A0;</xsl:param>
	<xsl:attribute-set name="ul-label-4">
		<xsl:attribute name="font-size">0.4em</xsl:attribute>
		<xsl:attribute name="font-family">ZapfDingbats</xsl:attribute>
		<xsl:attribute name="baseline-shift">0.05em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:param name="ul-label-5">&#x25A0;</xsl:param>
	<xsl:attribute-set name="ul-label-5">
		<xsl:attribute name="font-size">0.4em</xsl:attribute>
		<xsl:attribute name="font-family">ZapfDingbats</xsl:attribute>
		<xsl:attribute name="baseline-shift">0.05em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:param name="ul-label-6">&#x25A0;</xsl:param>
	<xsl:attribute-set name="ul-label-6">
		<xsl:attribute name="font-size">0.4em</xsl:attribute>
		<xsl:attribute name="font-family">ZapfDingbats</xsl:attribute>
		<xsl:attribute name="baseline-shift">0.05em</xsl:attribute>
	</xsl:attribute-set>
	<!--<xsl:param name="ul-label-4">&#x2022;</xsl:param>
	<xsl:attribute-set name="ul-label-1">
		<xsl:attribute name="font-size">1em</xsl:attribute>
		<xsl:attribute name="font-family">serif</xsl:attribute>
	</xsl:attribute-set>
	<xsl:param name="ul-label-5">o</xsl:param>
	<xsl:attribute-set name="ul-label-2">
		<xsl:attribute name="font-size">0.67em</xsl:attribute>
		<xsl:attribute name="font-family">monospace</xsl:attribute>
		<xsl:attribute name="baseline-shift">0.25em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:param name="ul-label-6">-</xsl:param>
	<xsl:attribute-set name="ul-label-3">
		<xsl:attribute name="font-size">0.9em</xsl:attribute>
		<xsl:attribute name="font-family">sans-serif</xsl:attribute>
		<xsl:attribute name="text-decoration">bold</xsl:attribute>
		<xsl:attribute name="baseline-shift">0.05em</xsl:attribute>
	</xsl:attribute-set>-->
	<xsl:param name="ol-label-1">1.</xsl:param>
	<xsl:attribute-set name="ol-label-1"/>
	<xsl:param name="ol-label-2">1.</xsl:param>
	<xsl:attribute-set name="ol-label-2"/>
	<xsl:param name="ol-label-3">1.</xsl:param>
	<xsl:attribute-set name="ol-label-3"/>
	<xsl:param name="ol-label-4">1.</xsl:param>
	<xsl:attribute-set name="ol-label-1"/>
	<xsl:param name="ol-label-5">1.</xsl:param>
	<xsl:attribute-set name="ol-label-2"/>
	<xsl:param name="ol-label-6">1.</xsl:param>
	<xsl:attribute-set name="ol-label-3"/>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Table
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:attribute-set name="inside-table">
		<!-- prevent unwanted inheritance -->
		<xsl:attribute name="start-indent">0pt</xsl:attribute>
		<xsl:attribute name="end-indent">0pt</xsl:attribute>
		<xsl:attribute name="text-indent">0pt</xsl:attribute>
		<xsl:attribute name="last-line-end-indent">0pt</xsl:attribute>
		<xsl:attribute name="text-align">start</xsl:attribute>
		<xsl:attribute name="text-align-last">relative</xsl:attribute>
	</xsl:attribute-set>

	<xsl:attribute-set name="table">
		<xsl:attribute name="border-collapse">separate</xsl:attribute>
		<xsl:attribute name="border-spacing">2px</xsl:attribute>
		<xsl:attribute name="border">1px</xsl:attribute>
		<!--
    <xsl:attribute name="border-style">outset</xsl:attribute>
    -->
	</xsl:attribute-set>
	<xsl:attribute-set name="table-column">
  </xsl:attribute-set>
	<xsl:attribute-set name="thead" use-attribute-sets="inside-table">
  </xsl:attribute-set>
	<xsl:attribute-set name="tfoot" use-attribute-sets="inside-table">
  </xsl:attribute-set>
	<xsl:attribute-set name="tbody" use-attribute-sets="inside-table">
  </xsl:attribute-set>
	<xsl:attribute-set name="tr">
  </xsl:attribute-set>
	<xsl:attribute-set name="th">
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="text-align">center</xsl:attribute>
		<xsl:attribute name="border">1px</xsl:attribute>
		<!--
    <xsl:attribute name="border-style">inset</xsl:attribute>
    -->
		<xsl:attribute name="padding">1px</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="td">
	<!-- 
		<xsl:attribute name="border">1px</xsl:attribute>
	    <xsl:attribute name="border-style">inset</xsl:attribute>
		<xsl:attribute name="padding">1px</xsl:attribute>
	 -->
	</xsl:attribute-set>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Inline-level
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:attribute-set name="b">
		<xsl:attribute name="font-weight">bold</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="strong">
		<xsl:attribute name="font-weight">bold</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="strong-em">
		<xsl:attribute name="font-weight">bold</xsl:attribute>
		<xsl:attribute name="font-style">italic</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="i">
		<xsl:attribute name="font-style">italic</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="cite">
		<xsl:attribute name="font-style">italic</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="em">
		<xsl:attribute name="font-style">italic</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="var">
		<xsl:attribute name="font-style">italic</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="dfn">
		<xsl:attribute name="font-style">italic</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="tt">
		<xsl:attribute name="font-family">monospace</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="code">
		<xsl:attribute name="font-family">monospace</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="kbd">
		<xsl:attribute name="font-family">monospace</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="samp">
		<xsl:attribute name="font-family">monospace</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="big">
		<xsl:attribute name="font-size">larger</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="small">
		<xsl:attribute name="font-size">smaller</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="sub">
		<xsl:attribute name="baseline-shift">sub</xsl:attribute>
		<xsl:attribute name="font-size">smaller</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="sup">
		<xsl:attribute name="baseline-shift">super</xsl:attribute>
		<xsl:attribute name="font-size">smaller</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="s">
		<xsl:attribute name="text-decoration">line-through</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="strike">
		<xsl:attribute name="text-decoration">line-through</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="del">
		<xsl:attribute name="text-decoration">line-through</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="u">
		<xsl:attribute name="text-decoration">underline</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="ins">
		<xsl:attribute name="text-decoration">underline</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="abbr">
		<!-- e.g.,
    <xsl:attribute name="font-variant">small-caps</xsl:attribute>
    <xsl:attribute name="letter-spacing">0.1em</xsl:attribute>
    -->
	</xsl:attribute-set>
	<xsl:attribute-set name="acronym">
		<!-- e.g.,
    <xsl:attribute name="font-variant">small-caps</xsl:attribute>
    <xsl:attribute name="letter-spacing">0.1em</xsl:attribute>
    -->
	</xsl:attribute-set>
	<xsl:attribute-set name="q"/>
	<xsl:attribute-set name="q-nested"/>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Image
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:attribute-set name="img">
  </xsl:attribute-set>
	<xsl:attribute-set name="img-link">
		<xsl:attribute name="border">2px solid</xsl:attribute>
	</xsl:attribute-set>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Link
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:attribute-set name="a-link">
		<xsl:attribute name="text-decoration">underline</xsl:attribute>
		<xsl:attribute name="color">blue</xsl:attribute>
	</xsl:attribute-set>
	<!--======================================================================
      Templates
  =======================================================================-->
	<xsl:template match="head | script"/>
	<xsl:template match="@*[starts-with(local-name(), 'mso-')]"/>
	<!-- ignore MS Word generated attributes (cross fingers!)-->
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
   process common attributes and children
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template name="process-common-attributes-and-children">
		<xsl:call-template name="process-common-attributes"/>
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template name="process-common-attributes">
		<xsl:attribute name="role"><xsl:value-of select="concat('', local-name())"/></xsl:attribute>
		<xsl:apply-templates select="@*[starts-with(local-name(), 'mso-')]"/>
		<xsl:choose>
			<xsl:when test="@xml:lang">
				<xsl:attribute name="xml:lang"><xsl:value-of select="@xml:lang"/></xsl:attribute>
			</xsl:when>
			<xsl:when test="@lang">
				<xsl:attribute name="xml:lang"><xsl:value-of select="@lang"/></xsl:attribute>
			</xsl:when>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="@id">
				<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
			</xsl:when>
			<xsl:when test="self::a/@name">
				<xsl:attribute name="id"><xsl:value-of select="@name"/></xsl:attribute>
			</xsl:when>
		</xsl:choose>
		<xsl:if test="@align">
			<xsl:choose>
				<xsl:when test="self::caption"/>
				<xsl:when test="self::img or self::object">
					<xsl:if test="@align = 'bottom' or @align = 'middle' or @align = 'top'">
						<xsl:attribute name="vertical-align"><xsl:value-of select="@align"/></xsl:attribute>
					</xsl:if>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="process-cell-align">
						<xsl:with-param name="align" select="@align"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
		<xsl:if test="@height">
			<xsl:attribute name="height">
				<xsl:value-of select="@height"/>
			</xsl:attribute>
		</xsl:if>
		<xsl:if test="@width">
			<xsl:attribute name="width">
				<xsl:value-of select="@width"/>
			</xsl:attribute>
		</xsl:if>
		<xsl:if test="@valign">
			<xsl:call-template name="process-cell-valign">
				<xsl:with-param name="valign" select="@valign"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@style">
			<xsl:call-template name="process-style">
				<xsl:with-param name="style" select="translate(@style,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@MARGIN">
			<xsl:call-template name="process-MARGIN">
				<xsl:with-param name="MARGIN" select="@MARGIN"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@FONT-FAMILY">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@FONT-FAMILY"/>
				<xsl:with-param name="UPPERNAME">font-family</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@FONT-SIZE">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@FONT-SIZE"/>
				<xsl:with-param name="UPPERNAME">font-size</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@TEXT-DECORATION">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@TEXT-DECORATION"/>
				<xsl:with-param name="UPPERNAME">text-decoration</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@TEXT-INDENT">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@TEXT-INDENT"/>
				<xsl:with-param name="UPPERNAME">text-indent</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@TEXT-ALIGN">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@TEXT-ALIGN"/>
				<xsl:with-param name="UPPERNAME">text-align</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@LINE-HEIGHT">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@LINE-HEIGHT"/>
				<xsl:with-param name="UPPERNAME">line-height</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@FONT">
			<xsl:call-template name="process-FONT">
				<xsl:with-param name="FONT" select="@FONT"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@HEIGHT">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@HEIGHT"/>
				<xsl:with-param name="UPPERNAME">height</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@WIDTH">
			<xsl:call-template name="process-UPPERCASE">
				<xsl:with-param name="UPPERVALUE" select="@WIDTH"/>
				<xsl:with-param name="UPPERNAME">width</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		
	</xsl:template>	
	<xsl:template name="process-MARGIN">
		<xsl:param name="MARGIN"/>
		<xsl:for-each select="xalan:tokenize(normalize-space($MARGIN), ' ' )">
			<xsl:variable name="pos" select="position()"/>
			<xsl:choose>
				<xsl:when test="$pos='1'">
					<xsl:attribute name="margin-top"><xsl:value-of select="."/></xsl:attribute>
				</xsl:when>
				<xsl:when test="$pos='2'">
					<xsl:attribute name="margin-right"><xsl:value-of select="."/></xsl:attribute>
				</xsl:when>
				<xsl:when test="$pos='3'">
					<xsl:attribute name="margin-bottom"><xsl:value-of select="."/></xsl:attribute>
				</xsl:when>
				<xsl:when test="$pos='4'">
					<xsl:attribute name="margin-left"><xsl:value-of select="."/></xsl:attribute>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>
	<xsl:template name="process-UPPERCASE">
		<xsl:param name="UPPERVALUE"/>
		<xsl:param name="UPPERNAME"/>
		<xsl:attribute name="{translate($UPPERNAME,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')}"><xsl:value-of select="$UPPERVALUE"/></xsl:attribute>
	</xsl:template>
	<xsl:template name="process-LIST-STYLE-TYPE">
  </xsl:template>
	<!-- old version  <xsl:template name="process-FONT">
      <xsl:param name="FONT"/>
  
     <xsl:variable name="typeface">
     <faces>
        <face>Arial</face>
        <face>Helvetica</face>
        <face>Times New Roman</face>
        <face>serif</face>
        <face>sans-serif</face>
        <face>monospaced</face>
      </faces>
     </xsl:variable>
      
     <xsl:variable name="arg1"><xsl:value-of select="normalize-space(substring-before($FONT, ' '))"/></xsl:variable>
     <xsl:variable name="arg2"><xsl:value-of select="normalize-space(substring-after($FONT, ' '))"/></xsl:variable>
	arg1 <xsl:value-of select="$arg1"></xsl:value-of>
	arg2 <xsl:value-of select="$arg2"></xsl:value-of>
      <xsl:choose>
        <xsl:when test="xalan:nodeset($typeface)/faces/face[text()=arg1]">
          <xsl:attribute name="font-family"><xsl:value-of select="$arg1"/></xsl:attribute>
          <xsl:if test="string-length($arg2) &gt; 0">
            <xsl:attribute name="font-size"><xsl:value-of select="$arg2"/></xsl:attribute>
          </xsl:if>
        </xsl:when>
       
        <xsl:when test="xalan:nodeset($typeface)/faces/face[text()=$arg2]">
          <xsl:attribute name="font-family"><xsl:value-of select="$arg2"/></xsl:attribute>
          <xsl:if test="string-length($arg1) &gt; 0">
            <xsl:attribute name="font-size"><xsl:value-of select="$arg1"/></xsl:attribute>
          </xsl:if>
        </xsl:when>
       
      </xsl:choose>
  </xsl:template> -->
	<xsl:template name="process-FONT">
		<xsl:param name="FONT"/>
		<!-- capture first two args don't know which order they will be in font size will end in pt and font will be in ""-->
		<xsl:variable name="arg1">
			<xsl:value-of select="normalize-space(substring-before($FONT, ' '))"/>
		</xsl:variable>
		<xsl:variable name="arg2">
			<xsl:value-of select="normalize-space(substring-after($FONT, ' '))"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="contains($arg1,'pt')">
				<xsl:attribute name="font-size"><xsl:value-of select="$arg1"/></xsl:attribute>
				<xsl:if test="string-length($arg2) &gt; 0">
					<xsl:attribute name="font-family"><xsl:call-template name="stripQuotes"><xsl:with-param name="value" select="$arg2"/></xsl:call-template></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="contains($arg2,'pt')">
				<xsl:attribute name="font-family"><xsl:call-template name="stripQuotes"><xsl:with-param name="value" select="$arg1"/></xsl:call-template></xsl:attribute>
				<xsl:attribute name="font-size"><xsl:value-of select="$arg2"/></xsl:attribute>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="stripQuotes">
		<xsl:param name="value"/>
		<xsl:choose>
			<xsl:when test="starts-with($value,'&quot;')">
				<xsl:value-of select="substring-before(substring-after($value,'&quot;'),'&quot;')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$value"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="process-style">
		<xsl:param name="style"/>
		<!-- e.g., style="text-align: center; color: red"
         converted to text-align="center" color="red" -->
		<xsl:variable name="name" select="normalize-space(substring-before($style, ':'))"/>
		<xsl:if test="$name and not(starts-with($name, 'mso-')) and not($name='tab-stops')">
			<xsl:variable name="value-and-rest" select="normalize-space(substring-after($style, ':'))"/>
			<xsl:variable name="value">
				<xsl:choose>
					<xsl:when test="contains($value-and-rest, ';')">
						<xsl:value-of select="normalize-space(substring-before($value-and-rest, ';'))"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$value-and-rest"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose>
				<!-- Filter out rubbish  and convert not so rubbish tags 
					when using Render-X. Apache FOP seems to happily ignore any attribute on an fo tag it does not recognise -->
				<xsl:when test="$name='MARGIN' or $name='margin' ">
					<xsl:call-template name="process-MARGIN">
						<xsl:with-param name="MARGIN" select="$value"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$name='MARGIN-TOP' or $name='margin-top' or
	                $name='MARGIN-LEFT' or $name='margin-left' or
	                $name='MARGIN-RIGHT' or $name='margin-right' or
	                $name='MARGIN-BOTTOM' or $name='margin-bottom' or
	                $name='WIDTH' or $name='width' or 
	                $name='BOTTOM' or $name='bottom' or 
	                $name='POSITION' or $name='position' or 
	                $name='COLOR' or $name='color' or 
	                $name='BACKGROUND' or $name='background' or
	                $name='FONT-FAMILY' or $name='font-family' or
	                $name='TEXT-DECORATION' or $name='text-decoration' or
	                $name='TEXT-INDENT' or $name='text-indent' or
	                $name='TEXT-ALIGN' or $name='text-align' or
	                $name='LINE-HEIGHT' or $name='line-height' or
	                $name='FONT-SIZE' or $name='font-size' or
	                $name='HEIGHT' or $name='height'">
	                <!--
					<xsl:call-template name="process-UPPERCASE">
						<xsl:with-param name="UPPERVALUE" select="$value"/>
						<xsl:with-param name="UPPERNAME" select="$name"/>
					</xsl:call-template>
					-->
					<!--
						Defect Resolution: When you insert information of more than one page to the editor, on the order layout the 
						addressbox page wasn't appearing. That was because the style in "div" tag was copied over as MARGIN-BOTTOM
						instead of SPACE-AFTER to the "fo:block" tag.
					-->
	                <xsl:choose>
						<xsl:when test="($name='MARGIN-BOTTOM' or $name='margin-bottom') and (local-name()='DIV' or local-name()='div')">
							<xsl:attribute name="space-after"><xsl:value-of select="$value"/></xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="process-UPPERCASE">
								<xsl:with-param name="UPPERVALUE" select="$value"/>
								<xsl:with-param name="UPPERNAME" select="$name"/>
							</xsl:call-template>						
						</xsl:otherwise>
					</xsl:choose>					
				</xsl:when>
				<xsl:when test="$name='LIST-STYLE-TYPE' or $name='list-style-type'">
					<xsl:call-template name="process-LIST-STYLE-TYPE"/>
				</xsl:when>
				<xsl:when test="$name='FONT' or $name='font'">
					<xsl:call-template name="process-FONT">
						<xsl:with-param name="FONT" select="$value"/>
					</xsl:call-template>
				</xsl:when>
				<!-- end of EDS filter stuff -->
				<xsl:when test="$name = 'width' and (self::col or self::colgroup)">
					<xsl:attribute name="column-width">
						<!-- conversion to cm -->
						<xsl:value-of select="$value * 0.02646"/>cm
						<!-- 
						<xsl:value-of select="$value"/>						
						 -->
					</xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'vertical-align' and (
                                 self::table or self::caption or
                                 self::thead or self::tfoot or
                                 self::tbody or self::colgroup or
                                 self::col or self::tr or
                                 self::th or self::td)">
					<xsl:choose>
						<xsl:when test="$value = 'top'">
							<xsl:attribute name="display-align">before</xsl:attribute>
						</xsl:when>
						<xsl:when test="$value = 'bottom'">
							<xsl:attribute name="display-align">after</xsl:attribute>
						</xsl:when>
						<xsl:when test="$value = 'middle'">
							<xsl:attribute name="display-align">center</xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="display-align">auto</xsl:attribute>
							<xsl:attribute name="relative-align">baseline</xsl:attribute>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-TOP' or $name='border-top'">
					<xsl:attribute name="border-top"><xsl:value-of select="$value"/></xsl:attribute>						
				</xsl:when>
				<xsl:when test="$name = 'BORDER-TOP-COLOR' or $name='border-top-color'">
					<xsl:attribute name="border-before-color"><xsl:value-of select="$value"/></xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-TOP-STYLE' or $name='border-top-style'">
					<xsl:attribute name="border-before-style"><xsl:value-of select="$value"/></xsl:attribute>
					<xsl:attribute name="border-before-width">.1mm</xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-LEFT' or $name='border-left'">
					<xsl:attribute name="border-left"><xsl:value-of select="$value"/></xsl:attribute>						
				</xsl:when>
				<xsl:when test="$name = 'BORDER-LEFT-COLOR' or $name='border-left-color'">
					<xsl:attribute name="border-left-color"><xsl:value-of select="$value"/></xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-LEFT-STYLE' or $name='border-left-style'">
					<xsl:attribute name="border-left-style"><xsl:value-of select="$value"/></xsl:attribute>
					<xsl:attribute name="border-left-width">.1mm</xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-RIGHT' or $name='border-right'">
					<xsl:attribute name="border-right"><xsl:value-of select="$value"/></xsl:attribute>						
				</xsl:when>
				<xsl:when test="$name = 'BORDER-RIGHT-COLOR' or $name='border-right-color'">
					<xsl:attribute name="border-right-color"><xsl:value-of select="$value"/></xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-RIGHT-STYLE' or $name='border-right-style'">
					<xsl:attribute name="border-right-style"><xsl:value-of select="$value"/></xsl:attribute>
					<xsl:attribute name="border-right-width">.1mm</xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-BOTTOM' or $name='border-bottom'">
					<xsl:attribute name="border-bottom"><xsl:value-of select="$value"/></xsl:attribute>						
				</xsl:when>
				<xsl:when test="$name = 'BORDER-BOTTOM-COLOR' or $name='border-bottom-color'">
					<xsl:attribute name="border-after-color"><xsl:value-of select="$value"/></xsl:attribute>
				</xsl:when>
				<xsl:when test="$name = 'BORDER-BOTTOM-STYLE' or $name='border-bottom-style'">
					<xsl:attribute name="border-after-style"><xsl:value-of select="$value"/></xsl:attribute>
					<xsl:attribute name="border-after-width">.1mm</xsl:attribute>
				</xsl:when>
				<xsl:otherwise>
					<xsl:if test="$name=translate($name, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')">
						<xsl:attribute name="{$name}"><xsl:value-of select="$value"/></xsl:attribute>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
				

		</xsl:if>

		<xsl:variable name="rest" select="normalize-space(substring-after($style, ';'))"/>
		<xsl:if test="$rest">
			<xsl:call-template name="process-style">
				<xsl:with-param name="style" select="$rest"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Block-level
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template match="h1">
		<fo:block xsl:use-attribute-sets="h1">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="h2">
		<fo:block xsl:use-attribute-sets="h2">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="h3">
		<fo:block xsl:use-attribute-sets="h3">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="h4">
		<fo:block xsl:use-attribute-sets="h4">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="h5">
		<fo:block xsl:use-attribute-sets="h5">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="h6">
		<fo:block xsl:use-attribute-sets="h6">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="p">
		<fo:block xsl:use-attribute-sets="p">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<!-- initial paragraph, preceded by h1..6 or div -->
	<xsl:template match="p[preceding-sibling::*[1][
                       self::h1 or self::h2 or self::h3 or
                       self::h4 or self::h5 or self::h6 or
                       self::div]]">
		<fo:block xsl:use-attribute-sets="p-initial">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<!-- initial paragraph, first child of div, body or td -->
	<xsl:template match="p[not(preceding-sibling::*) and (
                       parent::div or parent::body or
                       parent::td)]">
		<fo:block xsl:use-attribute-sets="p-initial-first">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="blockquote">
		<fo:block xsl:use-attribute-sets="blockquote">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="pre">
		<fo:block xsl:use-attribute-sets="pre">
			<xsl:call-template name="process-pre"/>
		</fo:block>
	</xsl:template>
	<xsl:template name="process-pre">
		<xsl:call-template name="process-common-attributes"/>
		<!-- remove leading CR/LF/CRLF char -->
		<xsl:variable name="crlf">
			<xsl:text>&#xD;&#xA;</xsl:text>
		</xsl:variable>
		<xsl:variable name="lf">
			<xsl:text>&#xA;</xsl:text>
		</xsl:variable>
		<xsl:variable name="cr">
			<xsl:text>&#xD;</xsl:text>
		</xsl:variable>
		<xsl:for-each select="node()">
			<xsl:choose>
				<xsl:when test="position() = 1 and self::text()">
					<xsl:choose>
						<xsl:when test="starts-with(., $lf)">
							<xsl:value-of select="substring(., 2)"/>
						</xsl:when>
						<xsl:when test="starts-with(., $crlf)">
							<xsl:value-of select="substring(., 3)"/>
						</xsl:when>
						<xsl:when test="starts-with(., $cr)">
							<xsl:value-of select="substring(., 2)"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:apply-templates select="."/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates select="."/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>
	<xsl:template match="address">
		<fo:block xsl:use-attribute-sets="address">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="hr">
		<fo:block xsl:use-attribute-sets="hr">
			<xsl:call-template name="process-common-attributes"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="div[@class='part']"/>
	<xsl:template match="div[ancestor::ol] | div[ancestor::ul]">
		<fo:inline>
			<xsl:call-template name="process-common-attributes"/>
			<xsl:apply-templates/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="div">
		<!-- <xsl:if test="not(@class='part') and not(contains(@class,'tucs_footer'))"> -->
		<!-- <xsl:if test="not(@class='part')"> -->
		<!-- need fo:block-container? or normal fo:block -->
		<xsl:variable name="need-block-container">
			<xsl:call-template name="need-block-container"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$need-block-container = 'true'">
				<fo:block-container>
					<xsl:if test="@dir">
						<xsl:attribute name="writing-mode"><xsl:choose><xsl:when test="@dir = 'rtl'">rl-tb</xsl:when><xsl:otherwise>lr-tb</xsl:otherwise></xsl:choose></xsl:attribute>
					</xsl:if>
					<xsl:call-template name="process-common-attributes"/>
					<fo:block start-indent="0pt" end-indent="0pt">
						<xsl:apply-templates/>
					</fo:block>
				</fo:block-container>
			</xsl:when>
			<xsl:otherwise>
				<!-- normal block -->
				<fo:block role="otherwise">
					<xsl:call-template name="process-common-attributes"/>
					<xsl:apply-templates/>
				</fo:block>
			</xsl:otherwise>
		</xsl:choose>
		<!-- </xsl:if> -->
	</xsl:template>
	<xsl:template name="need-block-container">
		<xsl:choose>
			<xsl:when test="@dir">true</xsl:when>
			<xsl:when test="@style">
				<xsl:variable name="s" select="concat(';', translate(normalize-space(@style),
                                                    ' ', ''))"/>
				<xsl:choose>
					<xsl:when test="contains($s, ';width:') or
                          contains($s, ';height:') or
                          contains($s, ';position:absolute') or
                          contains($s, ';position:fixed') or
                          contains($s, ';writing-mode:')">true</xsl:when>
					<xsl:otherwise>false</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>false</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="center">
		<fo:block text-align="center">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="fieldset | form | dir | menu">
		<fo:block space-before="1em" space-after="1em">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       List
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template name="ulItem">
		<xsl:param name="type"/>
		<!--<xsl:message>type parameter of ulItem is <xsl:value-of select="$type"/></xsl:message>-->
		<fo:list-item>
			<fo:list-item-label end-indent="label-end()" text-align="end" wrap-option="no-wrap">
				<fo:block/>
			</fo:list-item-label>
			<fo:list-item-body start-indent="body-start()">
				<fo:block>
					<!-- need to look ahead for align attribute in div and add it to the block-->
					<xsl:if test="./div/@align">
						<!--<xsl:message>spotted align case</xsl:message>-->
						<xsl:attribute name="text-align"><xsl:value-of select="./div/@align"/></xsl:attribute>
					</xsl:if>
					<xsl:choose>
						<xsl:when test="$type='ol'">
							<!--<xsl:message>ol type in ulItem</xsl:message>-->
							<fo:list-block xsl:use-attribute-sets="ol">
								<xsl:call-template name="process-common-attributes-and-children"/>
							</fo:list-block>
						</xsl:when>
						<xsl:otherwise>
							<!--<xsl:message>ul type in ulItem</xsl:message>-->
							<fo:list-block xsl:use-attribute-sets="ul">
								<xsl:call-template name="process-common-attributes-and-children"/>
							</fo:list-block>
						</xsl:otherwise>
					</xsl:choose>
				</fo:block>
			</fo:list-item-body>
		</fo:list-item>
	</xsl:template>
	<xsl:template match="ul">
		<!--<xsl:message>ancestor[1] of ul is <xsl:value-of select="local-name(./ancestor::*[1])"/></xsl:message>-->
		<xsl:choose>
			<!-- special case of preceding sibiling is li want to ignore this case-->
			<xsl:when test="(local-name(./preceding-sibling::*[1])='li')">
				<!--<xsl:message>preceding sibiling is li</xsl:message>-->
			</xsl:when>
			<!--  child of li -->
			<xsl:when test="(local-name(./ancestor::*[1])='li') ">
				<!--<xsl:message>parent is li</xsl:message>-->
				<fo:list-block xsl:use-attribute-sets="ul">
					<xsl:apply-templates/>
				</fo:list-block>
			</xsl:when>
			<!--nested case -->
			<xsl:when test="(local-name(./ancestor::*[1])='ol') ">
				<!--<xsl:message>nested level ul in ol</xsl:message>-->
					<xsl:call-template name="ulItem">
						<xsl:with-param name="type" select="'ol'"/>
					</xsl:call-template>
			</xsl:when>
			<xsl:when test="(local-name(./ancestor::*[1])='ul')  ">
				<!--<xsl:message>nested level ul in ul</xsl:message>-->
					<xsl:call-template name="ulItem">
						<xsl:with-param name="type" select="'ul'"/>
					</xsl:call-template>
			</xsl:when>
			<!-- if first ul, i.e. no parent is ul or ol-->
			<xsl:otherwise>
				<!--<xsl:message>top level ul</xsl:message>-->
				<fo:list-block xsl:use-attribute-sets="ul">
					<xsl:call-template name="process-common-attributes-and-children"/>
				</fo:list-block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="ol">
		<!--<xsl:message>ancestor[1] of ol is <xsl:value-of select="local-name(./ancestor::*[1])"/></xsl:message>-->
		<xsl:choose>
			<!-- special case of preceding sibiling is li want to ignore this case-->
			<xsl:when test="(local-name(./preceding-sibling::*[1])='li')">
				<!--<xsl:message>preceding sibiling is li</xsl:message>-->
			</xsl:when>
			<!--  child of li -->
			<xsl:when test="(local-name(./ancestor::*[1])='li') ">
				<!--<xsl:message>parent is li</xsl:message>-->
				<fo:list-block xsl:use-attribute-sets="ol">
					<xsl:apply-templates/>
				</fo:list-block>
			</xsl:when>
			<!--nested case -->
			<xsl:when test="(local-name(./ancestor::*[1])='ol')">
				<!--<xsl:message>nested level ol in ol</xsl:message>-->
					<xsl:call-template name="ulItem">
						<xsl:with-param name="type" select="'ol'"/>
					</xsl:call-template>
			</xsl:when>
			<xsl:when test="(local-name(./ancestor::*[1])='ul')  ">
				<!--<xsl:message>nested level ol in ul</xsl:message>-->
					<xsl:call-template name="ulItem">
						<xsl:with-param name="type" select="'ul'"/>
					</xsl:call-template>
			</xsl:when>
			<!-- if first ul, i.e. no parent is ul or ol-->
			<xsl:otherwise>
				<!--<xsl:message>top level ol</xsl:message>-->
				<fo:list-block xsl:use-attribute-sets="ol">
					<xsl:call-template name="process-common-attributes-and-children"/>
				</fo:list-block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="li">
		<!-- if has align value then need to put label inside body-->
		<!--<xsl:message>in li</xsl:message>-->
		<xsl:choose>
			<xsl:when test="./div/@align='right' or ./div/@align='center'">
				<!--<xsl:message>spotted in li align to do</xsl:message>-->
				<fo:list-item>
					<fo:list-item-label end-indent="label-end()">
						<fo:block/>
					</fo:list-item-label>
					<fo:list-item-body start-indent="body-start()">
						<fo:block>
							<xsl:attribute name="text-align"><xsl:value-of select="./div/@align"/></xsl:attribute>
							<xsl:choose>
								<xsl:when test="(local-name(..)='ul')">
									<xsl:call-template name="ulListItemLabelString"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:call-template name="olListItemLabelString"/>
								</xsl:otherwise>
							</xsl:choose>
							<!--<fo:leader leader-length="1em" keep-with-previous.within-line="always" keep-with-next.within-line="always"/>-->
							&#160;
							<xsl:call-template name="listItemBodyString"/>
						</fo:block>
					</fo:list-item-body>
				</fo:list-item>
			</xsl:when>
			<xsl:otherwise>
				<fo:list-item xsl:use-attribute-sets="ol-li">
					<xsl:choose>
						<!-- if ul parent -->
						<xsl:when test="(local-name(..)='ul')">
							<!--<xsl:call-template name="process-common-attributes"/>-->
							<fo:list-item-label end-indent="label-end()" text-align="end" wrap-option="no-wrap">
								<fo:block>
									<xsl:call-template name="ulListItemLabelString"/>
								</fo:block>
							</fo:list-item-label>
						</xsl:when>
						<!-- otherwise ol parent -->
						<xsl:when test="(local-name(..)='ol')">
							<!--<xsl:call-template name="process-common-attributes"/>-->
							<fo:list-item-label end-indent="label-end()" text-align="end" wrap-option="no-wrap">
								<fo:block>
									<xsl:call-template name="olListItemLabelString"/>
								</fo:block>
							</fo:list-item-label>
						</xsl:when>
						<xsl:otherwise>
							<!--<xsl:message>shouldn't be here</xsl:message>-->
						</xsl:otherwise>
					</xsl:choose>
					<fo:list-item-body start-indent="body-start()">
						<fo:block>
							<xsl:call-template name="listItemBodyString"/>
						</fo:block>
					</fo:list-item-body>
				</fo:list-item>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="ulListItemLabelString">
				<!--<xsl:message>ul list item label</xsl:message>-->
		<xsl:variable name="depth" select="count(ancestor::ul)"/>
		<xsl:choose>
			<xsl:when test="$depth = 1">
				<fo:inline xsl:use-attribute-sets="ul-label-1">
					<xsl:value-of select="$ul-label-1"/>
				</fo:inline>
			</xsl:when>
			<xsl:when test="$depth = 2">
				<fo:inline xsl:use-attribute-sets="ul-label-2">
					<xsl:value-of select="$ul-label-2"/>
				</fo:inline>
			</xsl:when>
			<xsl:when test="$depth = 3">
				<fo:inline xsl:use-attribute-sets="ul-label-3">
					<xsl:value-of select="$ul-label-3"/>
				</fo:inline>
			</xsl:when>
			<xsl:when test="$depth = 4">
				<fo:inline xsl:use-attribute-sets="ul-label-4">
					<xsl:value-of select="$ul-label-4"/>
				</fo:inline>
			</xsl:when>
			<xsl:when test="$depth = 5">
				<fo:inline xsl:use-attribute-sets="ul-label-5">
					<xsl:value-of select="$ul-label-5"/>
				</fo:inline>
			</xsl:when>
			<xsl:otherwise>
				<fo:inline xsl:use-attribute-sets="ul-label-6">
					<xsl:value-of select="$ul-label-6"/>
				</fo:inline>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="olListItemLabelString">
        <xsl:variable name="listCounter">
            <xsl:choose>
                <xsl:when test="parent::ol/@start">
                    <xsl:value-of select="parent::ol/@start - 1"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="0"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="listCounter"><xsl:value-of select="$listCounter + count(preceding-sibling::li) + 1"/></xsl:variable>
				<!--<xsl:message>ol list item label</xsl:message>-->
		<xsl:choose>
			<xsl:when test="contains(translate(ancestor::ol[position()=1]/@style,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'list-style-type')">
				<!-- <xsl:value-of select="ancestor::ol/@style"/> -->
				<xsl:variable name="list_style_type_string" select="substring-after(translate(ancestor::ol[position()=1]/@style,'ABCDEFGHIJKLMNOPQRSTUVWXYZ ','abcdefghijklmnopqrstuvwxyz'),'list-style-type:')"/>
				<xsl:variable name="list_style_type_value">
					<xsl:choose>
						<xsl:when test="contains($list_style_type_string, ';')">
							<xsl:value-of select="substring-before($list_style_type_string, ';')"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$list_style_type_string"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="$list_style_type_value = 'decimal'">
						<fo:inline>
							<xsl:number format="1." value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$list_style_type_value = 'decimal-leading-zero'">
						<fo:inline>
							<xsl:number format="01." value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$list_style_type_value = 'lower-alpha'">
						<fo:inline>
							<xsl:number format="a." value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$list_style_type_value = 'upper-alpha'">
						<fo:inline>
							<xsl:number format="A." value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$list_style_type_value = 'lower-roman'">
						<fo:inline>
							<xsl:number format="i." value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$list_style_type_value = 'upper-roman'">
						<fo:inline>
							<xsl:number format="I." value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:otherwise>
						<fo:inline>
							<xsl:number format="1." value="$listCounter"/>
						</fo:inline>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="ancestor::ol[position()=1]/@type">
				<xsl:variable name="oltype"><xsl:value-of select="ancestor::ol[position()=1]/@type"/></xsl:variable>
				<!--<xsl:message>spotted type attribute <xsl:value-of select="$oltype"/></xsl:message>-->
				<xsl:choose>
					<xsl:when test="string-length($oltype)&gt;0">
						<fo:inline>
							<xsl:number format="{$oltype}" value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:otherwise>
						<!--<xsl:message>otherwise</xsl:message>-->
						<fo:inline xsl:use-attribute-sets="ul-label-1">
							<xsl:value-of select="$ul-label-1"/>
						</fo:inline>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:variable name="depth" select="count(ancestor::ol)"/>
				<xsl:choose>
					<xsl:when test="$depth = 1">
						<fo:inline xsl:use-attribute-sets="ol-label-1">
							<xsl:number format="{$ol-label-1}" value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$depth = 2">
						<fo:inline xsl:use-attribute-sets="ol-label-2">
							<xsl:number format="{$ol-label-2}" value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$depth = 3">
						<fo:inline xsl:use-attribute-sets="ol-label-3">
							<xsl:number format="{$ol-label-3}" value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$depth = 4">
						<fo:inline xsl:use-attribute-sets="ol-label-4">
							<xsl:number format="{$ol-label-4}" value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:when test="$depth = 5">
						<fo:inline xsl:use-attribute-sets="ol-label-5">
							<xsl:number format="{$ol-label-5}" value="$listCounter"/>
						</fo:inline>
					</xsl:when>
					<xsl:otherwise>
						<fo:inline xsl:use-attribute-sets="ol-label-6">
							<xsl:number format="{$ol-label-6}" value="$listCounter"/>
						</fo:inline>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="listItemBodyString">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="dl">
		<fo:block xsl:use-attribute-sets="dl">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="dt">
		<fo:block xsl:use-attribute-sets="dt">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<xsl:template match="dd">
		<fo:block xsl:use-attribute-sets="dd">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:block>
	</xsl:template>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Table
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template match="table">
		<xsl:call-template name="make-table-caption"/>
		<fo:table xsl:use-attribute-sets="table">
			<xsl:call-template name="process-table"/>
		</fo:table>
	</xsl:template>
	<xsl:template name="make-table-caption">
		<xsl:if test="caption/@align">
			<xsl:attribute name="caption-side"><xsl:value-of select="caption/@align"/></xsl:attribute>
		</xsl:if>
		<xsl:apply-templates select="caption"/>
	</xsl:template>
	<xsl:template name="process-table">
		<xsl:if test="@width">
			<xsl:attribute name="inline-progression-dimension"><xsl:choose><xsl:when test="contains(@width, '%')"><xsl:value-of select="@width"/></xsl:when><xsl:otherwise><xsl:value-of select="@width"/>px</xsl:otherwise></xsl:choose></xsl:attribute>
		</xsl:if>
		<xsl:if test="@border or @frame">
			<xsl:choose>
				<xsl:when test="@border &gt; 0">
					<xsl:attribute name="border"><xsl:value-of select="@border"/>px</xsl:attribute>
				</xsl:when>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="@border = '0' or @frame = 'void'">
					<xsl:attribute name="border-style">hidden</xsl:attribute>
				</xsl:when>
				<xsl:when test="@frame = 'above'">
					<xsl:attribute name="border-style">outset hidden hidden hidden</xsl:attribute>
				</xsl:when>
				<xsl:when test="@frame = 'below'">
					<xsl:attribute name="border-style">hidden hidden outset hidden</xsl:attribute>
				</xsl:when>
				<xsl:when test="@frame = 'hsides'">
					<xsl:attribute name="border-style">outset hidden</xsl:attribute>
				</xsl:when>
				<xsl:when test="@frame = 'vsides'">
					<xsl:attribute name="border-style">hidden outset</xsl:attribute>
				</xsl:when>
				<xsl:when test="@frame = 'lhs'">
					<xsl:attribute name="border-style">hidden hidden hidden outset</xsl:attribute>
				</xsl:when>
				<xsl:when test="@frame = 'rhs'">
					<xsl:attribute name="border-style">hidden outset hidden hidden</xsl:attribute>
				</xsl:when>
				<xsl:otherwise>
					<xsl:attribute name="border-style">outset</xsl:attribute>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
		<xsl:if test="@cellspacing">
			<xsl:attribute name="border-spacing"><xsl:value-of select="@cellspacing"/>px</xsl:attribute>
			<xsl:attribute name="border-collapse">separate</xsl:attribute>
		</xsl:if>
		<xsl:if test="@rules and (@rules = 'groups' or
                      @rules = 'rows' or
                      @rules = 'cols' or
                      @rules = 'all' and (not(@border or @frame) or
                          @border = '0' or @frame and
                          not(@frame = 'box' or @frame = 'border')))">
			<xsl:attribute name="border-collapse">collapse</xsl:attribute>
			<xsl:if test="not(@border or @frame)">
				<xsl:attribute name="border-style">hidden</xsl:attribute>
			</xsl:if>
		</xsl:if>
		<xsl:call-template name="process-common-attributes"/>
		<xsl:apply-templates select="col | colgroup"/>
		<xsl:apply-templates select="thead"/>
		<xsl:apply-templates select="tfoot"/>
		<xsl:choose>
			<xsl:when test="tbody">
				<xsl:apply-templates select="tbody"/>
			</xsl:when>
			<xsl:otherwise>
				<fo:table-body xsl:use-attribute-sets="tbody">
					<xsl:apply-templates select="tr"/>
				</fo:table-body>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="caption">
		<xsl:call-template name="process-common-attributes"/>
		<fo:block>
			<xsl:apply-templates/>
		</fo:block>
	</xsl:template>
	<xsl:template match="thead">
		<fo:table-header xsl:use-attribute-sets="thead">
			<xsl:call-template name="process-table-rowgroup"/>
		</fo:table-header>
	</xsl:template>
	<xsl:template match="tfoot">
		<fo:table-footer xsl:use-attribute-sets="tfoot">
			<xsl:call-template name="process-table-rowgroup"/>
		</fo:table-footer>
	</xsl:template>
	<xsl:template match="tbody">
		<fo:table-body xsl:use-attribute-sets="tbody">
			<xsl:call-template name="process-table-rowgroup"/>
		</fo:table-body>
	</xsl:template>
	<xsl:template name="process-table-rowgroup">
		<xsl:if test="ancestor::table[1]/@rules = 'groups'">
			<xsl:attribute name="border">1px solid</xsl:attribute>
		</xsl:if>
		<xsl:call-template name="process-common-attributes-and-children"/>
	</xsl:template>
	<xsl:template match="colgroup">
		<fo:table-column xsl:use-attribute-sets="table-column">
			<xsl:call-template name="process-table-column"/>
		</fo:table-column>
	</xsl:template>
	<xsl:template match="colgroup[col]">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="col">
		<fo:table-column xsl:use-attribute-sets="table-column">
			<xsl:call-template name="process-table-column"/>
		</fo:table-column>
	</xsl:template>
	<xsl:template name="process-table-column">
		<xsl:if test="parent::colgroup">
			<xsl:call-template name="process-col-width">
				<xsl:with-param name="width" select="../@width"/>
			</xsl:call-template>
			<xsl:call-template name="process-cell-align">
				<xsl:with-param name="align" select="../@align"/>
			</xsl:call-template>
			<xsl:call-template name="process-cell-valign">
				<xsl:with-param name="valign" select="../@valign"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="@span">
			<xsl:attribute name="number-columns-repeated"><xsl:value-of select="@span"/></xsl:attribute>
		</xsl:if>
		<xsl:call-template name="process-col-width">
			<xsl:with-param name="width" select="@width"/>
			<!-- it may override parent colgroup's width -->
		</xsl:call-template>
		<xsl:if test="ancestor::table[1]/@rules = 'cols'">
			<xsl:attribute name="border">1px solid</xsl:attribute>
		</xsl:if>
		<xsl:call-template name="process-common-attributes"/>
		<!-- this processes also align and valign -->
	</xsl:template>
	<xsl:template match="tr">
		<fo:table-row xsl:use-attribute-sets="tr">
			<xsl:call-template name="process-table-row"/>
		</fo:table-row>
	</xsl:template>
	<xsl:template match="tr[parent::table and th and not(td)]">
		<fo:table-row xsl:use-attribute-sets="tr" keep-with-next="always">
			<xsl:call-template name="process-table-row"/>
		</fo:table-row>
	</xsl:template>
	<xsl:template name="process-table-row">
		<xsl:if test="ancestor::table[1]/@rules = 'rows'">
			<xsl:attribute name="border">1px solid</xsl:attribute>
		</xsl:if>
		<xsl:call-template name="process-common-attributes-and-children"/>
	</xsl:template>
	<xsl:template match="th">
		<fo:table-cell xsl:use-attribute-sets="th">
			<xsl:call-template name="process-table-cell"/>
		</fo:table-cell>
	</xsl:template>
	<xsl:template match="td">
		<fo:table-cell xsl:use-attribute-sets="td">
			<xsl:call-template name="process-table-cell"/>
		</fo:table-cell>
	</xsl:template>
	<xsl:template name="process-table-cell">
		<xsl:if test="@colspan">
			<xsl:attribute name="number-columns-spanned"><xsl:value-of select="@colspan"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="@rowspan">
			<xsl:attribute name="number-rows-spanned"><xsl:value-of select="@rowspan"/></xsl:attribute>
		</xsl:if>
		<xsl:for-each select="ancestor::table[1]">
			<xsl:if test="(@border or @rules) and (@rules = 'all' or
                    not(@rules) and not(@border = '0'))">
				<xsl:attribute name="border-style">inset</xsl:attribute>
			</xsl:if>
			<xsl:if test="@cellpadding">
				<xsl:attribute name="padding"><xsl:choose><xsl:when test="contains(@cellpadding, '%')"><xsl:value-of select="@cellpadding"/></xsl:when><xsl:otherwise><xsl:value-of select="@cellpadding"/>px</xsl:otherwise></xsl:choose></xsl:attribute>
			</xsl:if>
		</xsl:for-each>
		<xsl:if test="not(@align or ../@align or
                      ../parent::*[self::thead or self::tfoot or
                      self::tbody]/@align) and
                  ancestor::table[1]/*[self::col or
                      self::colgroup]/descendant-or-self::*/@align">
			<xsl:attribute name="text-align">from-table-column()</xsl:attribute>
		</xsl:if>
		<xsl:if test="not(@valign or ../@valign or
                      ../parent::*[self::thead or self::tfoot or
                      self::tbody]/@valign) and
                  ancestor::table[1]/*[self::col or
                      self::colgroup]/descendant-or-self::*/@valign">
			<xsl:attribute name="display-align">from-table-column()</xsl:attribute>
			<xsl:attribute name="relative-align">from-table-column()</xsl:attribute>
		</xsl:if>
		<xsl:call-template name="process-common-attributes"/>
		<fo:block>
			<xsl:apply-templates/>
		</fo:block>
	</xsl:template>
	<xsl:template name="process-col-width">
		<xsl:param name="width"/>
		<xsl:if test="$width and $width != '0*'">
			<xsl:attribute name="column-width"><xsl:choose><xsl:when test="contains($width, '*')"><xsl:text>proportional-column-width(</xsl:text><xsl:value-of select="substring-before($width, '*')"/><xsl:text>)</xsl:text></xsl:when><xsl:when test="contains($width, '%')"><xsl:value-of select="$width"/></xsl:when>
			<!-- changing pixel value back to cm on supsxhtml.xsl -->
			<xsl:otherwise>
			<!-- 
				<xsl:value-of select="$width"/>px			
			 -->
				<xsl:value-of select="$width * 0.02646"/>cm			 
			</xsl:otherwise></xsl:choose></xsl:attribute>
		</xsl:if>
	</xsl:template>
	<xsl:template name="process-cell-align">
		<xsl:param name="align"/>
		<xsl:if test="$align">
			<xsl:attribute name="text-align"><xsl:choose><xsl:when test="$align = 'char'"><xsl:choose><xsl:when test="$align/../@char"><xsl:value-of select="$align/../@char"/></xsl:when><xsl:otherwise><xsl:value-of select="'.'"/><!-- todo: it should depend on xml:lang ... --></xsl:otherwise></xsl:choose></xsl:when><xsl:otherwise><xsl:value-of select="$align"/></xsl:otherwise></xsl:choose></xsl:attribute>
		</xsl:if>
	</xsl:template>
	<xsl:template name="process-cell-valign">
		<xsl:param name="valign"/>
		<xsl:if test="$valign">
			<xsl:attribute name="display-align"><xsl:choose><xsl:when test="$valign = 'middle'">center</xsl:when><xsl:when test="$valign = 'bottom'">after</xsl:when><xsl:when test="$valign = 'baseline'">auto</xsl:when><xsl:otherwise>before</xsl:otherwise></xsl:choose></xsl:attribute>
			<xsl:if test="$valign = 'baseline'">
				<xsl:attribute name="relative-align">baseline</xsl:attribute>
			</xsl:if>
		</xsl:if>
	</xsl:template>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Inline-level
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template match="b">
		<fo:inline xsl:use-attribute-sets="b">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="strong">
		<fo:inline xsl:use-attribute-sets="strong">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="strong//em | em//strong">
		<fo:inline xsl:use-attribute-sets="strong-em">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="i">
		<fo:inline xsl:use-attribute-sets="i">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="cite">
		<fo:inline xsl:use-attribute-sets="cite">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="em">
		<fo:inline xsl:use-attribute-sets="em">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="var">
		<fo:inline xsl:use-attribute-sets="var">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="dfn">
		<fo:inline xsl:use-attribute-sets="dfn">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="tt">
		<fo:inline xsl:use-attribute-sets="tt">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="code">
		<fo:inline xsl:use-attribute-sets="code">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="kbd">
		<fo:inline xsl:use-attribute-sets="kbd">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="samp">
		<fo:inline xsl:use-attribute-sets="samp">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="big">
		<fo:inline xsl:use-attribute-sets="big">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="small">
		<fo:inline xsl:use-attribute-sets="small">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="sub">
		<fo:inline xsl:use-attribute-sets="sub">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="sup">
		<fo:inline xsl:use-attribute-sets="sup">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="s">
		<fo:inline xsl:use-attribute-sets="s">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="strike">
		<fo:inline xsl:use-attribute-sets="strike">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="del">
		<fo:inline xsl:use-attribute-sets="del">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="u">
		<fo:inline xsl:use-attribute-sets="u">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="ins">
		<fo:inline xsl:use-attribute-sets="ins">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="abbr">
		<fo:inline xsl:use-attribute-sets="abbr">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="acronym">
		<fo:inline xsl:use-attribute-sets="acronym">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
     Insert Page Number
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template match="span[@id='insertPageNumber']">
	 	<fo:page-number/>
	</xsl:template>
	<xsl:template match="span">
		<fo:inline>
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="span[@style='mso-list: Ignore']">
		<xsl:apply-templates select="child::node()[not(name()='span')]"/>
	</xsl:template>
	<xsl:template match="span[@dir]">
		<fo:bidi-override direction="{@dir}" unicode-bidi="embed">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:bidi-override>
	</xsl:template>
	<xsl:template match="span[@style and contains(@style, 'writing-mode')]">
		<fo:inline-container alignment-baseline="central" text-indent="0pt" last-line-end-indent="0pt" start-indent="0pt" end-indent="0pt" text-align="center" text-align-last="center">
			<xsl:call-template name="process-common-attributes"/>
			<fo:block wrap-option="no-wrap" line-height="1">
				<xsl:apply-templates/>
			</fo:block>
		</fo:inline-container>
	</xsl:template>
	<xsl:template match="bdo">
		<fo:bidi-override direction="{@dir}" unicode-bidi="bidi-override">
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:bidi-override>
	</xsl:template>
	<xsl:template match="br">
		<xsl:choose>
			<xsl:when test="@style='page-break-before: always'">
				<fo:block role="br" break-before="page">
					<xsl:text>&#xA;</xsl:text>
				</fo:block>
			</xsl:when>
			<xsl:when test="@style='page-break-after: always'">
				<fo:block role="br" break-after="page">
					<xsl:text>&#xA;</xsl:text>
				</fo:block>
			</xsl:when>
			<xsl:otherwise>
				<fo:block role="br">
					<xsl:text>&#xA;</xsl:text>
				</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="q">
		<fo:inline xsl:use-attribute-sets="q">
			<xsl:call-template name="process-common-attributes"/>
			<xsl:choose>
				<xsl:when test="lang('ja')">
					<xsl:text>_</xsl:text>
					<xsl:apply-templates/>
					<xsl:text>_</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<!-- lang('en') -->
					<xsl:text>_</xsl:text>
					<xsl:apply-templates/>
					<xsl:text>_</xsl:text>
					<!-- todo: other languages ...-->
				</xsl:otherwise>
			</xsl:choose>
		</fo:inline>
	</xsl:template>
	<xsl:template match="q//q">
		<fo:inline xsl:use-attribute-sets="q-nested">
			<xsl:call-template name="process-common-attributes"/>
			<xsl:choose>
				<xsl:when test="lang('ja')">
					<xsl:text>_</xsl:text>
					<xsl:apply-templates/>
					<xsl:text>_</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<!-- lang('en') -->
					<xsl:text>_</xsl:text>
					<xsl:apply-templates/>
					<xsl:text>_</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</fo:inline>
	</xsl:template>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Image
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<!--

<xsl:template match="img">
    <fo:external-graphic xsl:use-attribute-sets="img">
      <xsl:call-template name="process-img"/>
    </fo:external-graphic>
  </xsl:template>
-->
	<xsl:template match="img">
		<xsl:call-template name="process-img"/>
	</xsl:template>
	<xsl:template match="img[ancestor::a/@href]">
		<fo:external-graphic xsl:use-attribute-sets="img-link">
			<xsl:call-template name="process-img"/>
		</fo:external-graphic>
	</xsl:template>
	<xsl:template name="process-img">
		<xsl:choose>
			<xsl:when test="@alt='DCA Logo'">
				<fo:block>
				<fo:external-graphic content-width="3cm" content-height="3cm" src="url('data:image/png;base64, 
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
KTPYAAAAAElFTkSuQmCC')"/>
			</fo:block>
			</xsl:when>
			<xsl:when test="@alt='HMCS Logo'">
				<fo:block>
				<fo:external-graphic src="url('data:image/png;base64, 
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
rkJggg==')"/>
			</fo:block>
			</xsl:when>
			<xsl:when test="@alt='Welsh HMCS Logo'">
			<fo:block>
				<fo:external-graphic src="url('data:image/png;base64,
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')"/>
			</fo:block>
			</xsl:when>
			<xsl:when test="@alt=Seal">
			<fo:block>
			<fo:external-graphic src="url('data:image/jpeg;base64,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')"/>
			</fo:block>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<!--
  <xsl:template name="process-img">
    <xsl:attribute name="src">
      <xsl:text>url('</xsl:text>
      <xsl:value-of select="@src"/>
      <xsl:text>')</xsl:text>
    </xsl:attribute>
    <xsl:if test="@alt">
      <xsl:attribute name="role">
        <xsl:value-of select="@alt"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="@width">
      <xsl:choose>
        <xsl:when test="contains(@width, '%')">
          <xsl:attribute name="width">
            <xsl:value-of select="@width"/>
          </xsl:attribute>
          <xsl:attribute name="content-width">scale-to-fit</xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="content-width">
            <xsl:value-of select="@width"/>px</xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
    <xsl:if test="@height">
      <xsl:choose>
        <xsl:when test="contains(@height, '%')">
          <xsl:attribute name="height">
            <xsl:value-of select="@height"/>
          </xsl:attribute>
          <xsl:attribute name="content-height">scale-to-fit</xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="content-height">
            <xsl:value-of select="@height"/>px</xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
    <xsl:if test="@border">
      <xsl:attribute name="border">
        <xsl:value-of select="@border"/>px solid</xsl:attribute>
    </xsl:if>
    <xsl:call-template name="process-common-attributes"/>
  </xsl:template>
-->
	<xsl:template match="object">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="param"/>
	<xsl:template match="map"/>
	<xsl:template match="area"/>
	<xsl:template match="label"/>
	<xsl:template match="input"/>
	<xsl:template match="select"/>
	<xsl:template match="optgroup"/>
	<xsl:template match="option"/>
	<xsl:template match="textarea"/>
	<xsl:template match="legend"/>
	<xsl:template match="button"/>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Link
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template match="a">
		<fo:inline>
			<xsl:call-template name="process-common-attributes-and-children"/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="a[@href]">
		<fo:basic-link xsl:use-attribute-sets="a-link">
			<xsl:call-template name="process-a-link"/>
		</fo:basic-link>
	</xsl:template>
	<xsl:template name="process-a-link">
		<xsl:call-template name="process-common-attributes"/>
		<xsl:choose>
			<xsl:when test="starts-with(@href,'#')">
				<xsl:attribute name="internal-destination"><xsl:value-of select="substring-after(@href,'#')"/></xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="external-destination"><xsl:text>url('</xsl:text><xsl:value-of select="@href"/><xsl:text>')</xsl:text></xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="@title">
			<xsl:attribute name="role"><xsl:value-of select="@title"/></xsl:attribute>
		</xsl:if>
		<xsl:apply-templates/>
	</xsl:template>
	<!--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
       Ruby
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-->
	<xsl:template match="ruby">
		<fo:inline-container alignment-baseline="central" block-progression-dimension="1em" text-indent="0pt" last-line-end-indent="0pt" start-indent="0pt" end-indent="0pt" text-align="center" text-align-last="center">
			<xsl:call-template name="process-common-attributes"/>
			<fo:block font-size="50%" wrap-option="no-wrap" line-height="1" space-before.conditionality="retain" space-before="-1.1em" space-after="0.1em" role="rt">
				<xsl:for-each select="rt | rtc[1]/rt">
					<xsl:call-template name="process-common-attributes"/>
					<xsl:apply-templates/>
				</xsl:for-each>
			</fo:block>
			<fo:block wrap-option="no-wrap" line-height="1" role="rb">
				<xsl:for-each select="rb | rbc[1]/rb">
					<xsl:call-template name="process-common-attributes"/>
					<xsl:apply-templates/>
				</xsl:for-each>
			</fo:block>
			<xsl:if test="rtc[2]/rt">
				<fo:block font-size="50%" wrap-option="no-wrap" line-height="1" space-before="0.1em" space-after.conditionality="retain" space-after="-1.1em" role="rt">
					<xsl:for-each select="rt | rtc[2]/rt">
						<xsl:call-template name="process-common-attributes"/>
						<xsl:apply-templates/>
					</xsl:for-each>
				</fo:block>
			</xsl:if>
		</fo:inline-container>
	</xsl:template>
	<xsl:template match="place">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="street">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="address">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="placetype">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="placename">
		<xsl:apply-templates/>
	</xsl:template>
	<!-- Defect 4423; fo:inline was causing the addresspage sequence 
		not to appear when going to the next page with space-after -->
	<xsl:template match="font[count(text())!=0]|FONT[count(text())!=0]">
		<fo:inline>
			<xsl:if test="@face">
				<xsl:attribute name="font-family"><xsl:value-of select="@face"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@size">
				<xsl:attribute name="font-size"><xsl:value-of select="@size"/></xsl:attribute>
				<xsl:variable name="fs">
					<xsl:value-of select="@size"/>
				</xsl:variable>
				<xsl:if test="number($fs)>0">
					<xsl:attribute name="font-size"><xsl:value-of select="xalan:nodeset($font-size-lookup)/found[@value=$fs]"/></xsl:attribute>
				</xsl:if>
			</xsl:if>
			<xsl:apply-templates/>
		</fo:inline>
	</xsl:template>
	<xsl:template match="font[count(text())=0]|FONT[count(text())=0]">
		<fo:block>
			<xsl:if test="@face">
				<xsl:attribute name="font-family"><xsl:value-of select="@face"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@size">
				<xsl:attribute name="font-size"><xsl:value-of select="@size"/></xsl:attribute>
				<xsl:variable name="fs">
					<xsl:value-of select="@size"/>
				</xsl:variable>
				<xsl:if test="number($fs)>0">
					<xsl:attribute name="font-size"><xsl:value-of select="xalan:nodeset($font-size-lookup)/found[@value=$fs]"/></xsl:attribute>
				</xsl:if>
			</xsl:if>
			<xsl:apply-templates/>
		</fo:block>
	</xsl:template>
</xsl:stylesheet>