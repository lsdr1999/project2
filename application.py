import os
import requests
import datetime

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room

from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# channel_list = []
CHANNELS = {"Channel": deque([], maxlen=100)}

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('connect')
def connection():
    print("New user connected")

@socketio.on('create channel')
def new_channel(data):
    selection = data['name']
    if selection in CHANNELS:
        emit('used channel', { "name": selection }, broadcast=True)
    else:
        CHANNELS[selection] = deque(maxlen=100)
        emit('new channel', { "name" : selection }, broadcast=True)
        # print(CHANNELS)

@socketio.on('new message')
def new_message(data):
    time = datetime.datetime.now()
    time = time.replace(microsecond=0)
    if 'channel' in data:
        data['created_at'] = str(time)
        CHANNELS[data['channel']].append(data)
        emit('message', data, broadcast=True)

# @socketio.on('join')
# def on_join(data):
#     username = data['name']
#     room = data['channel']
#     join_room(room)
#     send(username + ' has entered the room.', room=room)
# #
# @socketio.on('leave')
# def on_leave(data):
#     username = data['username']
#     room = data['room']
#     leave_room(room)
#     send(username + ' has left the room.', room=room)

@socketio.on('get channels')
def get_channels():
    emit('channels', list(CHANNELS.keys()))
    print(CHANNELS)

@socketio.on('get messages')
def get_messages(data):
    if 'text' in data:
        emit('messages', list(CHANNELS[data['text']]))
