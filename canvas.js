const ARRAY_SIZE = 100

const canvasElement = document.querySelector('#canvas')

class Canvas {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.BAR_WIDTH = 3
        this.HEIGHT_RATIO = 2
    }

    setWindow(width, height) {
        this.canvas.width = width
        this.canvas.height = height
    }

    clear() {
        const { canvas, ctx } = this
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    drawArray(array, targets = []) {
        const { BAR_WIDTH, HEIGHT_RATIO } = this
        const ctx = this.ctx
        ctx.fillStyle = 'black';
        ctx.font = '15px Arial';
        ctx.fillText('bubble sort', 0, 250)
        array.forEach((num, idx) => {
            const x = idx * BAR_WIDTH
            ctx.fillStyle = (targets.indexOf(idx) > -1) ? 'lightGreen' : 'gray'
            ctx.fillRect(x, 0, BAR_WIDTH, (num + 1) * HEIGHT_RATIO)
        });
    }
}

const array = [...new Array(ARRAY_SIZE)].map((_, idx) => idx)
const shuffledArray = shuffle(array)

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const canvas = new Canvas(canvasElement)
canvas.setWindow(500, 500)

class BubbleSort {
    constructor(array, canvas) {
        this.array = [...array]
        this.canvas = canvas
        this.step = 0
        this.current = 0
        this.sortedIndex = this.array.length
        this.comparisonCount = 0
        this.swapCount = 0
    }

    next(step = 0) {
        this.canvas.clear()
        this.step = step
        let a = this.array[this.current]
        let b = this.array[this.current + 1]

        this.comparisonCount = this.comparisonCount + 1
        if (a > b) {        
            [this.array[this.current], this.array[this.current + 1]] = [this.array[this.current + 1], this.array[this.current]]
            this.canvas.drawArray(this.array, [this.current,this.current + 1])
            this.swapCount = this.swapCount + 1
        } else {
            this.canvas.drawArray(this.array)
        }

        if (this.current == this.sortedIndex) {
            this.sortedIndex = this.sortedIndex - 1
            this.current = 0 
        } else {
            this.current = this.current + 1
        }

        if (this.sortedIndex == 0) {
            console.log({
                type: 'bubble',
                arraySize: this.array.length,
                step: this.step + 1,
                comparisonCount: this.comparisonCount,
                swapCount: this.swapCount
            })
            return 
        }

        setTimeout(() => {
            this.next(this.step + 1)
        }, 1)
    }
}

const bubble = new BubbleSort(shuffledArray, canvas)

bubble.next()

