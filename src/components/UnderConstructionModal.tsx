"use client"

import { useEffect, useRef } from "react"

interface DynamicShape {
  x: number
  y: number
  reductionRatio: number
  shapeType: number
  animationType: number
  maxActionPoints: number
  actionPoints: number
  elapsedT: number
  size: number
  sizeMax: number
  fromSize: number
  fromX: number
  fromY: number
  toX: number
  toY: number
  isDead: boolean
  clr: string
  changeShape: boolean
  ang: number
  lineSW: number
  duration: number
  init: () => void
  show: () => void
  move: () => void
  run: () => void
}

type P5Instance = import("p5").default

function sketch(p5: P5Instance) {
  const colors = [
    "rgb(0,151,254)",
    "#EBC737",
    "rgb(255,70,100)",
    "rgb(50, 50, 50)",
  ]
  const objs: DynamicShape[] = []

  function easeInOutExpo(x: number): number {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2
  }

  class DynamicShapeClass implements DynamicShape {
    x: number
    y: number
    reductionRatio: number
    shapeType: number
    animationType: number
    maxActionPoints: number
    actionPoints: number
    elapsedT: number
    size: number
    sizeMax: number
    fromSize: number
    fromX: number
    fromY: number
    toX: number
    toY: number
    isDead: boolean
    clr: string
    changeShape: boolean
    ang: number
    lineSW: number
    duration: number

    constructor() {
      this.x = p5.random(0.3, 0.7) * p5.width
      this.y = p5.random(0.3, 0.7) * p5.height
      this.reductionRatio = 1
      this.shapeType = p5.int(p5.random(4))
      this.animationType = 0
      this.maxActionPoints = p5.int(p5.random(2, 5))
      this.actionPoints = this.maxActionPoints
      this.elapsedT = 0
      this.size = 0
      this.sizeMax = p5.random(10, 20)
      this.fromSize = 0
      this.isDead = false
      this.clr = p5.random(colors)
      this.changeShape = true
      this.ang = p5.int(p5.random(2)) * Math.PI * 0.25
      this.lineSW = 0
      this.fromX = 0
      this.fromY = 0
      this.toX = 0
      this.toY = 0
      this.duration = 0
      this.init()
    }

    init(): void {
      this.elapsedT = 0
      this.fromSize = this.size
      // @ts-ignore
      this.toSize = this.sizeMax * p5.random(0.5, 1.5)
      this.fromX = this.x
      this.toX =
        this.fromX +
        (p5.width / 10) * p5.random([-1, 1]) * p5.int(p5.random(1, 4))
      this.fromY = this.y
      this.toY =
        this.fromY +
        (p5.height / 10) * p5.random([-1, 1]) * p5.int(p5.random(1, 4))
      this.animationType = p5.int(p5.random(3))
      this.duration = p5.random(20, 50)
    }

    show(): void {
      p5.push()
      p5.translate(this.x, this.y)
      if (this.animationType == 1) p5.scale(1, this.reductionRatio)
      if (this.animationType == 2) p5.scale(this.reductionRatio, 1)
      p5.fill(this.clr)
      p5.stroke(this.clr)
      p5.strokeWeight(this.size * 0.05)

      if (this.shapeType == 0) {
        p5.noStroke()
        p5.circle(0, 0, this.size)
      } else if (this.shapeType == 1) {
        p5.noFill()
        p5.circle(0, 0, this.size)
      } else if (this.shapeType == 2) {
        p5.noStroke()
        p5.rect(0, 0, this.size, this.size)
      } else if (this.shapeType == 3) {
        p5.noFill()
        p5.rect(0, 0, this.size * 0.9, this.size * 0.9)
      } else if (this.shapeType == 4) {
        p5.line(0, -this.size * 0.45, 0, this.size * 0.45)
        p5.line(-this.size * 0.45, 0, this.size * 0.45, 0)
      }
      p5.pop()
      p5.strokeWeight(this.lineSW)
      p5.stroke(this.clr)
      p5.line(this.x, this.y, this.fromX, this.fromY)
    }

    move(): void {
      const n = easeInOutExpo(p5.norm(this.elapsedT, 0, this.duration))
      if (0 < this.elapsedT && this.elapsedT < this.duration) {
        if (this.actionPoints == this.maxActionPoints) {
          this.size = p5.lerp(0, this.sizeMax, n)
        } else if (this.actionPoints > 0) {
          if (this.animationType == 0) {
            // @ts-ignore
            this.size = p5.lerp(this.fromSize, this.toSize, n)
          } else if (this.animationType == 1) {
            this.x = p5.lerp(this.fromX, this.toX, n)
            this.lineSW = p5.lerp(0, this.size / 5, p5.sin(n * Math.PI))
          } else if (this.animationType == 2) {
            this.y = p5.lerp(this.fromY, this.toY, n)
            this.lineSW = p5.lerp(0, this.size / 5, p5.sin(n * Math.PI))
          } else if (this.animationType == 3) {
            if (this.changeShape == true) {
              this.shapeType = p5.int(p5.random(5))
              this.changeShape = false
            }
          }
          this.reductionRatio = p5.lerp(1, 0.3, p5.sin(n * Math.PI))
        } else {
          this.size = p5.lerp(this.fromSize, 0, n)
        }
      }
      this.elapsedT++
      if (this.elapsedT > this.duration) {
        this.actionPoints--
        this.init()
      }
      if (this.actionPoints < 0) {
        this.isDead = true
      }
    }

    run(): void {
      this.show()
      this.move()
    }
  }

  p5.setup = () => {
    const canvasWidth = (window.innerWidth * 2) / 3
    const canvasHeight = (window.innerHeight * 2) / 3
    p5.createCanvas(canvasWidth, canvasHeight)
    p5.rectMode(p5.CENTER)
    p5.textAlign(p5.CENTER, p5.CENTER)
    objs.push(new DynamicShapeClass())
  }

  p5.draw = () => {
    p5.background(255)
    // p5.scale(2)

    for (const obj of objs) {
      obj.run()
    }

    if (p5.frameCount % p5.int(p5.random([15, 30])) == 0) {
      const addNum = p5.int(p5.random(1, 30))
      for (let i = 0; i < addNum; i++) {
        objs.push(new DynamicShapeClass())
      }
    }

    for (let i = objs.length - 1; i >= 0; i--) {
      if (objs[i].isDead) {
        objs.splice(i, 1)
      }
    }
  }
}

export default function DynamicShapesCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let instance: P5Instance | null = null
    let cancelled = false

    const load = async () => {
      const { default: P5 } = await import("p5")
      P5.disableFriendlyErrors = true
      if (cancelled || !containerRef.current) return
      instance = new P5(sketch, containerRef.current)
    }

    load()

    return () => {
      cancelled = true
      instance?.remove()
    }
  }, [])

  return (
    <div className="flex items-center justify-center w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      <div className="text-xl text-gray-500 origin-bottom-left absolute left-5 top-5 sm:left-14 sm:top-14 font-light bg-[rgba(255,255,255,0.5)] pr-1 pb-1 rounded-lg">
        Site Under Construction
      </div>
      <div className="flex flex-col items-end text-lg text-gray-500 origin-bottom-left absolute text-right right-5 bottom-5 sm:right-14 sm:bottom-14 font-light bg-[rgba(255,255,255,0.5)] pl-1 pt-1 rounded-lg">
        <div>Please check back later or contact Maayan</div>
        <a
          href="https://openprocessing.org/sketch/2421742"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:underline"
        >
          P5 Sketch Forked From Okazz
        </a>
      </div>
    </div>
  )
}
