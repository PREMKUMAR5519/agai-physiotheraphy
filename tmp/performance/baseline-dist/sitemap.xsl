<?xml version="1.0" encoding="UTF-8"?>
<!--
	Renders sitemap.xml and the *-sitemap.xml files as a readable page when they
	are opened in a browser. Search engines ignore this file and read the XML.

	Two values come from comments that generate-sitemap.js write
	into the XML: "generated: <date>" at the top of every file, and "urls: <count>"
	inside each <sitemap> entry of the index. Dates are printed as written, so
	both write them in IST.
-->
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
	exclude-result-prefixes="sitemap"
>
	<xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

	<xsl:variable name="siteName" select="'AGAI Physiotherapy Centre'"/>
	<xsl:variable name="isIndex" select="boolean(/sitemap:sitemapindex)"/>
	<xsl:variable name="itemCount" select="count(/sitemap:sitemapindex/sitemap:sitemap | /sitemap:urlset/sitemap:url)"/>
	<xsl:variable name="generated" select="normalize-space(substring-after(/comment()[contains(., 'generated:')], 'generated:'))"/>

	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<meta name="robots" content="noindex, follow"/>
				<title>
					<xsl:choose>
						<xsl:when test="$isIndex">Sitemap Index</xsl:when>
						<xsl:otherwise>Sitemap</xsl:otherwise>
					</xsl:choose>
					<xsl:text> | </xsl:text>
					<xsl:value-of select="$siteName"/>
				</title>
				<link rel="icon" type="image/svg+xml" href="/brand-kit/web/favicon.svg"/>
				<style type="text/css">
					body {
						margin: 0;
						font-family: Helvetica, Arial, sans-serif;
						font-size: 68.5%;
					}
					#content-head {
						background-color: #0558AD;
						padding: 20px 40px;
					}
					#content-head h1,
					#content-head p,
					#content-head a {
						color: #fff;
						font-size: 1.2em;
					}
					#content-head h1 {
						font-size: 2em;
					}
					.table-wrapper {
						overflow-x: auto;
					}
					table {
						margin: 20px 40px;
						border: none;
						border-collapse: collapse;
						font-size: 1em;
						width: 75%;
					}
					th {
						border-bottom: 1px solid #ccc;
						text-align: left;
						padding: 15px 5px;
						font-size: 14px;
					}
					td {
						padding: 10px 5px;
						border-left: 3px solid #fff;
					}
					tr.stripe {
						background-color: #f7f7f7;
					}
					table td a {
						display: block;
					}
					.empty-sitemap {
						margin: 20px 40px;
						font-size: 14px;
					}
					.breadcrumb {
						margin: 20px 40px;
						width: 75%;
						display: flex;
						align-items: center;
						font-size: 12px;
						font-weight: 600;
					}
					.breadcrumb a {
						color: #0558AD;
						text-decoration: none;
					}
					.breadcrumb svg {
						margin: 0 10px;
					}
					@media (max-width: 1023px) {
						#content-head {
							padding: 20px;
						}
						table,
						.breadcrumb,
						.empty-sitemap {
							margin: 20px;
						}
						table {
							width: calc(100% - 40px);
						}
						.breadcrumb svg:not(.back),
						.breadcrumb a:not(:last-of-type),
						.breadcrumb span {
							display: none;
						}
						.breadcrumb a:last-of-type::before {
							content: 'Back';
						}
					}
					@media (min-width: 1024px) {
						.breadcrumb {
							font-size: 14px;
						}
						.breadcrumb a {
							font-weight: 400;
						}
						.breadcrumb svg.back {
							display: none;
						}
					}
				</style>
			</head>
			<body>
				<xsl:call-template name="header"/>
				<xsl:call-template name="breadcrumb"/>
				<xsl:choose>
					<xsl:when test="$itemCount = 0">
						<p class="empty-sitemap">There are no URLs in this sitemap yet.</p>
					</xsl:when>
					<xsl:when test="$isIndex">
						<xsl:call-template name="indexTable"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="urlTable"/>
					</xsl:otherwise>
				</xsl:choose>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="header">
		<div id="content-head">
			<h1>Sitemap</h1>
			<p>
				<xsl:text>Generated for </xsl:text>
				<a href="/"><xsl:value-of select="$siteName"/></a>
				<xsl:text>, this is an XML Sitemap, meant to be consumed by search engines like Google or Bing.</xsl:text>
			</p>
			<p>
				<xsl:text>You can find more information about XML Sitemaps at </xsl:text>
				<a href="https://www.sitemaps.org/" target="_blank" rel="noreferrer noopener">sitemaps.org</a>
				<xsl:text>.</xsl:text>
			</p>
			<xsl:if test="$itemCount &gt; 0">
				<p>
					<xsl:choose>
						<xsl:when test="$isIndex">
							<xsl:text>This sitemap index contains </xsl:text>
							<xsl:value-of select="$itemCount"/>
							<xsl:choose>
								<xsl:when test="$itemCount = 1"> sitemap</xsl:when>
								<xsl:otherwise> sitemaps</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>This sitemap contains </xsl:text>
							<xsl:value-of select="$itemCount"/>
							<xsl:choose>
								<xsl:when test="$itemCount = 1"> URL</xsl:when>
								<xsl:otherwise> URLs</xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:if test="$generated != ''">
						<xsl:text> and was generated on </xsl:text>
						<xsl:call-template name="date">
							<xsl:with-param name="iso" select="$generated"/>
						</xsl:call-template>
						<xsl:text> at </xsl:text>
						<xsl:call-template name="time">
							<xsl:with-param name="iso" select="$generated"/>
						</xsl:call-template>
					</xsl:if>
				</p>
			</xsl:if>
		</div>
	</xsl:template>

	<xsl:template name="breadcrumb">
		<div class="breadcrumb">
			<svg class="back" width="6" height="9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.274 7.56L2.22 4.5l3.054-3.06-.94-.94-4 4 4 4 .94-.94z" fill="#0558AD"/></svg>
			<a href="/"><span>Home</span></a>
			<xsl:call-template name="chevron"/>
			<xsl:choose>
				<xsl:when test="$isIndex">
					<span>Sitemap Index</span>
				</xsl:when>
				<xsl:otherwise>
					<a href="/sitemap.xml"><span>Sitemap Index</span></a>
					<xsl:call-template name="chevron"/>
					<span>Sitemap</span>
				</xsl:otherwise>
			</xsl:choose>
		</div>
	</xsl:template>

	<xsl:template name="chevron">
		<svg width="6" height="8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.727 7.06L3.78 4 .727.94l.94-.94 4 4-4 4-.94-.94z" fill="#0558AD"/></svg>
	</xsl:template>

	<xsl:template name="indexTable">
		<div class="table-wrapper">
			<table cellpadding="3">
				<thead>
					<tr>
						<th>URL</th>
						<th>URL Count</th>
						<th>Last Updated</th>
					</tr>
				</thead>
				<tbody>
					<xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
						<tr>
							<xsl:if test="position() mod 2 != 0">
								<xsl:attribute name="class">stripe</xsl:attribute>
							</xsl:if>
							<td>
								<!-- Linked by path so the child sitemaps also open on localhost and preview builds -->
								<a href="/{substring-after(substring-after(sitemap:loc, '://'), '/')}">
									<xsl:value-of select="sitemap:loc"/>
								</a>
							</td>
							<td>
								<xsl:value-of select="normalize-space(substring-after(comment()[contains(., 'urls:')], 'urls:'))"/>
							</td>
							<td class="datetime">
								<xsl:call-template name="dateTime">
									<xsl:with-param name="iso" select="sitemap:lastmod"/>
								</xsl:call-template>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</div>
	</xsl:template>

	<xsl:template name="urlTable">
		<div class="table-wrapper">
			<table cellpadding="3">
				<thead>
					<tr>
						<th>URL</th>
						<th>Change Frequency</th>
						<th>Priority</th>
						<th>Last Updated</th>
					</tr>
				</thead>
				<tbody>
					<xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
					<xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
					<xsl:for-each select="sitemap:urlset/sitemap:url">
						<tr>
							<xsl:if test="position() mod 2 != 0">
								<xsl:attribute name="class">stripe</xsl:attribute>
							</xsl:if>
							<td>
								<a href="{sitemap:loc}">
									<xsl:value-of select="sitemap:loc"/>
								</a>
							</td>
							<td>
								<xsl:value-of select="concat(translate(substring(sitemap:changefreq, 1, 1), $lower, $upper), substring(sitemap:changefreq, 2))"/>
							</td>
							<td>
								<xsl:choose>
									<xsl:when test="string(number(sitemap:priority)) = 'NaN'"/>
									<xsl:when test="sitemap:priority &gt;= 0.9">High</xsl:when>
									<xsl:when test="sitemap:priority &gt;= 0.6">Medium</xsl:when>
									<xsl:otherwise>Low</xsl:otherwise>
								</xsl:choose>
							</td>
							<td class="datetime">
								<xsl:call-template name="dateTime">
									<xsl:with-param name="iso" select="sitemap:lastmod"/>
								</xsl:call-template>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</div>
	</xsl:template>

	<!-- The templates below format a W3C datetime such as 2026-09-29T15:49:00+05:30 -->

	<xsl:template name="dateTime">
		<xsl:param name="iso"/>
		<xsl:if test="string-length($iso) &gt;= 10">
			<div class="date">
				<xsl:call-template name="date">
					<xsl:with-param name="iso" select="$iso"/>
				</xsl:call-template>
			</div>
			<xsl:if test="string-length($iso) &gt;= 16">
				<div class="time">
					<xsl:call-template name="time">
						<xsl:with-param name="iso" select="$iso"/>
					</xsl:call-template>
				</div>
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<!-- September 29, 2026 -->
	<xsl:template name="date">
		<xsl:param name="iso"/>
		<!-- Month names padded to 10 characters so the month number can index into the string -->
		<xsl:variable name="months" select="'January   February  March     April     May       June      July      August    September October   November  December  '"/>
		<xsl:value-of select="normalize-space(substring($months, (number(substring($iso, 6, 2)) - 1) * 10 + 1, 10))"/>
		<xsl:text> </xsl:text>
		<xsl:value-of select="number(substring($iso, 9, 2))"/>
		<xsl:text>, </xsl:text>
		<xsl:value-of select="substring($iso, 1, 4)"/>
	</xsl:template>

	<!-- 3:49 pm -->
	<xsl:template name="time">
		<xsl:param name="iso"/>
		<xsl:variable name="hour" select="number(substring($iso, 12, 2))"/>
		<xsl:value-of select="($hour + 11) mod 12 + 1"/>
		<xsl:value-of select="substring($iso, 14, 3)"/>
		<xsl:choose>
			<xsl:when test="$hour &lt; 12"> am</xsl:when>
			<xsl:otherwise> pm</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
