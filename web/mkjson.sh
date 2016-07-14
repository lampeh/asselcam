#!/bin/sh

BASEDIR="/var/www/videos"
URL="http://videos.asseln.attraktor.org"

sep=""
echo -n "["
find $BASEDIR -mindepth 3 -type f -name "*.mp4" |sort |while read fname; do
	title="`basename "$fname" .mp4`"
	size="`stat -c "%s" "$fname"`";
	echo -n "${sep}{\"src\":[\"${URL}${fname##$BASEDIR}\"],\"title\":\"$title\"}";
	sep=","
done
echo "]"
