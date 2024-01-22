// 双色球
class DoubleColorBall {
    isLotterying = false
    redList = Array(32).fill(1).map((item, i) => i + 1)
    blueList = Array(16).fill(1).map((item, i) => i + 1)
    duration = 2000
    startTime = 0
    lotteryTimer = null
    redDomList
    blueBall
    constructor(redBallsCommonSelector, blueBallSelector, duration) {
        this.redDomList = this.selectDom(redBallsCommonSelector, true)
        this.blueBall = this.selectDom(blueBallSelector)
        this.duration = duration || this.duration
    }
    doLottery() {
        if (this.isLotterying) return
        this.isLotterying = true
        const taskQueue = []
        const funcs = []
        this.redDomList.forEach((item, index) => {
            funcs.push(() => {
                const promiseItem = new Promise((resolve) => {
                    // [0,32)  能取得就是0-31
                    const rdm = Math.floor(Math.random() * this.redList.length)
                    item.innerText = this.redList[rdm]
                    this.redList.splice(rdm, 1)
                    window.requestAnimationFrame(resolve)
                })
                taskQueue.push(promiseItem)
                return promiseItem
            })
        })
        funcs.push(() => {
            const promiseItem = new Promise((resolve) => {
                const rdm = Math.floor(Math.random() * this.blueList.length)
                this.blueBall.innerText = this.blueList[rdm]
                window.requestAnimationFrame(resolve)
            })
            taskQueue.push(promiseItem)
            return promiseItem
        })
        funcs.forEach(async item => {
            await item()
        })
        Promise.allSettled(taskQueue).then(() => {
            this.isLotterying = false
            this.redList = Array(32).fill(1).map((item, i) => i + 1)
        })
    }
    doLotteryWithDuration() {
        !this.startTime && (this.startTime = Date.now())
        this.lotteryTimer = setInterval(() => {
            if (Date.now() - this.startTime < this.duration) {
                this.doLottery()
            } else {
                this.startTime = 0
                window.clearInterval(this.lotteryTimer)
            }
        }, 60);
    }
    stopLottery() {
        this.startTime = 0
        this.lotteryTimer && window.clearInterval(this.lotteryTimer)
    }
    selectDom(domSelector, all = false) {
        return document[all ? 'querySelectorAll' : 'querySelector'](domSelector)
    }
    bindingSudden(suddenBtnSelector) {
        this.selectDom(suddenBtnSelector)
            .addEventListener('click', this.doLottery.bind(this))
        return this
    }
    bindingDuration(durationBtnSelector) {
        this.selectDom(durationBtnSelector)
            .addEventListener('click', this.doLotteryWithDuration.bind(this))
        return this
    }
    bindingStop(stopBtnSelector) {
        this.selectDom(stopBtnSelector)
            .addEventListener('click', this.stopLottery.bind(this))
        return this
    }
}
// 每种玩法分开 封装相应的函数  函数对应接受 dom选择器  以及其他一些参数 

// 排列三排列五
class Permutation {
    ballList3
    ballList5
    startTime = 0
    duration = 2000
    isLotterying = false
    currentLotteryResult = []
    constructor({ ballPermutation3Selector, ballPermutation5Selector, duration }) {
        ballPermutation3Selector && (this.ballList3 = this.selectDom(ballPermutation3Selector, true))
        ballPermutation5Selector && (this.ballList5 = this.selectDom(ballPermutation5Selector, true))
        duration && (this.duration = duration)
    }
    getRandomNum() {
        return Math.floor(10 * Math.random())
    }
    doLottery() {
        if (this.isLotterying) return
        this.isLotterying = true
        const funcs = []
        const taskQueue = []
        this.ballList5.forEach((item, i) => {
            funcs.push(() => {
                const promiseItem = new Promise((resolve) => {
                    const randomNum = this.getRandomNum()
                    this.currentLotteryResult.push(randomNum)
                    item.innerText = randomNum
                    if (i < 3 && this.ballList3) {
                        this.ballList3[i].innerText = randomNum
                    }
                    window.requestAnimationFrame(resolve)
                })
                taskQueue.push(promiseItem)
                return promiseItem
            })
            funcs.forEach(async item => {
                await item()
            })
            Promise.allSettled(taskQueue)
                .then(() => {
                    this.isLotterying = false
                })
        })
    }
    doLotteryWithDuration() {
        !this.startTime && (this.startTime = Date.now())
        this.lotteryTimer = setInterval(() => {
            if (Date.now() - this.startTime < this.duration) {
                this.doLottery()
            } else {
                this.startTime = 0
                window.clearInterval(this.lotteryTimer)
            }
        }, 60);
    }
    stopLottery() {
        this.startTime = 0
        this.lotteryTimer && window.clearInterval(this.lotteryTimer)
    }
    selectDom(domSelector, all = false) {
        return document[all ? 'querySelectorAll' : 'querySelector'](domSelector)
    }
    bindingSudden(suddenBtnSelector) {
        this.selectDom(suddenBtnSelector)
            .addEventListener('click', this.doLottery.bind(this))
        return this
    }
    bindingDuration(durationBtnSelector) {
        this.selectDom(durationBtnSelector)
            .addEventListener('click', this.doLotteryWithDuration.bind(this))
        return this
    }
    bindingStop(stopBtnSelector) {
        this.selectDom(stopBtnSelector)
            .addEventListener('click', this.stopLottery.bind(this))
        return this
    }
}

