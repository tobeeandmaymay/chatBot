const fs = require("fs");
const tmi = require('tmi.js');
const request = require('request');
const config = require('./config.json');

// Read data file
var data = null;
try {
    let rawJSON = fs.readFileSync('./data.json');
    data = JSON.parse(rawJSON);
} catch (err) {
    console.log(`Error reading data from disk: ${err}`);
    process.exit(1)
}
formatData();
var lastSync = new Date();

// Read config
const opts = {
    identity: {
        username: config.username,
        password: config.oauth
    },
    channels: [
        config.channel
    ]
};

//Connect to Twitch & setup handlers
const client = new tmi.client(opts);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.connect();

//Successful connection event
function onConnectedHandler (addr, port) {
    console.log(`Connected to ${addr}:${port}`);
}

//Read chat & delegate commands.
function onMessageHandler (channel, context, msg, self) {
    if (self) { return; } //Ignore messages from this bot

    //Remove whitespace from chat message
    const commandName = msg.trim();

    //(if/else) Chain of command
    if (commandName === '!commands') {
        console.log("User " + context.username + " requested command !commands.");
        commands(channel, context);
    } else if (commandName === '!feed') {
        console.log("User " + context.username + " requested command !feed.");
        feed(channel, context);
    } else if (commandName === '!test') {
        console.log("User " + context.username + " requested command !http.");
        http(channel, context);
    } else if (commandName === '!meow') {
        console.log("User " + context.username + " requested command !meow.");
        meow(channel, context);
    } else {
        console.log(`Unknown command ${commandName}`);
    }

    //Serialize data if necessary
    var curTime = new Date();
        if(Math.abs(curTime.getTime() - lastSync.getTime()) > 3600000){
            console.log("Syncing chatbot data... Time since last sync: " + Math.abs(curTime.getTime() - lastSync.getTime()))
            syncData();
            lastSync = curTime;
        }
}

function commands (channel, context) {
    client.say(channel, "@" + context.username + ": !commands !feed !meow");
}

function feed (channel, context) {
    client.say(channel, "@" + context.username + ": Function not implemented yet, sorry!");
}

function http (channel, context) {
    request('https://node.whitney.rip', {json: true}, (error, response, body) => {
        username = context.username
        if(error) {
            client.say(channel, "@" + username + ": Response not recorded! Try again!");
            return console.log(error);
        }
        if(response.statusCode == 200){
            client.say(channel, "@" + username + ": Response recorded!");
        } else {
            client.say(channel, "@" + username + ": Response not recorded! Try again!");
        }
    });
}

function meow (channel, context) {
    if (data["meows"] == null) {
        data["meows"] = 1;
    } else {
        data["meows"] = data["meows"] + 1;
    }
    client.say(channel, "@" + context.username + " just sent a meow with the !meow command! There have been " + data["meows"] + " meows made so far!");
}

function syncData () {
    try {
        let jsonString = JSON.stringify(data);
        fs.writeFileSync('./data.json', jsonString)
    } catch (err) {
        console.log(`Error writing data to disk: ${err}`);
        process.exit(1)
    }
}

function formatData () {
    //nothing yet
}


