"use client"

import { useEffect, useMemo, useRef } from "react"

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
  toSize: number
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

interface DynamicShapesOptions {
  width?: number
  height?: number
  introDuration?: number
}

interface DynamicShapesCanvasProps {
  className?: string
  onReady?: (controls: { start: () => void }) => void
  onStart?: () => void
  onDone?: () => void
  introDuration?: number
}

export type ShapeCombo = { shapeType: number; clr: string }

export const SHAPE_COLORS = ["rgb(0,151,254)", "#EBC737", "rgb(255,70,100)"]
export const LAYER_ORDER = ["#EBC737", "rgb(0,151,254)", "rgb(255,70,100)"]

const easeInOutExpo = (x: number): number => {
  if (x === 0) return 0
  if (x === 1) return 1
  if (x < 0.5) {
    return Math.pow(2, 20 * x - 10) / 2
  }
  return (2 - Math.pow(2, -20 * x + 10)) / 2
}

function createSketch(
  options: DynamicShapesOptions = {},
  callbacks?: {
    onStart?: () => void
    onDone?: () => void
  }
) {
  return function sketch(p5: P5Instance) {
    const objs: DynamicShape[] = []
    const { width, height } = options
    const introDuration = options.introDuration ?? 1000
    let hasStarted = false
    let isRevealing = false
    let pendingStart = false
    let animationStartTime = 0

    const triggerStart = () => {
      if (hasStarted) return

      const renderer = (p5 as unknown as { _renderer?: unknown })._renderer
      if (!renderer) {
        pendingStart = true
        return
      }

      hasStarted = true
      animationStartTime = Date.now()

      for (let i = 0; i < 15; i++) {
        objs.push(new DynamicShapeClass(true))
      }

      callbacks?.onStart?.()
      p5.loop()
    }

    const triggerReveal = () => {
      if (isRevealing) return
      isRevealing = true
    }

    const pickCombo = (): { shapeType: number; clr: string } => {
      return {
        shapeType: p5.int(p5.random(4)),
        clr: p5.random(SHAPE_COLORS),
      }
    }

    ;(p5 as P5Instance & { startAnimation?: () => void }).startAnimation =
      triggerStart

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
      toSize: number
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

      constructor(preAdvanced = false) {
        this.x = p5.random(p5.width)
        this.y = p5.random(p5.height)

        const combo = pickCombo()
        this.reductionRatio = 1
        this.shapeType = combo.shapeType
        this.animationType = 0
        this.maxActionPoints = p5.int(p5.random(2, 5))
        this.actionPoints = this.maxActionPoints
        this.elapsedT = 0
        this.size = 0
        this.sizeMax = p5.random(30, 60)
        this.fromSize = 0
        this.toSize = this.sizeMax
        this.fromX = 0
        this.fromY = 0
        this.toX = 0
        this.toY = 0
        this.isDead = false
        this.clr = combo.clr
        this.changeShape = true
        this.ang = p5.int(p5.random(2)) * Math.PI * 0.25
        this.lineSW = 0
        this.duration = 0

        if (preAdvanced) {
          this.size = this.sizeMax
          this.actionPoints = p5.int(p5.random(1, this.maxActionPoints))
          this.init()
          this.elapsedT = p5.random(1, this.duration * 0.8)
        } else {
          this.init()
        }
      }

      init(): void {
        this.elapsedT = 0
        this.fromSize = this.size
        this.toSize = this.sizeMax * p5.random(0.5, 1.5)
        this.fromX = this.x

        const angle = p5.random(Math.PI * 2)
        const moveDistance = p5.random(p5.width / 8, p5.width / 4)
        this.toX = this.fromX + Math.cos(angle) * moveDistance

        this.fromY = this.y
        this.toY = this.fromY + Math.sin(angle) * moveDistance
        this.animationType = p5.int(p5.random(3))
        this.duration = p5.random(15, 40)
      }

      show(): void {
        p5.push()
        p5.translate(this.x, this.y)
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
          } else {
            this.size = p5.lerp(this.fromSize, 0, n)
          }
        }
        this.elapsedT++
        if (this.elapsedT > this.duration) {
          if (this.actionPoints == this.maxActionPoints) {
            this.size = this.sizeMax
          } else if (this.actionPoints > 0) {
            this.size = this.toSize
          }

          this.actionPoints--

          if (hasStarted) {
            this.init()
          }
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
      const canvasWidth = width ?? window.innerWidth
      const canvasHeight = height ?? window.innerHeight
      const canvas = p5.createCanvas(canvasWidth, canvasHeight)
      canvas.style("display", "block")
      p5.clear()
      p5.rectMode(p5.CENTER)
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.noLoop()

      if (pendingStart) {
        pendingStart = false
        triggerStart()
      }
    }

    p5.windowResized = () => {
      const canvasWidth = width ?? window.innerWidth
      const canvasHeight = height ?? window.innerHeight
      p5.resizeCanvas(canvasWidth, canvasHeight)
    }

    p5.draw = () => {
      p5.clear()

      for (const clr of LAYER_ORDER) {
        for (let i = 0; i < objs.length; i++) {
          if (objs[i].clr === clr) {
            objs[i].show()
          }
        }
      }

      for (const obj of objs) {
        obj.move()
      }

      if (
        hasStarted &&
        !isRevealing &&
        p5.frameCount % p5.int(p5.random([15, 30])) == 0
      ) {
        const addNum = p5.int(p5.random(3, 8))
        for (let i = 0; i < addNum; i++) {
          objs.push(new DynamicShapeClass())
        }
      }

      if (hasStarted && !isRevealing) {
        const elapsed = Date.now() - animationStartTime
        if (elapsed >= introDuration) {
          triggerReveal()
        }
      }

      for (let i = objs.length - 1; i >= 0; i--) {
        if (objs[i].isDead) {
          objs.splice(i, 1)
        }
      }

      if (isRevealing && objs.length === 0) {
        hasStarted = false
        isRevealing = false
        p5.noLoop()
        callbacks?.onDone?.()
      }
    }
  }
}

export default function DynamicShapesCanvas({
  className,
  onReady,
  onStart,
  onDone,
  introDuration,
}: DynamicShapesCanvasProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onStartRef = useRef(onStart)
  onStartRef.current = onStart
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const sketchOptions = useMemo<DynamicShapesOptions>(
    () => ({ introDuration }),
    [introDuration]
  )

  useEffect(() => {
    let instance: P5Instance | null = null
    let cancelled = false

    const load = async () => {
      const { default: P5 } = await import("p5")
      P5.disableFriendlyErrors = true
      if (cancelled || !containerRef.current) return
      const callbacks = {
        onStart: () => onStartRef.current?.(),
        onDone: () => onDoneRef.current?.(),
      }
      instance = new P5(
        createSketch(sketchOptions, callbacks),
        containerRef.current
      )
      if (onReadyRef.current) {
        onReadyRef.current({
          start: () => {
            const inst = instance as P5Instance & {
              startAnimation?: () => void
            }
            inst?.startAnimation?.()
          },
        })
      }
    }

    load()

    return () => {
      cancelled = true
      instance?.remove()
    }
  }, [sketchOptions])

  const containerClasses = [
    "flex items-center justify-center w-full h-full relative",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={containerClasses}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
