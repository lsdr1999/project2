import os
import requests
import datetime

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room

from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

CHANNELS = {"Channel": deque([], maxlen=100)}

@app.route("/")
def index():
    """Go to the main page of the webapp"""
    return render_template("index.html")

@socketio.on('connect')
def connection():
    """Shows all active channels"""
    emit('channels', list(CHANNELS.keys()), broadcast=True)

@socketio.on('create channel')
def new_channel(data):
    """Checks if channel exists and adds channel if not existing"""
    selection = data['name']
    if selection in CHANNELS:
        emit('used channel', { "name": selection }, broadcast=True)
    else:
        CHANNELS[selection] = deque(maxlen=100)
        emit('channels', list(CHANNELS.keys()), broadcast=True)

@socketio.on('new message')
def new_message(data):
    """Adds a message to selected channel"""
    time = datetime.datetime.now()
    time = time.replace(microsecond=0)
    if data['channel'] in CHANNELS:
        data['created_at'] = str(time)
        CHANNELS[data['channel']].append(data)
        emit('message', list(CHANNELS[data['channel']]), broadcast=True)

@socketio.on('join')
def on_join(data):
    """User can join room, used for personal touch"""
    username = data['username']
    room = data['channel']
    join_room(room)
    emit('user join', { "username": username }, room=room)

@socketio.on('leave')
def on_leave(data):
    """User can leave room, used for personal touch"""    
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('user leave', { "username": username }, room=room)
