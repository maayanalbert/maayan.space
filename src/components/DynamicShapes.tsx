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

type SpawnOrigin = {
  x?: number
  y?: number
}

interface DynamicShapesOptions {
  width?: number
  height?: number
  spawnOrigin?: SpawnOrigin
}

interface DynamicShapesCanvasProps extends DynamicShapesOptions {
  className?: string
  onReady?: (controls: { start: () => void }) => void
  onStart?: () => void
  onReset?: () => void
}

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
  callbacks?: { onStart?: () => void; onReset?: () => void }
) {
  return function sketch(p5: P5Instance) {
    const objs: DynamicShape[] = []
    const { width, height, spawnOrigin } = options
    let hasStarted = false
    let isResetting = false

    // Spawn center defaults to top-right of the canvas
    const fallbackWidth =
      typeof window !== "undefined" ? width ?? window.innerWidth : width ?? 1000
    let spawnCenterX = spawnOrigin?.x ?? (fallbackWidth ?? 1000) - 24
    let spawnCenterY = spawnOrigin?.y ?? 24
    let animationStartTime = 0
    const growthDuration = 5000 // milliseconds (5 seconds)

    const updateSpawnCenter = () => {
      spawnCenterX = spawnOrigin?.x ?? p5.width - 24
      spawnCenterY = spawnOrigin?.y ?? 24
    }

    const getSpawnRadius = () => {
      if (!window.innerWidth) return 0
      const maxSpawnRadius = window.innerWidth * 0.5
      if (!hasStarted) return window.innerWidth * 0.35
      const elapsed = Date.now() - animationStartTime
      const progress = Math.min(elapsed / growthDuration, 1)
      // Ease out cubic for smooth growth
      const eased = 1 - Math.pow(1 - progress, 3)
      const radius = p5.lerp(window.innerWidth * 0.15, maxSpawnRadius, eased)
      return radius
    }

    const getSpawnRate = () => {
      if (!hasStarted) return { minShapes: 1, maxShapes: 5 }
      const elapsed = Date.now() - animationStartTime
      const progress = Math.min(elapsed / growthDuration, 1)
      // Spawn more shapes as the area grows
      // Start at 1-5 shapes, grow to 5-40 shapes per spawn
      const minShapes = p5.lerp(1, 5, progress)
      const maxShapes = p5.lerp(50, 60, progress)
      return { minShapes, maxShapes }
    }

    const triggerStart = () => {
      if (hasStarted || isResetting) return
      hasStarted = true
      animationStartTime = Date.now()
      document.body.style.cursor = "default"

      // Seed shapes immediately on start
      const { minShapes, maxShapes } = getSpawnRate()
      const initialCount = Math.max(10, Math.round((minShapes + maxShapes) / 2))
      for (let i = 0; i < initialCount; i++) {
        objs.push(new DynamicShapeClass())
      }

      // Notify parent component
      callbacks?.onStart?.()

      p5.loop()
    }

    const resetAnimation = () => {
      if (isResetting) return
      isResetting = true

      // Force all shapes to shrink down
      for (const obj of objs) {
        obj.actionPoints = 0 // Set to 0 so they shrink (not -1 which makes them die immediately)
        obj.elapsedT = 1 // Start at 1 so animation runs immediately
        obj.fromSize = obj.size
        obj.toSize = 0
        obj.duration = 20 // Fast shrink (about 0.33 seconds at 60fps)
        obj.lineSW = 0 // Remove motion lines during reset
      }

      // Keep the animation loop running to show shrinking
      p5.loop()
    }

    const completeReset = () => {
      hasStarted = false
      animationStartTime = 0
      objs.length = 0
      isResetting = false
      // Reset cursor
      document.body.style.cursor = "default"
      p5.noLoop()

      // Notify parent component
      callbacks?.onReset?.()
    }

    const isPointInsideShape = (mx: number, my: number, obj: DynamicShape) => {
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

      constructor() {
        // Spawn within a radius around the spawn center (spilling effect)
        const spawnRadius = getSpawnRadius()
        const angle = p5.random(Math.PI * 2)
        const distance = p5.random(0, spawnRadius)
        this.x = spawnCenterX + Math.cos(angle) * distance
        this.y = spawnCenterY + Math.sin(angle) * distance

        this.reductionRatio = 1
        this.shapeType = p5.int(p5.random(4))
        this.animationType = 0
        this.maxActionPoints = p5.int(p5.random(2, 5))
        this.actionPoints = this.maxActionPoints
        this.elapsedT = 0
        // Always start at size 0
        this.size = 0
        this.sizeMax = p5.random(10, 20)
        this.fromSize = 0
        this.toSize = this.sizeMax
        this.fromX = 0
        this.fromY = 0
        this.toX = 0
        this.toY = 0
        this.isDead = false
        this.clr = p5.random(SHAPE_COLORS)
        this.changeShape = true
        this.ang = p5.int(p5.random(2)) * Math.PI * 0.25
        this.lineSW = 0
        this.duration = 0
        this.init()
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
        this.duration = p5.random(25, 50)
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
        // Spawned shapes lifecycle or animations: animate normally
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
          // Lock size at end of animation
          if (this.actionPoints == this.maxActionPoints) {
            this.size = this.sizeMax
          } else if (this.actionPoints > 0) {
            this.size = this.toSize
          }

          this.actionPoints--

          // Don't call init() during reset - just let shapes shrink and die
          if (!isResetting && hasStarted) {
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
      const canvasWidth = width ?? (window.innerWidth * 2) / 3
      const canvasHeight = height ?? (window.innerHeight * 2) / 3
      const canvas = p5.createCanvas(canvasWidth, canvasHeight)
      canvas.style("display", "block")
      p5.clear()
      p5.rectMode(p5.CENTER)
      p5.textAlign(p5.CENTER, p5.CENTER)
      updateSpawnCenter()
      p5.noLoop()
    }

    p5.windowResized = () => {
      const canvasWidth = width ?? (window.innerWidth * 2) / 3
      const canvasHeight = height ?? (window.innerHeight * 2) / 3
      p5.resizeCanvas(canvasWidth, canvasHeight)
      updateSpawnCenter()

      // Redraw to reflect changes
      if (!hasStarted) {
        p5.redraw()
      }
    }

    p5.mousePressed = () => {
      // Don't allow interaction while resetting
      if (isResetting) return

      if (hasStarted) {
        // Reset animation if clicking any filled shape
        for (let i = objs.length - 1; i >= 0; i--) {
          if (isPointInsideShape(p5.mouseX, p5.mouseY, objs[i])) {
            resetAnimation()
            break
          }
        }
      }
    }

    p5.draw = () => {
      p5.clear()

      for (const clr of LAYER_ORDER) {
        for (let i = 0; i < objs.length; i++) {
          const obj = objs[i]
          if (obj.clr === clr) {
            obj.show()
          }
        }
      }

      // Always move shapes (for main animation and reset)
      for (const obj of objs) {
        obj.move()
      }

      // Only spawn new shapes if animation has started and not resetting
      if (
        hasStarted &&
        !isResetting &&
        p5.frameCount % p5.int(p5.random([25, 50])) == 0
      ) {
        const { minShapes, maxShapes } = getSpawnRate()
        const addNum = p5.int(p5.random(minShapes, maxShapes))
        for (let i = 0; i < addNum; i++) {
          objs.push(new DynamicShapeClass())
        }
      }

      // Remove dead objects
      for (let i = objs.length - 1; i >= 0; i--) {
        if (objs[i].isDead) {
          objs.splice(i, 1)
        }
      }

      // Check if reset is complete (all shapes have shrunk away)
      if (isResetting && objs.length === 0) {
        completeReset()
      }

      // Update cursor for moving shapes (when animation started and not resetting)
      if (hasStarted && !isResetting) {
        let isOverShape = false
        for (let i = objs.length - 1; i >= 0; i--) {
          if (isPointInsideShape(p5.mouseX, p5.mouseY, objs[i])) {
            isOverShape = true
            break
          }
        }

        // Update cursor via document.body
        document.body.style.cursor = isOverShape ? "pointer" : "default"
      } else if (!hasStarted && !isResetting) {
        document.body.style.cursor = "default"
        // Stop looping when idle with no shapes
        if (objs.length === 0) {
          p5.noLoop()
        }
      }
    }
  }
}

export default function DynamicShapesCanvas({
  width,
  height,
  spawnOrigin,
  className,
  onReady,
  onStart,
  onReset,
}: DynamicShapesCanvasProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onStartRef = useRef(onStart)
  onStartRef.current = onStart
  const onResetRef = useRef(onReset)
  onResetRef.current = onReset
  const resolvedSpawnOrigin = useMemo<SpawnOrigin>(() => {
    const fallbackWidth =
      typeof window !== "undefined" ? width ?? window.innerWidth : width ?? 1000
    return {
      x: (fallbackWidth ?? 1000) - 24,
      y: 24,
      ...(spawnOrigin ?? {}),
    }
  }, [spawnOrigin, width])
  const sketchOptions = useMemo<DynamicShapesOptions>(
    () => ({
      width,
      height,
      spawnOrigin: resolvedSpawnOrigin,
    }),
    [width, height, resolvedSpawnOrigin]
  )

  useEffect(() => {
    let instance: P5Instance | null = null
    let cancelled = false

    const load = async () => {
      const { default: P5 } = await import("p5")
      P5.disableFriendlyErrors = true
      if (cancelled || !containerRef.current) return
      const callbacks = {
        onStart: onStartRef.current,
        onReset: onResetRef.current,
      }
      instance = new P5(
        createSketch(sketchOptions, callbacks),
        containerRef.current
      )
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
      // Reset cursor on cleanup
      document.body.style.cursor = "default"
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
