let name = null;
let roomNo = null;
let socket=null;
let chat= io.connect('/chat');



/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    checkSupport();
    initChatSocket();
    //@todo here is where you should initialise the socket operations as described in teh lectures (room joining, chat message receipt etc.)
}

function checkSupport() {
    //check for support
    if ('indexedDB' in window) {
        //Init the index db database if support
        initDatabase();
        console.log("Index DB is ok!");
    } else {
        //Otherwise log error information
        console.log('This browser doesn\'t support IndexedDB');
    }

}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}
/**
 * it initialises the socket for /chat
 */

function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnChatHistory('<b>' + userId + '</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    chat.on('chat', function (room, userId, chatText) {
        let who = userId;
        if (userId === name) who = 'Me';
        writeOnChatHistory('<b>' + who + ':</b> ' + chatText);
    });

}
/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    chat.emit('chat', roomNo, name, chatText);
    // @todo send the chat message
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;

    let url = document.getElementById('image_url').value;
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let description = document.getElementById('description').value;

    imageData = {image: url, author: author, title: title, description: description};
    console.log(imageData);

    let imageUrl= document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    chat.emit('create or join', roomNo, name);

    //@todo join the room
    initCanvas(socket, imageUrl);
    hideLoginInterface(roomNo, name);
    $.post({
        url : "/chatRecords",
        data : JSON.stringify({
            "roomNo": roomNo
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        success : function(arr) {
            if (arr != undefined && arr != null) {
                var len = arr.length;
                for(var i = 0; i < len; i++) {
                    var entity = arr[i];
                    var chatText = entity.chatText;
                    let who = entity.userId;
                    if (userId === name) who = 'Me';
                    writeOnChatHistory('<b>' + who + ':</b> ' + chatText);
                }
            }

        },
        error : function(e) {

        }
    });
    sendAjaxQuery('/imageRoute', imageData);
}

function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            // in order to have the object printed by alert
            // we need to JSON.stringify the object
            storeCachedData(dataR);

        },
        error: function (response) {
            // the error structure we passed is in the field responseText
            // it is a string, even if we returned as JSON
            // if you want o unpack it you must do:
            // const dataR= JSON.parse(response.responseText)
            console.log(response.responseText);
        }
    });
}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnChatHistory(text) {
    if (text==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}
//Service worker here
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope:', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

