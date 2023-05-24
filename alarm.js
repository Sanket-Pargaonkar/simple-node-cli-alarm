var player = require('play-sound')(opts = {})
const fs = require('fs')
const path = require('path')
const songs = fs.readdirSync(path.join('/home/sanket/', 'Music'))
if(!songs.length) {
	console.error("No songs found in the music directory")
	process.exit(1)
}
let rdm = Math.floor(Math.random() * songs.length)
let songPath = path.join('/home/sanket/', 'Music', songs[rdm])

const ticks = getAlarmTicks()
let counter = 0
let audio;
const interval = setInterval(function () {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	let ticksLeft = ticks - (1000 * counter++)
	process.stdout.write(`Will sound alarm in ${new Date(ticksLeft).toISOString().substring(11, 19)}(hh:mm:ss) @ ${process.argv[2]}`);
	if (ticksLeft <= 0) {
		clearInterval(interval);
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(`Time up. Sounding alarm @ ${process.argv[2]} by playing ${songs[rdm]}`);
	}
}, 1000)


// $ mplayer foo.mp3
const timer = setTimeout(function () {
	audio = player.play(songPath, function (err) {
		if (err) console.error(err)
		console.log("Played song", songs[rdm])

	})
}, getAlarmTicks())

process.on('SIGINT', code => {
	console.log(`process exited with code ${code}`)
	clearInterval(interval)
	clearTimeout(timer)
	//    audio.kill()
})

function getAlarmTicks() {
	try {
		const alarmTime = process.argv[2]
		if (!alarmTime) {
			throw new Error("Please make sure alarm time argument is provided(format : HH:MM)")
		}
		let splitTime = alarmTime.split(":")
		if (!splitTime.length) {
			throw new Error("Unable to parse the alarm time. Please make sure the format is HH:MM")
		}
		let hrs = parseInt(splitTime[0])
		let mins = parseInt(splitTime[1])
		if (!hrs || !mins) {
			throw new Error("Unable to parse the alarm time. Please make sure the format is HH:MM and HH, MM are numbers")
		}
		let date = new Date()
		let alarmDate = new Date()
		setTime(alarmDate, hrs, mins)
		return alarmDate.getTime() - date.getTime()
	} catch (e) {
		console.error(e.toString())
		process.exit(1)
	}
}

function setTime(date, hrs, mins) {

	if (date.getHours() >= hrs && date.getMinutes() >= mins && date.getSeconds() >= 0) {
		throw new Error(`${process.argv[2]} has elapsed current time is ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}. Please set alarm for a later time`)
	}
	date.setHours(hrs)
	date.setMinutes(mins)
	date.setSeconds(0)
}
function setDateToLocalTime(dt) {
	dt.setHours(dt.getHours() + 5)
	dt.setMinutes(dt.getMinutes() + 30)
}
