const Discord = require('discord.js');
const config = require('./config.json');
const Promise = require('promise');
var fs = require('fs');
const path = require('path');

var userArray = [];

const dirPath = path.join("D:", "Games", "UO", "UOS", "Snapshots", "Lvl6spider");

const client = new Discord.Client();

client.once('ready', () =>
{
    console.log('Ready!');
    setInterval(checkNewFile, 5 * 1000);
    retriveUsers();
});

//Update the JSON file when a user have subbed or unsubbed
function updatePMList()
{
    fs.writeFile("./pmlist.json", JSON.stringify(userArray, null, 2), function (err)
    {
        if (err) throw err;
    });
}

//Get all the users form the JSON file upon bot startup
function retriveUsers()
{
    fs.readFile("./pmlist.json", function (err, data) 
    {
        if (!(data.length > 0)) return;
        else
        {
            var dataArray = JSON.parse(data);
            for (var i = 0; i < dataArray.length; i++)
            {
                userArray.push(new Discord.User(client, dataArray[i]));
            }
        }
    });
}

//Check if a new file has been created in the given directory
//If a file has been created, delete it
function checkNewFile()
{
    fs.readdir(dirPath, function (err, files)
    {
        if (err) console.log("unable to scan dir");
        else
        {
            if (files.length > 0)
            {
                files.forEach(function (file)
                {
                    var filePath = path.join(dirPath, file);
                    fs.unlink(filePath, function (err)
                    {
                        if (err) throw err;
                        console.log(filePath + " has been deleted");
                    });
                });
                for (var i = 0; i < userArray.length; i++)
                {
                    userArray[i].send("Beep Boop ALAM ALAM");
                }
            }
        }
    });
}

client.on('message', message =>
{
    var isSubbed = false, index;
    for (var i = 0; i < userArray.length; i++)
    {
        if (message.author.id == userArray[i].id)
        {
            isSubbed = true;
            index = i;
        }
    }

    if (message.content == "!sub")
    {
        if (!isSubbed) 
        {
            message.channel.send(message.author.username + " will recieve PM");
            userArray.push(message.author);
            updatePMList();
        }
        else message.channel.send(message.author.username + " is already subbed!");
    }
    else if (message.content == "!sublist")
    {
        if (userArray.length < 1) message.channel.send("No one is subbed");
        else
        {
            var s = "```\n";
            for (var i = 0; i < userArray.length; i++)
            {
                s += "- " + userArray[i].username + "\n";
            }
            s += "```"
            message.channel.send(s);
        }

    }
    else if (message.content == "!unsub")
    {
        if (isSubbed)
        {
            userArray.splice(index, 1);
            message.channel.send(message.author.username + " will no longer reviece PMs");
            updatePMList();
        }
        else message.channel.send(message.author.username + " is not subbed");
    }
});

client.login(config.token);