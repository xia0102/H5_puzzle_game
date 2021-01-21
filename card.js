const cjs = createjs

//  类
class Card extends cjs.Container{
	constructor(img,srcRect){
		super()
		this.init(img,srcRect)
	}
	// 截取卡片
	init(img,srcRect){
		this.bitmap = new cjs.Bitmap(img)
		this.bitmap.sourceRect = srcRect
		this.addChild(this.bitmap)

		this.indexRow = 0
		this.indexCol = 0

		// 正确的位置
		this.rightIndexRow = 0
		this.rightIndexCol = 0

		// 平滑移动
		this.frames = 10
		this.currentFrame = 0
		this.speedX = 0
		this.speedY = 0

		this.width = srcRect.width
		this.height = srcRect.height
	}
	// 检测卡片位置是否正确
	onRightPosition(){
		return this.indexRow === this.rightIndexRow && this.indexCol === this.rightIndexCol
	}
	// 卡片的位置
	resetPositionByIndexRowCol(){
		this.x = this.indexCol * this.width
		this.y = this.indexRow * this.height
	}
	moveToIndex(indexRow,indexCol,endCallback){
		// 平滑移动
		const offsetX = (indexCol - this.indexCol) * this.width
		const offsetY = (indexRow - this.indexRow) * this.height
		this.currentFrame = 0
		this.speedX = offsetX / this.frames
		this.speedY = offsetY / this.frames

		this.indexRow = indexRow
		this.indexCol = indexCol

		this.tickHandler._self = () => {
			this.tickHandler(endCallback)
		}
		cjs.Ticker.addEventListener('tick',this.tickHandler._self)
	}
	// 平滑移动
	tickHandler(endCallback){
		this.x += this.speedX
		this.y += this.speedY
		this.currentFrame++
		if(this.currentFrame >= this.frames){
			cjs.Ticker.removeEventListener('tick',this.tickHandler._self)
			this.resetPositionByIndexRowCol()

			if(endCallback){
				endCallback()
			}
		}
	}
	moveLeft(endCallback){
		this.moveToIndex(this.indexRow,this.indexCol-1,endCallback)
	}
	moveRight(endCallback){
		this.moveToIndex(this.indexRow,this.indexCol+1,endCallback)
	}
	moveUp(endCallback){
		this.moveToIndex(this.indexRow-1,this.indexCol,endCallback)
	}
	moveDown(endCallback){
		this.moveToIndex(this.indexRow+1,this.indexCol,endCallback)
	}
}