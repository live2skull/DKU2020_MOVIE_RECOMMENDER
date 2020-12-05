#!/bin/bash

sudo rm -rf ./html/*
doxygen
sudo rm -rf /var/www/html2/*
sudo cp -R ./html/* /var/www/html2/
