#!/bin/sh

BASEDIR="/var/www/videos"
#URL="videos"
URL="http://videos.asseln.attraktor.org"

sep=""
echo -n "["
#ls -tr $BASEDIR/
# |sort -r |head -n 60 |sort
find $BASEDIR -maxdepth 1 -type f -name "*.mp4" |sort |while read fname; do
	title="`basename "$fname" .mp4`"
	size="`stat -c "%s" "$fname"`";
	echo -n "${sep}{\"src\":[\"${URL}/`basename "$fname"`\"],\"title\":\"$title\"}";
	sep=","
done
echo "]"
