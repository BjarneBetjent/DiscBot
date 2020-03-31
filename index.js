const Discord = require('discord.js');
const config = require('./config.json');
const Promise = require('promise');
var fs = require('fs');
const path = require('path');
const jsonTamerFile = "./pmlist.json";
const jsonBossFile = "./pmlistboss.json";

var userArrayTamer = [];
var userArrayBoss = [];

const dirPathTamer = path.join("D:", "Games", "UO", "UOS", "Snapshots", "Lvl6spider");
const dirPathBoss = path.join("D:", "Games", "UO", "UOS", "Snapshots", "KaD");

const client = new Discord.Client();

client.once('ready', () =>
{
    setInterval(checkNewFileTamer, 5 * 1000);
    setInterval(checkNewFileBoss, 5 * 1000);
    retriveUsers();
    console.log('Ready!');
});

//Update the JSON file when a user have subbed or unsubbed
function updatePMListTamer()
{
    fs.writeFile(jsonTamerFile, JSON.stringify(userArrayTamer, null, 2), function (err)
    {
        if (err) throw err;
    });
}

function updatePMListBoss()
{
    fs.writeFile(jsonBossFile, JSON.stringify(userArrayBoss, null, 2), function (err)
    {
        if (err) throw err;
    });
}

//Get all the users form the JSON file upon bot startup
function retriveUsers()
{
    fs.readFile(jsonTamerFile, function (err, data) 
    {
        if (!(data.length > 0)) return;
        else
        {
            var dataArray = JSON.parse(data);
            for (var i = 0; i < dataArray.length; i++)
            {
                userArrayTamer.push(new Discord.User(client, dataArray[i]));
            }
        }
    });
    fs.readFile(jsonBossFile, function (err, data) 
    {
        if (!(data.length > 0)) return;
        else
        {
            var dataArray = JSON.parse(data);
            for (var i = 0; i < dataArray.length; i++)
            {
                userArrayBoss.push(new Discord.User(client, dataArray[i]));
            }
        }
    });
}

//Check if a new file has been created in the given directory
//If a file has been created, delete it
function checkNewFileTamer()
{
    fs.readdir(dirPathTamer, function (err, files)
    {
        if (err) console.log("unable to scan dir");
        else
        {
            if (files.length > 0)
            {
                files.forEach(function (file)
                {
                    var filePath = path.join(dirPathTamer, file);
                    fs.unlink(filePath, function (err)
                    {
                        if (err) throw err;
                        console.log(filePath + " has been deleted");
                    });
                });
                for (var i = 0; i < userArrayTamer.length; i++)
                {
                    userArrayTamer[i].send("Beep Boop ALAM ALAM");
                }
            }
        }
    });
}

function checkNewFileBoss()
{
    fs.readdir(dirPathBoss, function (err, files)
    {
        if (err) console.log("unable to scan dir");
        else
        {
            if (files.length > 0)
            {
                files.forEach(function (file)
                {
                    var filePath = path.join(dirPathBoss, file);
                    fs.unlink(filePath, function (err)
                    {
                        if (err) throw err;
                        console.log(filePath + " has been deleted");
                    });
                });
                for (var i = 0; i < userArrayBoss.length; i++)
                {
                    userArrayBoss[i].send("Shits going down at arch/lich");
                }
            }
        }
    });
}

client.on('message', message =>
{
    var isSubbedTamer = false, indexTamer;
    var isSubbedBoss = false, indexBoss;
    for (var i = 0; i < userArrayTamer.length; i++)
    {
        if (message.author.id == userArrayTamer[i].id)
        {
            isSubbedTamer = true;
            indexTamer = i;
        }
    }
    for (var i = 0; i < userArrayBoss.length; i++)
    {
        if (message.author.id == userArrayBoss[i].id)
        {
            isSubbedBoss = true;
            indexBoss = i;
        }
    }

    if (message.content == "!sub tamer")
    {
        if (!isSubbedTamer) 
        {
            message.channel.send(message.author.username + " will recieve PM regarding the tamer");
            userArrayTamer.push(message.author);
            updatePMListTamer();
        }
        else message.channel.send(message.author.username + " is already subbed to the tamer!");
    }
    else if (message.content == "!sub boss")
    {
        if (!isSubbedBoss) 
        {
            message.channel.send(message.author.username + " will recieve PM regarding the bosses");
            userArrayBoss.push(message.author);
            updatePMListBoss();
        }
        else message.channel.send(message.author.username + " is already subbed to the bosses!");
    }
    else if (message.content == "!sublist")
    {
        if (userArrayTamer.length < 1 && userArrayBoss.length < 1) message.channel.send("No one is subbed");
        else
        {
            var s = "```\nSubbed to tamer updates:\n";
            for (var i = 0; i < userArrayTamer.length; i++)
            {
                s += "- " + userArrayTamer[i].username + "\n";
            }
            s += "\nSubbed to boss updates:\n"; 

            for (var i = 0; i < userArrayBoss.length; i++)
            {
                s += "- " + userArrayBoss[i].username + "\n";
            }
            s += "```"
            message.channel.send(s);
        }

    }    
    else if (message.content == "!unsub tamer")
    {
        if (isSubbedTamer)
        {
            userArrayTamer.splice(indexTamer, 1);
            message.channel.send(message.author.username + " will no longer reviece PMs regarding tamer updates");
            updatePMListTamer();
        }
        else message.channel.send(message.author.username + " is not subbed to the tamer alerts");
    }
    else if (message.content == "!unsub boss")
    {
        if (isSubbedBoss)
        {
            userArrayBoss.splice(indexBoss, 1);
            message.channel.send(message.author.username + " will no longer reviece PMs regarding boss updates");
            updatePMListTamer();
        }
        else message.channel.send(message.author.username + " is not subbed to the boss alerts");
    }
});

client.login(config.token);