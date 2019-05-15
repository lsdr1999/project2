document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(
        location.protocol + '//' + document.domain + ':' + location.port
    );

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

        document.querySelector('#username-txt').onkeyup = () => {
            username = document.querySelector('#username-txt').value.trim();
            if (username.length > 0)
                document.querySelector('#button').disabled = false;
            else
                document.querySelector('#button').disabled = true;
        };

        document.querySelector('#button').onclick = () => {
            username = document.getElementById("username-txt").value.trim();
            if (!localStorage.getItem('username')) {
                localStorage.setItem('username', username);
            }
            else
                localStorage.getItem('username');
        };

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

        document.querySelector('#add-channel').onclick = e => {
            e.preventDefault();
            let name = document.querySelector('#channel-name').value.trim()
            socket.emit('create channel', { name });
            document.querySelector("#channel-name").value = "";

            // if (!localStorage.getItem('channel')) {
                // localStorage.setItem('channel', name);
            // }
            // else
            //     localStorage.getItem('channel');
            localStorage.setItem('channel', name);
        };

        // document.querySelector('#message-text').onkeyup = () => {
        //     message = document.querySelector('#message-text').value;
        //     if (message.length > 0)
        //         document.querySelector('#message-send').disabled = false;
        //     else
        //         document.querySelector('#message-send').disabled = true;
        // };

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
        socket.emit("get channels");

        if (localStorage.getItem("channel")) {
            socket.emit("get messages", { text: localStorage.getItem("text") });
        }
    });

    socket.on('new channel', data => {
        let channellist = document.getElementById("channel-list");
        let listitem = document.createElement("li");
        listitem.classList.add("list-group-item");
        listitem.innerHTML = `${data.name}`;
        channellist.appendChild(listitem);

        $('.list-group-item').on('click', function() {
            $('.list-group-item').removeClass('active');
            $(this).addClass('active');
        });

        listitem.onclick = () => {
            // let name = document.querySelector('#channel-name').value.trim()
            // localStorage.setItem('channel', name);
            // socket.emit('join', { name });
            let title = document.querySelector("#channel-label");
            title.innerHTML = `Channel: ${data.name}`;
        };
    });

    socket.on('used channel', data => {
        alert("This channel(name) already exists")
    });

    socket.on('message', data => {
      if (localStorage.getItem("channel") == data.channel) {
          let messagelist = document.getElementById("message-list");
          let listtext = document.createElement("li");
          listtext.classList.add("list-group-item");
          listtext.innerHTML = `${data.username}:
                                ${data.text}
                                <small class="text-muted d-flex justify-content-center">${
                                    data.created_at}</small>`;
          messagelist.appendChild(listtext);

          messagelist.scrollTop = messagelist.scrollHeight - messagelist.clientHeight;
      };
    });

    socket.on('channels', data => {
        let channellist = document.querySelector("#channel-list");
        channellist.innerHTML = "";

        for (channel in data) {
                let channellist = document.getElementById("channel-list");
                let listitem = document.createElement("li");
                listitem.classList.add("list-group-item");
                listitem.innerHTML = `${data.name}`;
                channellist.appendChild(listitem);

            $('.list-group-item').on('click', function() {
                $('.list-group-item').removeClass('active');
                $(this).addClass('active');
            });

            listitem.onclick = () => {
                // socket.emit('join', { name });
                // localStorage.setItem("channel", name);
                let title = document.querySelector("#channel-label");
                title.innerHTML = `Channel: ${data.name}`;
            };
        };
    });

    // socket.on('messages', data => {
    //     let messagelist = document.querySelector("#message-list");
    //     messagelist.innerHTML = "";
    //
    //       if (localStorage.getItem("channel") == data.channel) {
    //           let messagelist = document.getElementById("message-list");
    //           let listtext = document.createElement("li");
    //           listtext.classList.add("list-group-item");
    //           listtext.innerHTML = `${data.username}: ${data.text} <small class="text-muted d-flex justify-content-center">${
    //               data.created_at}</small>`;
    //           messagelist.appendChild(listtext);
    //
    //           messagelist.scrollTop = messagelist.scrollHeight - messagelist.clientHeight;
    //       };
    //   });
});
