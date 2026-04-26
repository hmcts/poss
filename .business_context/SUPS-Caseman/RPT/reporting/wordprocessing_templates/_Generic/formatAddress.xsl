<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSPY v2004 rel. 4 U (http://www.xmlspy.com) by Frederik Vandendriessche (EDS UK East Sol Center) -->
<!-- =======================================================================
	
	This Stylesheet formats address information.

	Two Templates; 
	- format-address-single-line
	- format-address-multi-line
	- format-only-address-multi-line
	
	Change History:
	07 Apr 2010, Chris Vincent - Added templates format-address-letter-address-only, 
	format-address-letter-welsh-address and format-address-letter-other-details to implement
	the address image solution for addresses with Welsh characters.  Trac 2662.
	10 Jan 2011, Chris Vincent. Trac 4134. format-address-letter amended to reference 
	GWASANAETH LLYSOEDD A THRIBIWNLYSOEDD EM instead of GWASANAETH LLYSOEDD EI MAWRHYDI.
	07 Sep 2012, Chris Vincent.  Changes to the telephone section in mcol-address-checker
	so that for foreign warrants uses the executing court tel no variable and for non FW, non MCOL
	outputs, uses the owning court's tel no variable.  Trac 4718.
	
	  ======================================================================= -->
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:xalan="http://xml.apache.org/xalan"
	exclude-result-prefixes="ora w v w10 sl aml wx o dt st1 xalan"
>

	<!-- =====================================================================
		format-address-single-line 
		
		returns the comma-concatenated, propoer case formatted address
	======================================================================== -->
	<xsl:template name="format-address-single-line">
		<xsl:param name="theAddress"/>
		<xsl:if test="string-length(xalan:nodeset($theAddress)/address/line1) > 0">
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="xalan:nodeset($theAddress)/address/line1"/>
				<xsl:with-param name="conversion">proper</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($theAddress)/address/line2) > 0">
			<xsl:text>, </xsl:text>
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="xalan:nodeset($theAddress)/address/line2"/>
				<xsl:with-param name="conversion">proper</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($theAddress)/address/line3) > 0">
			<xsl:text>, </xsl:text>
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="xalan:nodeset($theAddress)/address/line3"/>
				<xsl:with-param name="conversion">proper</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($theAddress)/address/line4) > 0">
			<xsl:text>, </xsl:text>
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="xalan:nodeset($theAddress)/address/line4"/>
				<xsl:with-param name="conversion">proper</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($theAddress)/address/line5) > 0">
			<xsl:text>, </xsl:text>
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="xalan:nodeset($theAddress)/address/line5"/>
				<xsl:with-param name="conversion">proper</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($theAddress)/address/postcode) > 0">
			<xsl:text>, </xsl:text>
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="xalan:nodeset($theAddress)/address/postcode"/>
				<xsl:with-param name="conversion">upper</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	<!-- =====================================================================
		format-address-multi-line
		
		returns the formatted address across multiple lines 
	======================================================================== -->
	<xsl:template name="format-address-multi-line">
		<xsl:param name="party"/>
		<xsl:param name="isNoticeOfEviction"/>
		<xsl:if test="string-length(xalan:nodeset($party)/namedperson) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/namedperson"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>		
		<xsl:if test="string-length(xalan:nodeset($party)/name) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/name"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="$isNoticeOfEviction = 'true'">
			<fo:block>AND ALL OTHER OCCUPIERS</fo:block>
		</xsl:if>		
		<xsl:if test="string-length(xalan:nodeset($party)/address/line1) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line1"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line2) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line2"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line3) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line3"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line4) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line4"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line5) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line5"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/postcode) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/postcode"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/dx) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/dx"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
	</xsl:template>
		<!-- =====================================================================
		format-address-multi-line-noDX
		
		returns the formatted address across multiple lines with out DX Number
	======================================================================== -->
	<xsl:template name="format-address-multi-line-noDX">
		<xsl:param name="party"/>
		<xsl:param name="isNoticeOfEviction"/>
		<xsl:if test="string-length(xalan:nodeset($party)/namedperson) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/namedperson"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>		
		<xsl:if test="string-length(xalan:nodeset($party)/name) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/name"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="$isNoticeOfEviction = 'true'">
			<fo:block>AND ALL OTHER OCCUPIERS</fo:block>
		</xsl:if>		
		<xsl:if test="string-length(xalan:nodeset($party)/address/line1) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line1"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line2) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line2"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line3) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line3"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line4) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line4"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line5) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line5"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/postcode) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/postcode"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
	</xsl:template>
	<!-- =====================================================================
		format-only-address-multi-line
		
		returns the formatted address across multiple lines 
	======================================================================== -->
	<xsl:template name="format-address-multi-line-capital">
		<xsl:param name="party"/>
		<xsl:if test="string-length(xalan:nodeset($party)/name) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/name"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line1) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line1"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line2) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line2"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line3) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line3"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line4) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line4"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line5) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line5"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/postcode) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/postcode"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/dx) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/dx"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
	</xsl:template>
	<!-- =====================================================================
		format-address-multi-line-capital
		
		returns the formatted address across multiple lines without the name
	======================================================================== -->
	<xsl:template name="format-only-address-multi-line">
		<xsl:param name="party"/>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line1) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line1"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line2) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line2"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line3) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line3"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line4) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line4"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/line5) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line5"/>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/address/postcode) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/postcode"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
		<xsl:if test="string-length(xalan:nodeset($party)/dx) > 0">
			<fo:block>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="xalan:nodeset($party)/dx"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</fo:block>
		</xsl:if>
	</xsl:template>

	<xsl:template name="mcol-address-checker">
		<xsl:param name="type"/>
		<xsl:param name="nonMCOLValue"/>
		<xsl:param name="courtCode"/>
		<xsl:param name="creditorCode"/>
		<xsl:choose>
			<xsl:when test='$type="name"'>
				<xsl:choose>
					<xsl:when test="string-length(/variabledata/warrant/localnumber) > 0">
						<xsl:value-of select="$nonMCOLValue"/>
					</xsl:when>
					<xsl:when test="$courtCode = '335' and $creditorCode = '1999'">
						<xsl:value-of select="$vdMCOLCourtName"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$nonMCOLValue"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test='$type="tel"'>
				<xsl:choose>
					<xsl:when test="string-length(/variabledata/warrant/localnumber) > 0">
						<xsl:value-of select="$vdExecutingCourtTelephoneNumber"/>
					</xsl:when>
					<xsl:when test="$courtCode = '335' and $creditorCode = '1999'">
						<xsl:value-of select="$vdMCOLCourtTelephoneNumber"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$vdCourtTelephoneNumber"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test='$type="fax"'>
				<xsl:choose>
					<xsl:when test="string-length(/variabledata/warrant/localnumber) > 0">
						<xsl:value-of select="$nonMCOLValue"/>
					</xsl:when>
					<xsl:when test="$courtCode = '335' and $creditorCode = '1999'">
						<xsl:value-of select="$vdMCOLCourtFaxNumber"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$nonMCOLValue"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	
	<!-- =====================================================================
		format-address-letter-address-only
		
		Introduced as part of Trac 2662.  Outputs the English Court address only
		i.e. no DX, Telephone, Fax etc.
	======================================================================== -->
	<xsl:template name="format-address-letter-address-only">
		<xsl:param name="party"/>
		<xsl:choose>
			<xsl:when test="string-length(xalan:nodeset($party)/name) > 0">
				<fo:block font-weight="bold">
					<xsl:variable name="partyproper">
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/name"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</xsl:variable>
					<xsl:variable name="courtCode" select="xalan:nodeset($party)/courtcode"/>
					
					<xsl:choose>
						<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
							<!-- Case is District Registry -->
							<xsl:value-of select="$partyproper"/>&#xA0;<xsl:value-of select="$vdCourtOrDistrict"/>
						</xsl:when>
						<xsl:when test="$vdDistrictRegistry = 'F'">The Family Court at <xsl:value-of select="$partyproper"/></xsl:when>
						<xsl:otherwise>
							<!-- Case is County Court -->
							<xsl:choose>
								<!-- MCOL case -->
								<xsl:when test="$courtCode = '335' and $vdCreditorCode = '1999'">Money Claim Online, County Court Business Centre</xsl:when>
								<!-- CCBC case -->
								<xsl:when test="$courtCode = '335'">The County Court Business Centre</xsl:when>
								<!-- CCMCC case -->
								<xsl:when test="$courtCode = '390' or $courtCode = '391'">The County Court Money Claims Centre</xsl:when>
								<!-- Normal county court -->
								<xsl:otherwise>The County Court at <xsl:value-of select="$partyproper"/></xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>
				</fo:block>
			</xsl:when>
			<xsl:otherwise>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="string-length(xalan:nodeset($party)/address/line1) > 0">
				<fo:block>
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line1"/>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</fo:block>
				<xsl:if test="string-length(xalan:nodeset($party)/address/line2) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line2"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/address/line3) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line3"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/address/line4) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line4"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/address/line5) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/line5"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/address/postcode) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/address/postcode"/>
							<xsl:with-param name="conversion">upper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- =====================================================================
		format-address-letter-welsh-address
		
		Introduced as part of Trac 2662.  Outputs the Welsh Court address only
		i.e. no DX, Telephone, Fax etc.
	======================================================================== -->
	<xsl:template name="format-address-letter-welsh-address">
		<xsl:param name="party"/>
		<xsl:choose>
			<xsl:when test="string-length($vdWelshCourtOrDistrictName) > 0">
				<fo:block font-weight="bold">
					<xsl:value-of select="$vdWelshCourtOrDistrictName"/>
				</fo:block>
			</xsl:when>
			<xsl:otherwise>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="string-length(xalan:nodeset($party)/welshaddress/line1) > 0">
				<fo:block>
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert" select="xalan:nodeset($party)/welshaddress/line1"/>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</fo:block>
				<xsl:if test="string-length(xalan:nodeset($party)/welshaddress/line2) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/welshaddress/line2"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/welshaddress/line3) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/welshaddress/line3"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/welshaddress/line4) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/welshaddress/line4"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/welshaddress/line5) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/welshaddress/line5"/>
							<xsl:with-param name="conversion">proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
				<xsl:if test="string-length(xalan:nodeset($party)/welshaddress/postcode) > 0">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert" select="xalan:nodeset($party)/welshaddress/postcode"/>
							<xsl:with-param name="conversion">upper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
				<fo:block><xsl:text>__________________________________________________</xsl:text></fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- =====================================================================
		format-address-letter-other-details
		
		Introduced as part of Trac 2662.  Outputs the DX, Tel and Fax Nos for
		the court including Welsh versions if specified.
	======================================================================== -->
	<xsl:template name="format-address-letter-other-details">
		<xsl:param name="party"/>
        <xsl:param name="welshAddress"/>
		<fo:block space-before="0.3cm">
			<fo:inline font-weight="bold">DX </fo:inline>
			<xsl:choose>
				<xsl:when test="string-length(xalan:nodeset($party)/dx) > 0">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert" select="xalan:nodeset($party)/dx"/>
						<xsl:with-param name="conversion">upper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>____________</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</fo:block>
		<fo:block space-before="0.3cm">
            <xsl:choose>
                <xsl:when test="$welshAddress = 'Y'">
                    <fo:inline font-weight="bold">T / Ffon </fo:inline>
                </xsl:when>
                <xsl:otherwise>
                    <fo:inline font-weight="bold">T </fo:inline>
                </xsl:otherwise>
            </xsl:choose>
			<xsl:variable name="letterTelNumber">
				<xsl:call-template name="mcol-address-checker">
					<xsl:with-param name="type">tel</xsl:with-param>
					<xsl:with-param name="nonMCOLValue" select="xalan:nodeset($party)/telephonenumber"/>
					<xsl:with-param name="courtCode" select="$vdCourtCode"/>
					<xsl:with-param name="creditorCode" select="$vdCreditorCode"/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="string-length($letterTelNumber) > 0">
					<xsl:value-of select="$letterTelNumber"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>____________</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</fo:block>
		<fo:block>
            <xsl:choose>
                <xsl:when test="$welshAddress = 'Y'">
                    <fo:inline font-weight="bold">F / Ffacs </fo:inline>
                </xsl:when>
                <xsl:otherwise>
                    <fo:inline font-weight="bold">F </fo:inline>
                </xsl:otherwise>
            </xsl:choose>
			<xsl:variable name="letterFaxNumber">
				<xsl:call-template name="mcol-address-checker">
					<xsl:with-param name="type">fax</xsl:with-param>
					<xsl:with-param name="nonMCOLValue" select="xalan:nodeset($party)/faxnumber"/>
					<xsl:with-param name="courtCode" select="$vdCourtCode"/>
					<xsl:with-param name="creditorCode" select="$vdCreditorCode"/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="string-length($letterFaxNumber) > 0">
					<xsl:value-of select="$letterFaxNumber"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>____________</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</fo:block>
	</xsl:template>
</xsl:stylesheet>

