<?xml version="1.0" encoding="UTF-8"?>
<!-- ====================================================
	
	This Stylesheet provides templates 

	- convertcase
	- convertpropercase

	to case convert 

	22/12/09 - - -TRAC 2617 - added Welsh letters to convertcase section.
		==================================================== -->
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:ora="http://www.oracle.com/XSL/Transform/java"
	exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan" >

	<!-- -->
	<!-- convertcase -->
	<!-- - returns the input text in the requested case -->
	<!-- -->
	<xsl:template name="convertcase">
		<xsl:param name="toconvert"/>
		<xsl:param name="surnameFlag"/>
		<xsl:param name="conversion"/>

		<xsl:variable name="lcletters">abcdefghijklmnopqrstuvwxyz&#226;&#234;&#238;&#244;&#251;&#375;&#373;&#225;&#224;&#228;&#233;&#232;&#235;&#237;&#236;&#239;&#243;&#242;&#246;&#250;&#249;&#252;&#253;&#7923;ÿ&#7811;&#7809;&#7813;</xsl:variable>
		<xsl:variable name="ucletters">ABCDEFGHIJKLMNOPQRSTUVWXYZ&#194;&#202;&#206;&#212;&#219;&#374;&#372;&#193;&#192;&#196;&#201;&#200;&#203;&#205;&#204;&#207;&#211;&#210;&#214;&#218;&#217;&#220;&#221;&#7922;Ÿ&#7810;&#7808;&#7812;</xsl:variable>
		<xsl:choose>
			<xsl:when test='$conversion="lower"'>
				<xsl:value-of select="translate($toconvert,$ucletters,$lcletters)"/>
			</xsl:when>
			<xsl:when test='$conversion="upper"'>
				<xsl:value-of select="translate($toconvert,$lcletters,$ucletters)"/>
			</xsl:when>
			<xsl:when test='$conversion="proper"'>
				<xsl:variable name="lowerText" select="translate($toconvert,$ucletters,$lcletters)"/>
				<xsl:choose>
					<xsl:when test="'ccbc' = $lowerText">CCBC</xsl:when>
					<xsl:when test="'macclesfield' = $lowerText">Macclesfield</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="convertpropercase">
							<xsl:with-param name="toconvert">
								<xsl:value-of select="translate($toconvert,$ucletters,$lcletters)"/>
							</xsl:with-param>
							<xsl:with-param name="surnameFlag">
								<xsl:value-of select="$surnameFlag"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$toconvert"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- -->
	<!-- convertpropercase -->
	<!-- - returns the input lower case text in proper case -->
	<!-- -->
	<xsl:template name="convertpropercase">
		<xsl:param name="toconvert"/>
		<xsl:param name="surnameFlag"/>
		
		<xsl:if test="string-length($toconvert) > 0">

			<xsl:variable name="mc">			
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert" select="$toconvert"/>
					<xsl:with-param name="conversion">upper</xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			
			<xsl:variable name="apos">'</xsl:variable>
			
			<xsl:choose>
				<xsl:when test="substring($mc,1,12) = 'MACCLESFIELD'">
					<xsl:text>Macclesfield</xsl:text>
					<xsl:call-template name="convertpropercase">
						<xsl:with-param name="toconvert" select="substring($toconvert,13)"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="substring($mc,1,4) = 'CCBC'">
					<xsl:text>CCBC</xsl:text>
					<xsl:call-template name="convertpropercase">
						<xsl:with-param name="toconvert" select="substring($toconvert,5)"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="substring($mc,1,15) = 'Y LLYS SIROL YN'">
					<xsl:text>Y Llys Sirol yn</xsl:text>
					<xsl:call-template name="convertpropercase">
						<xsl:with-param name="toconvert" select="substring($toconvert,16)"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$surnameFlag != 'true' and (substring($mc, 1, 2) = 'MC' or substring($mc, 1, 3) = 'MAC' or substring($mc, 2, 1) = $apos)">
					
					<xsl:variable name="prefix">
						<xsl:choose>
							<xsl:when test="substring($mc, 1, 2) = 'MC'">MC</xsl:when>
							<xsl:when test="substring($mc, 1, 3) = 'MAC'">MAC</xsl:when>
							<xsl:when test="substring($mc, 2, 1) = $apos"><xsl:value-of select="substring($mc, 1, 1)"/>'</xsl:when>
						</xsl:choose>
					</xsl:variable>
	
					<xsl:variable name="surname">
						<xsl:choose>
							<xsl:when test="substring($mc, 1, 2) = 'MC' "><xsl:value-of select="substring($toconvert, 3)"/></xsl:when>
							<xsl:when test="substring($mc, 1, 3) = 'MAC' "><xsl:value-of select="substring($toconvert, 4)"/></xsl:when>
							<xsl:when test="substring($mc, 2, 1) = $apos"><xsl:value-of select="substring($toconvert, 3)"/></xsl:when>
						</xsl:choose>
					</xsl:variable>
	
					<xsl:call-template name="convertSurnamePrefix">
						<xsl:with-param name="prefix" select="$prefix"/>
						<xsl:with-param name="surname" select="$surname"/>
					</xsl:call-template>

				</xsl:when>
				<xsl:otherwise>
				
					<xsl:variable name="f" select="substring($toconvert, 1, 1)"/>
					<xsl:variable name="s" select="substring($toconvert, 2)"/>

					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert" select="$f"/>
						<xsl:with-param name="conversion">upper</xsl:with-param>
					</xsl:call-template>

					<xsl:choose>
						<xsl:when test="contains($f,' ') or contains($f,'(')">
							<xsl:call-template name="convertpropercase">
								<xsl:with-param name="toconvert" select='$s'/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="contains($s,' ')">
									<xsl:choose>
										<xsl:when test="contains(substring-before($s,' '),'(')">
											<xsl:value-of select='substring-before($s,"(")'/>
											<xsl:text>(</xsl:text>
											<xsl:call-template name="convertpropercase">
												<xsl:with-param name="toconvert" select='substring-after($s,"(")'/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select='substring-before($s," ")'/>
											<xsl:text> </xsl:text>
											<xsl:call-template name="convertpropercase">
												<xsl:with-param name="toconvert" select='substring-after($s," ")'/>
											</xsl:call-template>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:when>
								<xsl:when test="contains($s,'(')">
									<xsl:value-of select='substring-before($s,"(")'/>
									<xsl:text>(</xsl:text>
									<xsl:call-template name="convertpropercase">
										<xsl:with-param name="toconvert" select='substring-after($s,"(")'/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$s"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="convertSurnamePrefix">
		<xsl:param name="prefix"/>
		<xsl:param name="surname"/>

			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="$prefix"/>
				<xsl:with-param name="surnameFlag" select="string('true')"/>
				<xsl:with-param name="conversion">proper</xsl:with-param>
			</xsl:call-template>

			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="$surname"/>
				<xsl:with-param name="surnameFlag" select="string('true')"/>				
				<xsl:with-param name="conversion">proper</xsl:with-param>
			</xsl:call-template>
			
	</xsl:template>

	<xsl:template name="correctCalculation">
		<xsl:param name="value"/>
		<xsl:choose>
			<xsl:when test="string-length($value) > 0 and contains($value,'.') and $value != '0'">
				<xsl:variable name="roundedNumber">
					<xsl:call-template name="roundNumber">
						<xsl:with-param name="value"><xsl:value-of select='$value'/></xsl:with-param>
					</xsl:call-template>
				</xsl:variable>
				<xsl:variable name="wholeNumber" select="substring-before($roundedNumber, '.')"/>
				<xsl:variable name="returnNumber">
					<xsl:call-template name="insertCommasForThousands">
						<xsl:with-param name="insertionValue"><xsl:value-of select='$wholeNumber'/></xsl:with-param>
					</xsl:call-template>
				</xsl:variable>
				<xsl:variable name="decimal" select="substring-after($roundedNumber, '.')"/>
				<xsl:value-of select="concat($returnNumber, '.', substring($decimal,1,2))"/>
			</xsl:when>
			<xsl:when test="string-length($value) > 0">
				<xsl:variable name="returnNumber">
					<xsl:call-template name="insertCommasForThousands">
						<xsl:with-param name="insertionValue"><xsl:value-of select='$value'/></xsl:with-param>
					</xsl:call-template>
				</xsl:variable>
				<xsl:value-of select="concat($returnNumber, '.00')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="'0.00'"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="roundNumber">
		<xsl:param name="value"/>
		<xsl:choose>
			<xsl:when test="0 > $value">
				<xsl:value-of select="$value - 0.005"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$value + 0.005"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="insertCommasForThousands">
		<xsl:param name="insertionValue"/>
		<xsl:variable name="valueLength" select="string-length($insertionValue)"/>
		<xsl:choose>
			<xsl:when test="$valueLength > 3">
				<xsl:call-template name="insertCommasForThousands">
					<xsl:with-param name="insertionValue"><xsl:value-of select="substring($insertionValue,1,$valueLength - 3)"/></xsl:with-param>
				</xsl:call-template>
				<xsl:value-of select="concat(',', substring($insertionValue,$valueLength - 2,$valueLength))"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$insertionValue"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


</xsl:stylesheet>

