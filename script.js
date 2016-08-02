'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say('Salam kenal saya Kadek Prabudi.\nTunggu sebentar pak ya..'))
                .then(() => 'speak');
        }
    },
    
    askName: {
        prompt: (bot) => bot.say('Btw..nama siapa gan?'),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say(`Salam kenal pak ${name}\ngimana kabar nih?`))
                .then(() => 'speak');
        }
    },
    

     speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();
             
            

            function updateSilent() {
                switch (upperText) {
                    case "BOT OFF":
                        return bot.setProp("silent", true);
                    case "BOT ON":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(`Pertanyaan tidak dikenal\n %[HELP](postback:HELP) %[BOT OFF](postback:BOT_OFF) `).then(() => 'speak');
                }
      //          if (!scriptRules.match(upperText)) {
      //              return bot.say(`maksudnya?.`).then(() => 'speak');
      //          }


                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
