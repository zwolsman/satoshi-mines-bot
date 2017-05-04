const co = require("co");
const request = require("co-request");

function* create(bet) {
    const obj = {
        bd: 12,
        player_hash: "57052f28d8bd2f9de974fe6fd2722fe6b354e44b",
        bet: bet / 1000000,
        num_mines: 1
    }
    return yield post('https://satoshimines.com/action/newgame.php', obj)
}

function* guess(gameId, tileId) {
    const obj = {
        game_hash: gameId,
        guess: tileId,
        v04: 1,
    }
    return yield post('https://satoshimines.com/action/checkboard.php', obj)
}

function* cashout(gameId) {
    const obj = {
        game_hash: gameId
    }
    return yield post('https://satoshimines.com/action/cashout.php', obj)
}

function* post(url, data) {
    const result = yield request({
        uri: url,
        method: "POST",
        formData: data,
        json: true
    })
    return result.body
}

module.exports = {
    create: create,
    guess: guess,
    cashout: cashout
}