# Project 2

This project contains an online messaging service called "What the Flack".

Users are able to sign into the site with a display name, create channels (i.e. chatrooms) to communicate in, as well as see and join existing channels. Once a channel is selected, users are able to send and receive messages with one another in real time.

# Manual
Log in with an username, this username will be yours until you delete your history and empty your cache.
You now see the main page. Left are the channels (one channel is always active: Channel). To the right are the messages. First select a channel to view and send messages. On top you can view which user left/entered the channel last (this is my personal touch). Under that information the messages are (to be) shown. Start typing as long as you can (100+ characters), because of text-wrapping your messages will still look pretty.
You can also make a channel (the name can be no longer than 15 characters).
The page saves itself (in a session), so when you are returning to the channel you were active in last time, all information was saved. Simply select the channel again and start typing.

If you are feeling lonely start talking to yourself by opening another tab or browser, select an username and you can finally have conversations with someone. Have fun!  

# Overview of files:
# /static
This folder contains the following files:
- script.js (which contains the javascript that makes this project work as it should).
- styles.scss, styles.css (which make the project look a bit better).

# /templates
This folder contains the following file:
- index.html (since this is a one page web-app, only one html is used).

# application.py
This file contains the python script that makes this project work as it should.

# requirements.txt
The required downloads are shown in this file.


# Notes to reviewer
In Dutch (translate if you really want to find out what is going on):
Hoi, het is niet gelukt om de berichten die verschijnen als "undefined: undefined" weg te krijgen. Dit zijn berichten die ontstaan door het joinen en leaven van een channel. Als ik de regel code die dit veroorzaakt aanpas (regel 161) laat hij niet meer direct na het klikken de berichten zien. Ik hoor graag of jij tijdens het nakijken opeens een oplossing hebt gevonden.
