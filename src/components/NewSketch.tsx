import { P5CanvasInstance } from "@p5-wrapper/react"
import { NextReactP5Wrapper } from "@p5-wrapper/next"

/**
 * A wrapper for the main page
 */
export default function Home() {
  return (
    <div className="w-full">
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  )
}

// need to put this all in the same file for some reason, will find workaround at some point
const numIterations = 24
let scrollRatio = 0
const arcStep = 10

let minStep = 10 // will update if on mobile

let maxStep = 0 // resize with window
let minArcRatio = 0 // resize with scroll
let maxScrollY = 0

// update with render
let xoff = 400
let yoff = 0.3
let xArc = 0.1
let yArc = 0.2

let minWombOpacity = 0.5

function sketch(p5: P5CanvasInstance) {
  p5.setup = () => setup(p5)
  p5.draw = () => draw(p5)
  p5.windowResized = () => windowResized(p5)

  addScrollEventListenerSafe((receivedScrollRatio) => {
    scrollRatio = receivedScrollRatio
    if (scrollY >= maxScrollY) {
      p5.noLoop()
    } else {
      p5.loop()
    }
  })
}

/**
 * Called first on initial render
 */
function setup(p5: P5CanvasInstance) {
  p5.createCanvas(window.innerWidth, window.innerHeight)

  maxScrollY = getMaxScrollY()

  maxStep = maxScrollY / numIterations
}

/**
 * Called continuously to draw the animation
 */

function draw(p5: P5CanvasInstance) {
  const step = getMappedValue(scrollRatio, 0, 1, minStep, maxStep, easeInSine)

  var targetMinArcRatio = getMappedValue(scrollRatio, 0, 1, 0, 1)

  const hintDisappearCuttof = 200 / maxScrollY
  const wombOpacity = getMappedValue(
    scrollRatio,
    0,
    hintDisappearCuttof,
    minWombOpacity,
    1,
    easeInSine
  )
  minArcRatio = minArcRatio * 0.9 + targetMinArcRatio * 0.1

  p5.noiseDetail(1, 0.9)
  p5.background(0, 0, 0)
  p5.noFill()

  xoff += 0.00625 // need to speed this up when using squircles for some reason
  yoff += 0.005
  for (var i = 1; i < numIterations; i += 1) {
    const strokeWeightVal = getMappedValue(
      p5.noise(xoff, i),
      0,
      1,
      0,
      50,
      easeInSine
    )

    const scrollAdjustedStrokeWeight = getMappedValue(
      step,
      minStep,
      maxStep,
      strokeWeightVal,
      strokeWeightVal * 5
    )
    p5.strokeWeight(scrollAdjustedStrokeWeight)
    xArc = p5.constrain(
      p5.PI * (p5.noise((xoff * i * arcStep) / 640) * 8),
      0,
      yArc
    )
    yArc = p5.constrain(
      p5.PI * (p5.noise((yoff * i * arcStep) / 450) * 3),
      xArc + 1,
      p5.PI * 2
    )

    const grayVal =
      getMappedValue(i, 0, numIterations, 0, 255, easeInSine) * wombOpacity

    p5.stroke(grayVal, grayVal, grayVal)

    const size = getMappedValue(
      i,
      0,
      numIterations,
      numIterations * step * minArcRatio,
      numIterations * step,
      easeOutCirc
    )

    p5.ellipse(
      window.innerWidth / 2,
      window.innerHeight / 2,
      size,
      size,
      yArc,
      xArc
    )
  }
}

function windowResized(p5: P5CanvasInstance) {
  p5.resizeCanvas(window.innerWidth, window.innerHeight)

  maxScrollY = getMaxScrollY()
  maxStep = maxScrollY / numIterations
}
