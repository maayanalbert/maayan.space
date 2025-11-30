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

type InitialShapeConfig = {
  x?: number
  y?: number
  size?: number
  color?: string
  skipIntro?: boolean
  shapeType?: number
}

interface DynamicShapesOptions {
  width?: number
  height?: number
  initialShape?: InitialShapeConfig
  autoStart?: boolean
}

interface DynamicShapesCanvasProps extends DynamicShapesOptions {
  className?: string
  onReady?: (controls: { start: () => void }) => void
}

const SHAPE_COLORS = ["rgb(0,151,254)", "#EBC737", "rgb(255,70,100)"]
const LAYER_ORDER = ["#EBC737", "rgb(0,151,254)", "rgb(255,70,100)"]

const easeInOutExpo = (x: number): number => {
  if (x === 0) return 0
  if (x === 1) return 1
  if (x < 0.5) {
    return Math.pow(2, 20 * x - 10) / 2
  }
  return (2 - Math.pow(2, -20 * x + 10)) / 2
}

function createSketch(options: DynamicShapesOptions = {}) {
  return function sketch(p5: P5Instance) {
    const objs: DynamicShape[] = []
    const { width, height, initialShape, autoStart = true } = options
    let hasStarted = autoStart

    // Spawn center is the initial shape position
    let spawnCenterX = 0
    let spawnCenterY = 0

    const triggerStart = () => {
      if (hasStarted) return
      hasStarted = true
      p5.loop()
    }

    const getInitialShape = () => objs[0]

    const isPointInsideInitialShape = (mx: number, my: number) => {
      const obj = getInitialShape()
      if (!obj) return false
      const effectiveSize = obj.size || obj.sizeMax || obj.toSize || 0
      if (!effectiveSize) return false
      const radius = effectiveSize * 0.5
      return p5.dist(mx, my, obj.x, obj.y) <= radius
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

      constructor(config?: InitialShapeConfig) {
        // If config provided, use it (for initial shape)
        // Otherwise spawn near the spawn center with some variance
        if (config) {
          this.x = config.x ?? p5.width - 20
          this.y = config.y ?? 20
          // Update spawn center when initial shape is created
          spawnCenterX = this.x
          spawnCenterY = this.y
        } else {
          // Spawn within a radius around the spawn center (spilling effect)
          const spawnRadius = p5.width * 0.35
          const angle = p5.random(Math.PI * 2)
          const distance = p5.random(0, spawnRadius)
          this.x = spawnCenterX + Math.cos(angle) * distance
          this.y = spawnCenterY + Math.sin(angle) * distance
        }

        this.reductionRatio = 1
        this.shapeType =
          typeof config?.shapeType === "number"
            ? config.shapeType
            : config
            ? 0
            : p5.int(p5.random(4))
        this.animationType = 0
        this.maxActionPoints = p5.int(p5.random(2, 5))
        this.actionPoints = this.maxActionPoints
        this.elapsedT = 0
        this.size = config?.size ?? 0
        this.sizeMax = config?.size ?? p5.random(10, 20)
        this.fromSize = 0
        this.toSize = this.sizeMax
        this.fromX = 0
        this.fromY = 0
        this.toX = 0
        this.toY = 0
        this.isDead = false
        this.clr = config?.color ?? p5.random(SHAPE_COLORS)
        this.changeShape = true
        this.ang = p5.int(p5.random(2)) * Math.PI * 0.25
        this.lineSW = 0
        this.duration = 0
        this.init()
        if (config?.skipIntro && this.actionPoints > 0) {
          this.actionPoints = Math.max(this.actionPoints - 1, 0)
        }
      }

      init(): void {
        this.elapsedT = 0
        this.fromSize = this.size
        this.toSize = this.sizeMax * p5.random(0.5, 1.5)
        this.fromX = this.x

        // Move away from spawn center (spilling out effect)
        const angleFromCenter = Math.atan2(
          this.y - spawnCenterY,
          this.x - spawnCenterX
        )
        const moveDistance = p5.random(p5.width / 6, p5.width / 3)
        this.toX = this.fromX + Math.cos(angleFromCenter) * moveDistance

        this.fromY = this.y
        this.toY = this.fromY + Math.sin(angleFromCenter) * moveDistance

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
      const canvasWidth = width ?? (window.innerWidth * 2) / 3
      const canvasHeight = height ?? (window.innerHeight * 2) / 3
      p5.createCanvas(canvasWidth, canvasHeight)
      p5.rectMode(p5.CENTER)
      p5.textAlign(p5.CENTER, p5.CENTER)
      objs.push(new DynamicShapeClass(initialShape))
      if (!autoStart) {
        p5.noLoop()
        p5.redraw()
      }
    }

    p5.mousePressed = () => {
      if (hasStarted) return
      if (isPointInsideInitialShape(p5.mouseX, p5.mouseY)) {
        triggerStart()
      }
    }

    p5.draw = () => {
      p5.background(255)

      for (const clr of LAYER_ORDER) {
        for (const obj of objs) {
          if (obj.clr === clr) {
            obj.show()
          }
        }
      }

      for (const obj of objs) {
        obj.move()
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
}

export default function DynamicShapesCanvas({
  width,
  height,
  initialShape,
  autoStart = true,
  className,
  onReady,
}: DynamicShapesCanvasProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const initialShapeKey = initialShape ? JSON.stringify(initialShape) : "none"
  const normalizedInitialShape = useMemo<InitialShapeConfig | undefined>(
    () => (initialShape ? { ...initialShape } : undefined),
    [initialShapeKey]
  )
  const sketchOptions = useMemo<DynamicShapesOptions>(
    () => ({
      width,
      height,
      initialShape: normalizedInitialShape,
      autoStart,
    }),
    [width, height, normalizedInitialShape, autoStart]
  )

  useEffect(() => {
    let instance: P5Instance | null = null
    let cancelled = false

    const load = async () => {
      const { default: P5 } = await import("p5")
      P5.disableFriendlyErrors = true
      if (cancelled || !containerRef.current) return
      instance = new P5(createSketch(sketchOptions), containerRef.current)
      if (onReadyRef.current) {
        onReadyRef.current({
          start: () => {
            const controllableInstance = instance as P5Instance & {
              startAnimation?: () => void
            }
            if (controllableInstance?.startAnimation) {
              controllableInstance.startAnimation()
            } else {
              controllableInstance?.loop()
            }
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
