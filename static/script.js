document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // If user has logged in before, no log in page will show
    if (localStorage.getItem('username')) {
        $(window).on('load',function(){
            $('#myModal').modal('hide');
            document.querySelector('#button').disabled = true;
        });
    }
    // If the user is new, a log in page will show
    else
        $(window).on('load',function(){
            $('#myModal').modal('show');
            $('#myModal').modal({
                backdrop: 'static',
                keyboard: false
            })
            document.querySelector('#button').disabled = true;
        });

    // When the user is connected
    socket.on('connect', () => {

        // Make sure the user puts in an username, delete all whitespacing
        document.querySelector('#username-txt').onkeyup = () => {
            username = document.querySelector('#username-txt').value.trim();
            if (username.length > 0)
                document.querySelector('#button').disabled = false;
            else
                document.querySelector('#button').disabled = true;
        };

        // Store username for the future
        document.querySelector('#button').onclick = () => {
            username = document.getElementById("username-txt").value.trim();
            if (!localStorage.getItem('username')) {
                localStorage.setItem('username', username);
            }
            else
                localStorage.getItem('username');
            localStorage.setItem('channel', 'Channel');
        };

        // User can create a channel, with minor constrictions
        document.querySelector('#add-channel').disabled = true;
        document.querySelector('#channel-name').onkeyup = () => {
            channelname = document.querySelector('#channel-name').value.trim();
            if (channelname.length > 0)
                document.querySelector('#add-channel').disabled = false;
            else
                document.querySelector('#add-channel').disabled = true;
            if (channelname.length > 15)
                document.querySelector('#add-channel').disabled = true;
        };

        // Emit channel to server
        document.querySelector('#add-channel').onclick = e => {
            e.preventDefault();
            let name = document.querySelector('#channel-name').value.trim()
            socket.emit('create channel', { name });
            document.querySelector("#channel-name").value = "";
        };

        // Emit message to server
        document.querySelector('#message-send').onclick = e => {
            e.preventDefault();
            let text = document.querySelector('#message-text').value
            let channel = localStorage.getItem("channel");
            socket.emit("new message", {
                text,
                channel,
                username: localStorage.getItem("username")
            });
            document.querySelector("#message-text").value = "";
        };
    });

    // Gets data from server and displays it (all channels)
    socket.on('channels', data => {
        let channellist = document.querySelector("#channel-list");
        channellist.innerHTML = "";

        for (channel of data) {
            let channellist = document.getElementById("channel-list");
            let listitem = document.createElement("li");
            listitem.classList.add("list-group-item");
            listitem.innerHTML = channel;
            channellist.appendChild(listitem);

            $('.list-group-item').on('click', function() {
                $('.list-group-item').removeClass('active');
                $(this).addClass('active');
                channel = $(this).text();
                listitemclick(channel)
            });
        };
    });

    // Gets data from server and displays it
    socket.on('used channel', data => {
        alert("This channel(name) already exists")
    });

    // Gets data from server and displays it (user joins)
    socket.on('user join', username => {
        let messagelist = document.querySelector("#alert-list");
        messagelist.innerHTML = "";
        let listtext = document.createElement("li");
        listtext.classList.add("list-group-item");
        listtext.innerHTML = `<strong id="dezeniet">${username.username}</strong> has entered the room.`
        messagelist.appendChild(listtext);
    });

    // Gets data from server and displays it (user leaves)
    socket.on('user leave', username => {
        let messagelist = document.querySelector("#alert-list");
        messagelist.innerHTML = "";
        let listtext = document.createElement("li");
        listtext.classList.add("list-group-item");
        listtext.innerHTML = `<strong id="dezeniet">${username.username}</strong> has left the room.`
        messagelist.appendChild(listtext);
    });

    // Gets data from server and displays it (all messages in channel)
    socket.on('message', data => {
        let messagelist = document.querySelector("#message-list");
        messagelist.innerHTML = "";

        for (message of data) {
            let messagelist = document.getElementById("message-list");
            let listtext = document.createElement("li");
            listtext.classList.add("list-group-item");
            listtext.innerHTML = `<strong id="dezeniet">${message.username}</strong>: ${message.text}
                                    <small id="dezeniet" class="text-muted d-flex justify-content-center">
                                    ${message.created_at}</small>`;
            messagelist.appendChild(listtext);
            messagelist.scrollTop = messagelist.scrollHeight - messagelist.clientHeight;
        };
    });

    // Function which runs after channel has been selected
    function listitemclick(channel) {
        let title = document.querySelector("#channel-label");
        title.innerHTML = `Channel: ${channel}`;

        localStorage.getItem('channel');
        let messagelist = document.querySelector("#message-list");
        messagelist.innerHTML = "";
        socket.emit('leave', {
            room: localStorage.getItem("channel"),
            username: localStorage.getItem("username")
        });
        localStorage.setItem('channel', channel);
        socket.emit('join', {
            channel: localStorage.getItem("channel"),
            username: localStorage.getItem("username")
        });
        socket.emit('new message', { channel: localStorage.getItem('channel') })
    };
});
