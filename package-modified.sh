#!/bin/sh

# Li Zheng <flyskywhy@gmail.com>
# list package modified recently, to debug which newly published package cause problem

echo > package-modified.txt
for package in `grep ": {" package-lock.json | grep requires -v | grep dependencies -v | sed -e "s/: {//" -e "s/^ *//" -e "s/\"//g" | sort | uniq`
do
    modified=`npm info $package time.modified`
    echo $modified $package
    echo $modified $package >> package-modified.txt
done

sort package-modified.txt
