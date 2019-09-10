const INTERVAL = 10;

class Canvas {
    constructor(canvas, arrayLength) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.BAR_WIDTH = 3
        this.HEIGHT_RATIO = 2
        this.arrayLength = arrayLength

        canvas.width = (arrayLength * this.BAR_WIDTH) + 150
        canvas.height = (arrayLength * this.HEIGHT_RATIO) + 10

    }

    setWindow(width, height) {
        this.canvas.width = width
        this.canvas.height = height
    }

    clear() {
        const { canvas, ctx } = this
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    drawText({ name, comparisonCount, swapCount }) {
        const ctx = this.ctx
        const x = ((this.arrayLength * this.BAR_WIDTH) + 10)
        ctx.fillStyle = 'black';
        ctx.font = '15px Arial';
        ctx.fillText(name, x, 13)
        ctx.fillText(`comparision : ${comparisonCount}`, x, 13 + 17)
        ctx.fillText(`swap : ${swapCount}`, x, 13 + 17 * 2)
        ctx.fillText(`total : ${swapCount + comparisonCount}`, x, 13 + 17 * 3)
    }

    drawArray(array, targets = [], color = 'lightGreen') {
        const { BAR_WIDTH, HEIGHT_RATIO } = this
        const ctx = this.ctx        
        array.forEach((num, idx) => {
            const x = idx * BAR_WIDTH
            ctx.fillStyle = (targets.indexOf(idx) > -1) ? color : 'gray'
            ctx.fillRect(x, 0, BAR_WIDTH, (num + 1) * HEIGHT_RATIO)
        });
    }
}

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

    start() {
        this.next(0, true)
    }

    next(step = 0, auto = false) {
        this.canvas.clear()
        this.step = step
        let a = this.array[this.current]
        let b = this.array[this.current + 1]
        const isLast = this.sortedIndex == 0

        this.comparisonCount = this.comparisonCount + 1
        if (a > b) {        
            [this.array[this.current], this.array[this.current + 1]] = [this.array[this.current + 1], this.array[this.current]]
            this.canvas.drawArray(this.array, [this.current,this.current + 1], 'red')
            this.swapCount = this.swapCount + 1
        } else {
            this.canvas.drawArray(this.array, isLast ? [] : [this.current,this.current + 1])
        }
        this.canvas.drawText({ 
            name: 'Bubble sort', 
            comparisonCount: this.comparisonCount, 
            swapCount: this.swapCount 
        })

        if (this.current == this.sortedIndex) {
            this.sortedIndex = this.sortedIndex - 1
            this.current = 0 
        } else {
            this.current = this.current + 1
        }

        if (isLast) {
            console.log({
                type: 'bubble',
                arraySize: this.array.length,
                step: this.step + 1,
                comparisonCount: this.comparisonCount,
                swapCount: this.swapCount
            })
            return 
        }

        if (auto) {
            setTimeout(() => {
                this.next(this.step + 1, true)
            }, INTERVAL)
        }        
    }
}

class SelectionSort {
    constructor(array, canvas) {
        this.array = [...array]
        this.canvas = canvas
        this.step = 0
        this.current = 1
        this.sortedIndex = -1
        this.lowestNumberIndex = 0
        this.comparisonCount = 0
        this.swapCount = 0
    }

    start() {
        this.next(0, true)
    }

    next (step = 0, auto = false) {
        this.canvas.clear()
        this.step = step        
        const lowestNumber = this.array[this.lowestNumberIndex]
        const targetIndex = this.sortedIndex + this.current
        let target = this.array[targetIndex]

        if (lowestNumber > target) {
            this.lowestNumberIndex = targetIndex
        }
        this.comparisonCount = this.comparisonCount + 1

        // reach the end of array
        if (target === undefined) {            
            [this.array[this.sortedIndex + 1], this.array[this.lowestNumberIndex]] = [this.array[this.lowestNumberIndex], this.array[this.sortedIndex + 1]]            
            this.canvas.drawArray(this.array, [this.sortedIndex + 1, this.lowestNumberIndex], 'red')
            this.sortedIndex = this.sortedIndex + 1
            this.lowestNumberIndex = this.sortedIndex + 1
            this.current = 1
            this.swapCount = this.swapCount + 1    
        } else {
            this.canvas.drawArray(this.array, [targetIndex])
        }

        this.canvas.drawText({ 
            name: 'Selection sort', 
            comparisonCount: this.comparisonCount, 
            swapCount: this.swapCount 
        })
        
        this.current = this.current + 1        

        if (this.sortedIndex > array.length) {
            console.log({
                type: 'selection',
                arraySize: this.array.length,
                step: this.step + 1,
                comparisonCount: this.comparisonCount,
                swapCount: this.swapCount
            })
            return
        }
        
        if (auto) {
            setTimeout(() => {
                this.next(this.step + 1, true)
            }, INTERVAL)
        }        
    }
}

const ARRAY_SIZE = 100
const array = [...new Array(ARRAY_SIZE)].map((_, idx) => idx)
const shuffledArray = shuffle(array)

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
const bubbleCanvasElement = document.querySelector('#bubble')
const selectionCanvasElement = document.querySelector('#selection')
const arrayLength = shuffledArray.length

const bubbleCanvas = new Canvas(bubbleCanvasElement, arrayLength)
const selectionCanvas = new Canvas(selectionCanvasElement, arrayLength)

const bubbleSort = new BubbleSort(shuffledArray, bubbleCanvas)
const selectionSort = new SelectionSort(shuffledArray, selectionCanvas)

bubbleSort.start()
selectionSort.start()
