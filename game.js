var canvas = document.getElementById('gameCanvas')
var ctx = canvas.getContext('2d')

// Ball variables
var ballRadius = 10
var x = canvas.width / 2
var y = canvas.height - 30
var dx = 2
var dy = -2
var currentSpeed = 2

// Paddle variables
var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width - paddleWidth) / 2
var rightPressed = false
var leftPressed = false
var paddleSpeed = 0
var paddleMaxSpeed = 3
var paddleAcceleration = 0.5

//  Brick variables
var brickRowCount = 3
var brickColumnCount = 5
var brickWidth = 75
var brickHeight = 20
var brickPadding = 10
var brickOffsetTop = 30
var brickOffsetLeft = 30

var score = 0
var rPressed = false

var bricks = []
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)

function drawBall () {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawBricks () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function collisionDetection () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r]
      if (b.status === 1) {
        if (x - ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score += 1
        }
      }
    }
  }
}

function paddleMove () {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    if (paddleSpeed < paddleMaxSpeed) {
      paddleSpeed += paddleAcceleration
    }
    paddleX += paddleSpeed
  } else if (leftPressed && paddleX > 0) {
    if (paddleSpeed > -paddleMaxSpeed) {
      paddleSpeed -= paddleAcceleration
    }
  } else {
    if (paddleSpeed > 0) {
      paddleSpeed -= paddleAcceleration
    } else if (paddleSpeed < 0) {
      paddleSpeed += paddleAcceleration
    }
  }
  paddleX += paddleSpeed
}

function mouseMoveHandler (e) {
  var relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}

function wallBounce () {
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
      bricks = []
      for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (var r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
      }
      x = canvas.width / 2
      y = canvas.height - 30
      dx = 2
      dy = -2
      currentSpeed = 2
      score = 0
    }
  }
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
}

function keyDownHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = true
  } else if (e.keyCode === 37) {
    leftPressed = true
  } else if (e.keyCode === 82) {
    rPressed = true
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = false
  } else if (e.keyCode === 37) {
    leftPressed = false
  } else if (e.keyCode === 82) {
    rPressed = false
  }
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  drawBricks()
  paddleMove()
  x += dx
  y += dy
  wallBounce()
  collisionDetection()

  // ctx.font = '20px sans-serif'
  // ctx.fillText('Speed: ' + paddleSpeed, 10, 30) // Speed not accurate?
  ctx.textAlign = 'center'
  ctx.font = '20px sans-serif'
  ctx.fillText('Score: ' + score, 43, 23)
  var difficulty = currentSpeed - 1
  ctx.fillText('Difficulty: ' + difficulty, 150, 23)
  if (score === brickRowCount * brickColumnCount) {
    ctx.fillText('YOU WON!', canvas.width / 2, canvas.height / 2)
    ctx.fillText('Press R to play next difficulty!', canvas.width / 2, canvas.height * 2 / 3)
    dx = 0
    dy = 0
    if (rPressed) {
      bricks = []
      for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (var r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
      }
      x = canvas.width / 2
      y = canvas.height - 50
      currentSpeed = currentSpeed + 1
      dx = currentSpeed
      dy = -currentSpeed
      score = 0
    }
  }
}

setInterval(draw, 10)
