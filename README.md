# chatBot
A dockerized Twitch chatbot that reads chat, waits for commands, and delegates to an external api to take actions or persist data.

The initial !test command pings https://node.whitney.rip and sends a success message in chat if a 200 response received, else prints failure message.

Uses twitchdevelopers' https://gist.github.com/twitchdevelopers/afda75fe0a43453e97e97b25232778de for a jumping off point.

### Requirements
Expects a "config.json" file containing credentials for the bot user. Example Contents:
```
{
  "username": "chatBotTwitchUsername",
  "oauth": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "channel": "targetChannel"
}
```
Twitch suggests getting the oauth token by logging into the chatBot's twitch account and visiting https://twitchapps.com/tmi/.

### Usage

Run locally from source with `node chatBot.js`.

Build & run a docker container: 

`docker build --tag="tobeeandmaymay/chatbot" .`

`docker-compose up -d`

It is expected that the `data.json` file will be linked to a file on the host filesystem in `docker-compose.yml` so we can persist data.
