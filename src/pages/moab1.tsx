import React, { useEffect } from "react"

// This component mirrors your provided HTML structure in React.
// Since you said "Import everything here we have no layout.tsx",
// we dynamically inject the Google Fonts <link> tags into <head>.
export default function FigmaExportLayout() {
  useEffect(() => {
    const fontLink = document.createElement("link")
    fontLink.rel = "stylesheet"
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"

    document.head.appendChild(fontLink)
    return () => {
      document.head.removeChild(fontLink)
    }
  }, [])

  return (
    <div
      className="frame-1400003495"
      style={{
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Left rail */}
      <div className="frame-1400003486">
        {/* Item 1 */}
        <div className="frame-1400003483">
          <div className="container-a" style={{ position: "relative" }}>
            <div className="svg-a">
              <div className="vector-a"></div>
              <div className="vector-b"></div>
            </div>
          </div>
        </div>

        <div className="frame-1400003485"></div>

        {/* Item 2 */}
        <div className="frame-1400003484">
          <div className="icon-pointer-a" style={{ position: "relative" }}>
            <div className="vector-c"></div>
          </div>
        </div>

        <div className="frame-1400003488"></div>

        {/* Item 3 */}
        <div className="frame-1400003489">
          <div className="icon-pointer-b" style={{ position: "relative" }}>
            <div className="vector-d"></div>
          </div>
        </div>

        <div className="frame-1400003491"></div>

        {/* Item 4 */}
        <div className="frame-1400003490">
          <div className="icon-pointer-c" style={{ position: "relative" }}>
            <div className="vector-e"></div>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="frame-1400003487">
        <div className="container-b">
          <div className="container-b1">
            <div className="stagehand-config-title">Stagehand Config</div>
          </div>
          <div className="container-b2">
            <div className="stagehand-config-subtitle">
              Configuration for Stagehand
            </div>
          </div>
        </div>

        <div className="container-c">
          <div className="container-c1">
            <div className="navigate-title">Navigate</div>
          </div>
          <div className="container-c2">
            <div className="navigate-subtitle">
              Navigated to flights.google.com
            </div>
          </div>
        </div>

        <div className="container-d">
          <div className="container-d1">
            <div className="click-title-a">Click</div>
          </div>
          <div className="container-d2">
            <div className="click-subtitle-a">
              Clicked the round trip downdown
            </div>
          </div>
        </div>

        <div className="container-e">
          <div className="container-e1">
            <div className="click-title-b">Click</div>
          </div>
          <div className="container-e2">
            <div className="click-subtitle-b">
              Clicked the round trip downdown
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8" />
//   <title>Figma Export Layout</title>

//   <!-- Load Inter (400, 500) -->
//   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />

//   <!-- Your styles -->
//   <link rel="stylesheet" href="./styles.css" />
// </head>

// <body>
//   <!-- Root -->
//   <div class="frame-1400003495">
//     <!-- Left rail -->
//     <div class="frame-1400003486">
//       <!-- Item 1 -->
//       <div class="frame-1400003483">
//         <div class="container-a" style="position: relative;">
//           <div class="svg-a">
//             <div class="vector-a"></div>
//             <div class="vector-b"></div>
//           </div>
//         </div>
//       </div>

//       <div class="frame-1400003485"></div>

//       <!-- Item 2 -->
//       <div class="frame-1400003484">
//         <div class="icon-pointer-a" style="position: relative;">
//           <div class="vector-c"></div>
//         </div>
//       </div>

//       <div class="frame-1400003488"></div>

//       <!-- Item 3 -->
//       <div class="frame-1400003489">
//         <div class="icon-pointer-b" style="position: relative;">
//           <div class="vector-d"></div>
//         </div>
//       </div>

//       <div class="frame-1400003491"></div>

//       <!-- Item 4 -->
//       <div class="frame-1400003490">
//         <div class="icon-pointer-c" style="position: relative;">
//           <div class="vector-e"></div>
//         </div>
//       </div>
//     </div>

//     <!-- Right content -->
//     <div class="frame-1400003487">
//       <div class="container-b">
//         <div class="container-b1">
//           <div class="stagehand-config-title">Stagehand Config</div>
//         </div>
//         <div class="container-b2">
//           <div class="stagehand-config-subtitle">Configuration for Stagehand</div>
//         </div>
//       </div>

//       <div class="container-c">
//         <div class="container-c1">
//           <div class="navigate-title">Navigate</div>
//         </div>
//         <div class="container-c2">
//           <div class="navigate-subtitle">Navigated to flights.google.com</div>
//         </div>
//       </div>

//       <div class="container-d">
//         <div class="container-d1">
//           <div class="click-title-a">Click</div>
//         </div>
//         <div class="container-d2">
//           <div class="click-subtitle-a">Clicked the round trip downdown</div>
//         </div>
//       </div>

//       <div class="container-e">
//         <div class="container-e1">
//           <div class="click-title-b">Click</div>
//         </div>
//         <div class="container-e2">
//           <div class="click-subtitle-b">Clicked the round trip downdown</div>
//         </div>
//       </div>
//     </div>
//   </div>
// </body>

// </html>
