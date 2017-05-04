const api = require('./api')
const co = require('co')
const chalk = require('chalk')
const randomInt = require('random-int')
const MIN_BET = 100

function kelly(base) {
    let p = 22 / 25 //kans om GEEN bom te raken
    let b = 1.13 //multiplier
    let fraction = (p * (b + 1) - 1) / b
    let result = Math.floor(fraction * base / 2)
    return result < MIN_BET ? MIN_BET : result
}

co(function* () {

    let start = 1000
    let target = 5000
    let bank = start

    let count = 0
    while (bank >= MIN_BET && bank < target) {

        //let bet = bank * 0.025
        //if(bet < 100) bet = 100
        let bet = kelly(bank)
     
        let game = yield api.create(bet)
        if(game.game_hash == null) 
            continue //sometimes NULL

        bank -= bet
        count++

        let guess = yield api.guess(game.game_hash, randomInt(1, 25))
        let success = guess.outcome == 'bitcoins'
        if (success) {
            let points = Math.floor(guess.stake * 1000000)
            bank += points
            yield api.cashout(game.game_hash)
            console.log(chalk.green('won'), chalk.yellow(points - bet), 'points, bank', chalk.yellow(bank), 'bet', chalk.yellow(bet), 'game', chalk.yellow(count))
        } else {
            console.log(chalk.red('lost'), chalk.yellow(bet), 'points, bank', chalk.yellow(bank), 'bet', chalk.yellow(bet), 'game', chalk.yellow(count))
        }
    }
    if (bank < target)
        console.log(chalk.red("YOU LOST"), 'bank is empty, games played', chalk.yellow(count))
    else
        console.log(chalk.green('YOU WON'), 'started with', chalk.yellow(start), 'ended with', chalk.yellow(bank), 'gained in', chalk.yellow(count), 'games')

}).catch((err) => {
    console.log(err)
})