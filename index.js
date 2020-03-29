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

/* function addUser(userID, userName)
{
    var s = { id: userID, username: userName };
    fs.readFile("./pmlist.json", function (err, data)
    {
        if (err) throw err;
        if (!(data.length > 0))
        {
            var jstring = "[" + JSON.stringify(s) + "]";
            fs.writeFile("./pmlist.json", jstring, function (err)
            {
                if (err) throw err;
            });
        }
        else
        {
            var json = JSON.parse(data);
            json.push(s);
            fs.writeFile("./pmlist.json", JSON.stringify(json, null, 2), function (err)
            {
                if (err) throw err;
            });
        }
    });
} */

function updatePMList()
{
    fs.writeFile("./pmlist.json", JSON.stringify(userArray, null, 2), function(err)
    {
        if(err) throw err;
    });
}

function retriveUsers()
{
    fs.readFile("./pmlist.json", function (err, data) 
    {
        if (!(data.length > 0)) return;
        else
        {
           userArray = JSON.parse(data);
        }
    });
}

/* function retriveUsers() 
{
    fs.readFile("./pmlist.json", function (err, data) 
    {
        if (!(data.length > 0)) return;
        else
        {
            var pmList = JSON.parse(fs.readFileSync("./pmlist.json"));
            pmList.forEach(user => 
            {
                client.users.fetch(user.id).then((result) => 
                {
                    userArray.push(result);
                }).catch((error) =>
                {
                    console.log("Un-Nice " + error);
                })
            });
        }
    });
} */

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
    if (message.content == "!sub")
    {
        if (!userArray.includes(message.author))
        {
            message.channel.send(message.author.username + " will recieve PM");
            userArray.push(message.author);
            //addUser(message.author.id, message.author.username);
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
        var exists = false;
        for (var i = 0; i < userArray.length; i++)
        {
            if (message.author === userArray[i])
            {
                userArray.splice(i, 1);
                message.channel.send(message.author.username + " will no longer reviece PMs");
                exists = true;
                updatePMList();
            }
        }
        if(!exists) message.channel.send(message.author.username + " is not subbed");
    }
});

//Login to discord with your token
client.login(config.token);