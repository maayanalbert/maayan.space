"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import type { CollectedShape } from "./CaughtShapeOverlay"

interface ShapeModalProps {
  shape: CollectedShape
  onClose: () => void
}

// Per-color overlay opacity for text readability
const COLOR_OVERLAY_OPACITY: Record<string, number> = {
  "#EBC737": 0.2, // yellow – lightest, needs most darkening
  "rgb(255,70,100)": 0.1, // pink
  "rgb(0,151,254)": 0, // blue
}
const ANIMATION_DURATION = 150

function shapeName(shapeType: number): string {
  const isFilled = shapeType === 0 || shapeType === 2
  const isCircle = shapeType === 0 || shapeType === 1
  return `${isFilled ? "Filled" : "Outlined"} ${isCircle ? "circle" : "square"}`
}

/* ------------------------------------------------------------------ */
/*  Secret ↔ shape-combo mapping                                       */
/* ------------------------------------------------------------------ */

export type ShapeSecret = { title: string; body: string }

const SHAPE_SECRETS: Record<string, ShapeSecret> = {
  // Filled circle
  "0-rgb(0,151,254)": {
    title: "Glass houses",
    body: "Maayan takes great pride being a nice person (she thinks she's a little bit better than everyone else because of it). But the ages of 2-4, Maayan was a terrible bully, who teased one boy in particular for having a hard name to pronounce (Maayan has a hard name to pronounce). The boy is now good friends with her brother and seems to have no recollection of this.",
  },
  "0-#EBC737": {
    title: "Still in the closet",
    body: "In college Maayan thought she was straight and had what she didn't realize was a debilitating crush on her head TA. She spoke about the woman to her boyfriend so often that it became an inside joke that she was obsessed with her. Maayan spent 3/4s of college trying to come up with an excuse to talk to her, and graduated never managing to do so.",
  },
  "0-rgb(255,70,100)": {
    title: "Gold digger",
    body: "Maayan doesn't have an affinity for fancy things, but secretly loves being taken out to nice dinners. She considers herself a strong independent woman who isn't phased by wealth, but, regardless of the nature of the relationship, will do almost anything for you if you take her snowboarding (please take her snowboarding).",
  },
  // Outlined circle
  "1-rgb(0,151,254)": {
    title: "Grandma's girl",
    body: "Maayan thinks she looks really cool skateboarding but that wearing a helmet cancels out the coolness. She wears a helmet anyways because her grandma told her to.",
  },
  "1-#EBC737": {
    title: "Tech bro",
    body: "Maayan will roll her eyes at almost every common tech motivational phrase on Twitter, but in her heart of hearts all she wants is to be the kind of successful founder that these guys are talking about.",
  },
  "1-rgb(255,70,100)": {
    title: "Itai",
    body: "Maayan is obsessed with her 18 year old brother. This isn't even a secret because she talks about him constantly.",
  },
  // Filled square
  "2-rgb(0,151,254)": {
    title: "Smooth moves",
    body: "Maayan has some really cool dance moves that she practices alone in her room. But if you ask her to do any one of them in public, she'll probably find a convenient reason to disappear.",
  },
  "2-#EBC737": {
    title: "Debí tirar más fotos",
    body: "Maayan says she wants to learn Spanish to understand the new Rosalía album, but really it's so she can sing along to Bad Bunny without sounding like an idiot (this will happen regardless).",
  },
  "2-rgb(255,70,100)": {
    title: "🥺👉👈",
    body: "The single most uncomfortable thing you can make Maayan do is flirt with another woman.",
  },
  // Outlined square
  "3-rgb(0,151,254)": {
    title: "The Mom",
    body: "If you know Maayan, she has probably talked about you to her mom at some point. This is a good thing, in most cases.",
  },
  "3-#EBC737": {
    title: "Oversharing",
    body: "Do you know when a thought occurs to you doing a conversation that you want to share but know you probably shouldn’t? Maayan is very bad at the probably shouldn’t part. As a result, if you ask her anything, she’ll answer a bit too truthfully. Unless you ask her about her dating life, in which she’ll suddenly become very interested in whatever seltzers are at the function.",
  },
  "3-rgb(255,70,100)": {
    title: "Societal values",
    body: "Maayan really likes when you mistake her for being ~5 years younger than her actual age. She thinks women visibly aging should be celebrated in our society and doesn't like that she likes this.",
  },
}