// 大乐透
class BigLottery {
    isLotterying = false
    frontList = Array(35).fill(1).map((item, i) => i + 1)
    backList = Array(12).fill(1).map((item, i) => i + 1)
    duration = 8000
    startTime = 0
    lotteryTimer = null
    frontDomList
    backDomList
    constructor({ frontBallsCommonSelector, backBallSelector, duration }) {
        this.frontDomList = this.selectDom(frontBallsCommonSelector, true)
        this.backDomList = this.selectDom(backBallSelector, true)
        this.duration = duration || this.duration
    }
    doLottery() {
        if (this.isLotterying) return
        this.isLotterying = true
        const taskQueue = []
        const funcs = []
        this.frontDomList.forEach((item, index) => {
            funcs.push(() => {
                const promiseItem = new Promise((resolve) => {
                    const rdm = Math.floor(Math.random() * this.frontList.length)
                    item.innerText = this.frontList[rdm]
                    this.frontList.splice(rdm, 1)
                    window.requestAnimationFrame(resolve)
                })
                taskQueue.push(promiseItem)
                return promiseItem
            })
        })
        this.backDomList.forEach((item, index) => {
            funcs.push(() => {
                const promiseItem = new Promise((resolve) => {
                    const rdm = Math.floor(Math.random() * this.backList.length)
                    item.innerText = this.backList[rdm]
                    this.backList.splice(rdm, 1)
                    window.requestAnimationFrame(resolve)
                })
                taskQueue.push(promiseItem)
                return promiseItem
            })
        })
        funcs.forEach(async item => {
            await item()
        })
        Promise.allSettled(taskQueue).then(() => {
            this.isLotterying = false
            this.frontList = Array(35).fill(1).map((item, i) => i + 1)
            this.backList = Array(12).fill(1).map((item, i) => i + 1)
        })
    }
    doLotteryWithDuration() {
        !this.startTime && (this.startTime = Date.now())
        this.lotteryTimer = setInterval(() => {
            if (Date.now() - this.startTime < this.duration) {
                this.doLottery()
            } else {
                this.startTime = 0
                window.clearInterval(this.lotteryTimer)
            }
        }, 60);
    }
    stopLottery() {
        this.startTime = 0
        this.lotteryTimer && window.clearInterval(this.lotteryTimer)
    }
    selectDom(domSelector, all = false) {
        return document[all ? 'querySelectorAll' : 'querySelector'](domSelector)
    }
    bindingSudden(suddenBtnSelector) {
        this.selectDom(suddenBtnSelector)
            .addEventListener('click', this.doLottery.bind(this))
        return this
    }
    bindingDuration(durationBtnSelector) {
        this.selectDom(durationBtnSelector)
            .addEventListener('click', this.doLotteryWithDuration.bind(this))
        return this
    }
    bindingStop(stopBtnSelector) {
        this.selectDom(stopBtnSelector)
            .addEventListener('click', this.stopLottery.bind(this))
        return this
    }
}

// 七星彩
class SevenStars {
    sevenFrontList
    sevenBackList
    startTime = 0
    duration = 2000
    isLotterying = false
    constructor({ sevenStarFrontSelector, sevenStarBackSelector, duration }) {
        sevenStarFrontSelector && (this.sevenFrontList = this.selectDom(sevenStarFrontSelector, true))
        sevenStarBackSelector && (this.sevenBackList = this.selectDom(sevenStarBackSelector, true))
        duration && (this.duration = duration)
    }
    getRandomNum(maxRange=9) {
        return Math.floor((maxRange + 1) * Math.random())
    }
    doLottery() {
        if (this.isLotterying) return
        this.isLotterying = true
        const funcs = []
        const taskQueue = []
        this.sevenFrontList.forEach((item, i) => {
            funcs.push(() => {
                const promiseItem = new Promise((resolve) => {
                    const randomNum = this.getRandomNum()
                    item.innerText = randomNum
                    window.requestAnimationFrame(resolve)
                })
                taskQueue.push(promiseItem)
                return promiseItem
            })
        })
        this.sevenBackList.forEach((item, i) => {
            funcs.push(() => {
                const promiseItem = new Promise((resolve) => {
                    const randomNum = this.getRandomNum(14)
                    item.innerText = randomNum
                    window.requestAnimationFrame(resolve)
                })
                taskQueue.push(promiseItem)
                return promiseItem
            })
        })
        funcs.forEach(async item => {
            await item()
        })
        Promise.allSettled(taskQueue)
            .then(() => {
                this.isLotterying = false
            })
    }
    doLotteryWithDuration() {
        !this.startTime && (this.startTime = Date.now())
        this.lotteryTimer = setInterval(() => {
            if (Date.now() - this.startTime < this.duration) {
                this.doLottery()
            } else {
                this.startTime = 0
                window.clearInterval(this.lotteryTimer)
            }
        }, 60);
    }
    stopLottery() {
        this.startTime = 0
        this.lotteryTimer && window.clearInterval(this.lotteryTimer)
    }
    selectDom(domSelector, all = false) {
        return document[all ? 'querySelectorAll' : 'querySelector'](domSelector)
    }
    bindingSudden(suddenBtnSelector) {
        this.selectDom(suddenBtnSelector)
            .addEventListener('click', this.doLottery.bind(this))
        return this
    }
    bindingDuration(durationBtnSelector) {
        this.selectDom(durationBtnSelector)
            .addEventListener('click', this.doLotteryWithDuration.bind(this))
        return this
    }
    bindingStop(stopBtnSelector) {
        this.selectDom(stopBtnSelector)
            .addEventListener('click', this.stopLottery.bind(this))
        return this
    }
}
