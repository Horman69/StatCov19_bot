require('dotenv').config();
const
    Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constsnts');
const bot = new Telegraf(process.env.BOT_TOK);
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}!
Узнай статистику по Короне.
Введи на английском название страны и получи статуc.
Посмотреть весь список стран можно комндой /help.
`, Markup.keyboard([
        [" China ", " Russia "],
        [" Egypt ", " Canada "],
    ])
    .resize()
    .extra()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {};
    try {
        data = await api.getReportsByCountries(ctx.message.text);
        const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смерти: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
    `;
        ctx.reply(formatData);
    } catch {
        console.log('Ошибка');
        ctx.reply('Ошибка, такой страны нет');
    }

});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
console.log('Бот запущен');
