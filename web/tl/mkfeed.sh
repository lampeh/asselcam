#!/bin/sh

BASEDIR="/var/www/videos"
URL="http://videos.asseln.attraktor.org"
PLAYURL="http://asseln.attraktor.org/tl/"

i=0

cat <<-_EOF_
	<?xml version="1.0"?>
	<rss version="2.0">
	<channel>
	    <title>Asselcam Time Lapse - Attraktive Asseln in Aktion</title>
	    <description>Woodlouse and pill bug time lapse movies</description>
	    <link>http://asseln.attraktor.org/</link>
	    <!-- 
	    <image>
	        <url>http://asseln.attraktor.org/bottich_mini.jpg</url>
	        <title>Asselbottich</title>
	        <link>http://asseln.attraktor.org/</link>
	    </image>
	    -->
	    <ttl>720</ttl>
	    <lastBuildDate>`date -R`</lastBuildDate>
_EOF_

#ls -t $BASEDIR/
find $BASEDIR -maxdepth 1 -type f -name "*.mp4" |sort -r |head -n 60 |while read fname; do
	title="`basename "$fname" .mp4`"
	size="`stat -c "%s" "$fname"`";
	date="`date -R -r "$fname"`"
	cat <<-_EOF_
		    <item>
		        <title>$title</title>
		        <enclosure url="$URL/`basename "$fname"`" length="$size" type="video/mp4"/>
		        <guid>${PLAYURL}?v=$title</guid>
		        <pubDate>$date</pubDate>
		    </item>
	_EOF_
	i=$(($i+1))
done

cat <<-_EOF_
	</channel>
	</rss>
_EOF_