export function getSecretForShape(
  shapeType: number,
  clr: string
): ShapeSecret | null {
  return SHAPE_SECRETS[`${shapeType}-${clr}`] ?? null
}

export function ShapeModal({ shape, onClose }: ShapeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const MODAL_SHAPE_SIZE = 600
  const [formValues, setFormValues] = useState({ name: "", secret: "" })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const startClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, ANIMATION_DURATION)
  }, [closing, onClose])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") startClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [startClose])

  const isFilled = shape.shapeType === 0 || shape.shapeType === 2
  const isCircle = shape.shapeType === 0 || shape.shapeType === 1
  const strokeWidth = 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    const name = formValues.name.trim()
    const secret = formValues.secret.trim()
    if (!name) {
      setFormError("Please enter your name.")
      return
    }
    if (!secret) {
      setFormError("Please share a secret.")
      return
    }
    setIsSubmitting(true)
    setFormError(null)
    try {
      setSpinning(true)
      setSubmitted(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not submit.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      className={`shape-modal-overlay ${closing ? "is-closing" : ""}`}
      onClick={(e) => {
        if (e.target === overlayRef.current) startClose()
      }}
    >
      <div
        className={`shape-modal-shape ${
          closing ? "is-closing" : spinning ? "is-spinning" : ""
        }`}
      >
        {/* Title above shape */}
        <p
          className={`text-xl font-semibold tracking-wide mb-6 whitespace-nowrap text-white ${
            submitted ? "opacity-0" : "opacity-100"
          } w-full text-center`}
        >
          {getSecretForShape(shape.shapeType, shape.clr)?.title ??
            shapeName(shape.shapeType)}
        </p>

        {/* Shape with form inside */}
        <div
          className="relative"
          style={{ width: MODAL_SHAPE_SIZE, height: MODAL_SHAPE_SIZE }}
        >
          <svg
            className="absolute inset-0"
            width={MODAL_SHAPE_SIZE}
            height={MODAL_SHAPE_SIZE}
            viewBox={`0 0 ${MODAL_SHAPE_SIZE} ${MODAL_SHAPE_SIZE}`}
            aria-hidden="true"
          >
            {isCircle ? (
              <circle
                cx={MODAL_SHAPE_SIZE / 2}
                cy={MODAL_SHAPE_SIZE / 2}
                r={MODAL_SHAPE_SIZE / 2 - strokeWidth / 2}
                fill={isFilled ? shape.clr : "black"}
                stroke={shape.clr}
                strokeWidth={isFilled ? 0 : strokeWidth}
              />
            ) : (
              <rect
                x={isFilled ? 0 : strokeWidth / 2}
                y={isFilled ? 0 : strokeWidth / 2}
                width={
                  isFilled ? MODAL_SHAPE_SIZE : MODAL_SHAPE_SIZE - strokeWidth
                }
                height={
                  isFilled ? MODAL_SHAPE_SIZE : MODAL_SHAPE_SIZE - strokeWidth
                }
                fill={isFilled ? shape.clr : "black"}
                stroke={shape.clr}
                strokeWidth={isFilled ? 0 : strokeWidth}
              />
            )}
          </svg>

          {/* Dark overlay for text readability – opacity varies by color */}
          {shape.clr in COLOR_OVERLAY_OPACITY ? (
            <svg
              className="absolute inset-0"
              width={MODAL_SHAPE_SIZE}
              height={MODAL_SHAPE_SIZE}
              viewBox={`0 0 ${MODAL_SHAPE_SIZE} ${MODAL_SHAPE_SIZE}`}
              aria-hidden="true"
            >
              {isCircle ? (
                <circle
                  cx={MODAL_SHAPE_SIZE / 2}
                  cy={MODAL_SHAPE_SIZE / 2}
                  r={MODAL_SHAPE_SIZE / 2 - strokeWidth / 2}
                  fill={`rgba(0,0,0,${COLOR_OVERLAY_OPACITY[shape.clr]})`}
                />
              ) : (
                <rect
                  x={0}
                  y={0}
                  width={MODAL_SHAPE_SIZE}
                  height={MODAL_SHAPE_SIZE}
                  fill={`rgba(0,0,0,${COLOR_OVERLAY_OPACITY[shape.clr]})`}
                />
              )}
            </svg>
          ) : null}

          {/* Form inside the shape */}
          <div
            className="absolute inset-0"
            style={{
              padding: isCircle
                ? `0 ${Math.round(MODAL_SHAPE_SIZE * 0.15)}px`
                : `0 ${Math.round(MODAL_SHAPE_SIZE * 0.12)}px`,
            }}
          >
            {/* Form layer */}
            <div
              className={`absolute inset-0 flex flex-col justify-center text-white ${
                isCircle ? "items-center" : ""
              }`}
              style={{
                padding: "inherit",
                opacity: submitted ? 0 : 1,
                transition: "opacity 400ms cubic-bezier(.215, .61, .355, 1)",
                willChange: "opacity",
              }}
            >
              <form
                onSubmit={handleSubmit}
                className={`w-full space-y-5 ${isCircle ? "text-center" : ""}`}
              >
                <div className="space-y-2">
                  <p className="text-xl font-bold leading-tight">
                    A Secret for a Secret
                  </p>
                  <p className="text-lg text-white leading-snug">
                    Maayan would like one of your secrets in exchange for hers.
                  </p>
                </div>

                <label className="block">
                  <span className="text-lg text-white">Your name:</span>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-base text-white p-2 outline-none mt-1"
                    style={{
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                    autoComplete="name"
                  />
                </label>

                <label className="block">
                  <span className="text-lg text-white">
                    Your secret (it better be good):
                  </span>
                  <textarea
                    value={formValues.secret}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        secret: e.target.value,
                      }))
                    }
                    className="mt-1 w-full bg-transparent text-base text-white p-2 outline-none resize-none"
                    style={{
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                  />
                </label>

                {formError ? (
                  <p className="text-sm text-white">{formError}</p>
                ) : null}

                <div
                  className={`flex ${
                    isCircle ? "justify-center" : "justify-end"
                  }`}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 hover:ml-2 text-lg text-white border-b border-white/50 transition-all duration-200 ease disabled:opacity-40 hover:-mr-1"
                  >
                    {isSubmitting ? "Sharing..." : "See Maayan's secret"}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            </div>

            {/* Secret layer */}
            <div
              className={`absolute inset-0 flex flex-col justify-center text-white ${
                isCircle ? "items-center" : ""
              }`}
              style={{
                padding: "inherit",
                opacity: submitted ? 1 : 0,
                transition:
                  "opacity 400ms cubic-bezier(.215, .61, .355, 1) 200ms",
                willChange: "opacity",
                pointerEvents: submitted ? "auto" : "none",
              }}
            >
              {(() => {
                const secret = getSecretForShape(shape.shapeType, shape.clr)
                return secret ? (
                  <div className={`space-y-3 ${isCircle ? "text-center" : ""}`}>
                    <p className="text-xl font-bold leading-tight">
                      {secret.title}
                    </p>
                    <p className="text-lg leading-relaxed text-white/90">
                      {secret.body}
                    </p>
                  </div>
                ) : (
                  <div className={`space-y-2 ${isCircle ? "text-center" : ""}`}>
                    <p className="text-xl font-semibold">You're in.</p>
                    <p className="text-base text-white/70">
                      No secret found for this shape.
                    </p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
