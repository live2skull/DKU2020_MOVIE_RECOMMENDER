#!/bin/bash

doxygen
sudo rm -rf /var/www/html2/*
sudo cp -R ./html/* /var/www/html2/
