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
  isInitialShape: boolean
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
  onStart?: () => void
  onReset?: () => void
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

function createSketch(
  options: DynamicShapesOptions = {},
  callbacks?: { onStart?: () => void; onReset?: () => void }
) {
  return function sketch(p5: P5Instance) {
    const objs: DynamicShape[] = []
    const { width, height, initialShape, autoStart = true } = options
    let hasStarted = autoStart
    let isHoveringInitialShape = false
    let initialShapeScale = 1.0
    const hoverScaleTarget = 1.25
    let isResetting = false

    // Spawn center is the initial shape position
    let spawnCenterX = 0
    let spawnCenterY = 0
    let animationStartTime = 0
    const growthDuration = 5000 // milliseconds (5 seconds)

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
      const maxShapes = p5.lerp(20, 60, progress)
      return { minShapes, maxShapes }
    }

    const triggerStart = () => {
      if (hasStarted) return
      hasStarted = true
      animationStartTime = Date.now()

      // Make initial shape shrink
      const initialObj = getInitialShape()
      if (initialObj) {
        initialObj.isInitialShape = false
        initialObj.actionPoints = 0 // Trigger shrink animation
        initialObj.elapsedT = 1
        initialObj.fromSize = initialObj.size
        initialObj.toSize = 0
        initialObj.duration = 20 // Fast shrink
        initialObj.lineSW = 0
      }

      // Reset hover state and cursor
      isHoveringInitialShape = false
      initialShapeScale = 1.0
      document.body.style.cursor = "default"

      // Change text in DOM
      const textElement = document.querySelector(
        'p[style*="Helvetica Neue"]'
      ) as HTMLElement
      if (textElement) {
        textElement.textContent = "Catch a shape!"
      }

      // Notify parent component
      callbacks?.onStart?.()

      p5.loop()
    }

    const resetAnimation = () => {
      if (isResetting) return
      isResetting = true

      // Force all shapes to shrink down (including initial shape)
      for (const obj of objs) {
        // Remove initial shape flag so it can shrink
        obj.isInitialShape = false
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
      // Clear all objects except keep the initial shape config
      const initialConfig = initialShape
      objs.length = 0
      objs.push(new DynamicShapeClass(initialConfig))
      isResetting = false
      // Reset cursor
      document.body.style.cursor = "default"

      // Reset text in DOM
      const textElement = document.querySelector(
        'p[style*="Helvetica Neue"]'
      ) as HTMLElement
      if (textElement) {
        textElement.textContent = "Hi, I'm Maayan"
      }

      // Notify parent component
      callbacks?.onReset?.()
      // Keep loop running so initial shape can grow in
      // The draw loop will stop it once the grow-in is complete
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
      isInitialShape: boolean

      constructor(config?: InitialShapeConfig) {
        // If config provided, use it (for initial shape)
        // Otherwise spawn near the spawn center with some variance
        this.isInitialShape = !!config

        if (config) {
          this.x = config.x ?? 0
          this.y = config.y ?? 0
          // Update spawn center when initial shape is created
          spawnCenterX = this.x
          spawnCenterY = this.y
        } else {
          // Spawn within a radius around the spawn center (spilling effect)
          const spawnRadius = getSpawnRadius()
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
        // Always start at size 0
        this.size = 0
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
        // Use shorter duration for initial shape grow-in
        this.duration = config ? 30 : 0
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
        // Initial shape lifecycle: grow in once, then stay stationary
        if (this.isInitialShape && !isResetting && !hasStarted) {
          if (this.elapsedT < this.duration) {
            // Still growing in
            const n = easeInOutExpo(p5.norm(this.elapsedT, 0, this.duration))
            this.size = p5.lerp(0, this.sizeMax, n)
            this.elapsedT++
          } else {
            // Done growing, stay at full size
            this.size = this.sizeMax
          }
          return
        }

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
      objs.push(new DynamicShapeClass(initialShape))
      // Start loop to allow initial shape to grow in
      // The draw loop will stop it once the grow-in is complete
    }

    p5.windowResized = () => {
      const canvasWidth = width ?? (window.innerWidth * 2) / 3
      const canvasHeight = height ?? (window.innerHeight * 2) / 3
      p5.resizeCanvas(canvasWidth, canvasHeight)

      // Update initial shape position if it exists
      const initialObj = getInitialShape()
      if (initialObj && initialShape) {
        // Recalculate position based on new canvas size
        const newX = initialShape.x ?? p5.width - 20
        const newY = initialShape.y ?? 20

        // Update the initial shape's position
        initialObj.x = newX
        initialObj.y = newY
        initialObj.fromX = newX
        initialObj.toX = newX
        initialObj.fromY = newY
        initialObj.toY = newY

        // Update spawn center to match new position
        spawnCenterX = newX
        spawnCenterY = newY
      }

      // Redraw to reflect changes
      if (!hasStarted) {
        p5.redraw()
      }
    }

    p5.mouseMoved = () => {
      if (!hasStarted && !isResetting) {
        // Update hover state for the stationary initial shape
        const wasHovering = isHoveringInitialShape
        isHoveringInitialShape = isPointInsideInitialShape(p5.mouseX, p5.mouseY)

        // Update cursor via document.body
        document.body.style.cursor = isHoveringInitialShape
          ? "pointer"
          : "default"

        // Start drawing to animate scale transition
        if (wasHovering !== isHoveringInitialShape) {
          p5.loop()
        }
      }
    }

    p5.mousePressed = () => {
      // Don't allow interaction while resetting
      if (isResetting) return

      if (!hasStarted) {
        // Start animation if clicking the initial shape
        if (isPointInsideInitialShape(p5.mouseX, p5.mouseY)) {
          triggerStart()
        }
      } else {
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

      // Check if initial shape is still growing in
      const initialObj = getInitialShape()
      const isGrowingIn =
        initialObj &&
        initialObj.elapsedT <= initialObj.duration &&
        initialObj.isInitialShape

      // Animate scale for initial shape (only after it's fully grown in)
      if (!hasStarted && !isResetting) {
        const targetScale =
          !isGrowingIn && isHoveringInitialShape ? hoverScaleTarget : 1.0
        initialShapeScale = p5.lerp(initialShapeScale, targetScale, 0.15)

        // Stop looping once animation is complete AND initial shape has finished growing
        if (!isGrowingIn && Math.abs(initialShapeScale - targetScale) < 0.001) {
          initialShapeScale = targetScale
          p5.noLoop()
        }
      } else {
        isHoveringInitialShape = false
        initialShapeScale = 1.0
      }

      for (const clr of LAYER_ORDER) {
        for (let i = 0; i < objs.length; i++) {
          const obj = objs[i]
          if (obj.clr === clr) {
            // Apply scale effect for initial shape (only when not resetting and fully grown)
            if (
              !hasStarted &&
              !isResetting &&
              obj.isInitialShape &&
              !isGrowingIn
            ) {
              p5.push()
              p5.translate(obj.x, obj.y)
              p5.scale(initialShapeScale)
              p5.translate(-obj.x, -obj.y)
              obj.show()
              p5.pop()
            } else {
              obj.show()
            }
          }
        }
      }

      // Always move shapes (for initial shape grow-in, main animation, and reset)
      for (const obj of objs) {
        obj.move()
      }

      // Only spawn new shapes if animation has started and not resetting
      if (
        hasStarted &&
        !isResetting &&
        p5.frameCount % p5.int(p5.random([15, 30])) == 0
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
