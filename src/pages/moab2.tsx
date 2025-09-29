import React, { useEffect } from "react"

// Tailwind-only recreation of your CSS. Exact sizes/colors preserved with arbitrary values.
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
    <div className="flex flex-row items-center p-0 gap-1 w-[252.8px] h-[240px] flex-none order-0 grow-0 antialiased [font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,'Noto_Sans','Liberation_Sans',sans-serif]">
      {/* Left rail */}
      <div className="flex flex-col items-center py-2 px-0 w-4 h-[240px] flex-none order-0 self-stretch grow-0">
        {/* Item 1 */}
        <div className="flex flex-row justify-center items-center p-0 gap-2 w-4 h-8 flex-none order-0 self-stretch grow-0">
          <div className="relative flex flex-row justify-center items-center p-0 w-4 h-4 rounded-[13421800px] flex-none order-0 grow-0">
            <div className="w-4 h-4 flex-none order-0 grow-0">
              <div className="absolute left-[12.43%] right-[12.43%] top-[8.33%] bottom-[8.34%] border-[1.33333px] border-[#A8A29E]"></div>
              <div className="absolute left-[37.5%] right-[37.5%] top-[37.5%] bottom-[37.5%] border-[1.33333px] border-[#A8A29E]"></div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#E7E5E4] flex-none order-1 grow-0" />

        {/* Item 2 */}
        <div className="flex flex-row justify-center items-center p-0 gap-2 w-4 h-8 flex-none order-2 grow-0">
          <div className="relative w-4 h-4 flex-none order-0 grow-0">
            <div className="absolute left-[9.17%] right-[12.5%] top-[9.16%] bottom-[12.5%] border-[1.33333px] border-[#A8A29E]"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#E7E5E4] flex-none order-3 grow-0" />

        {/* Item 3 */}
        <div className="flex flex-row justify-center items-center p-0 gap-2 w-4 h-8 flex-none order-4 grow-0">
          <div className="relative w-4 h-4 flex-none order-0 grow-0">
            <div className="absolute left-[9.17%] right-[12.5%] top-[9.16%] bottom-[12.5%] border-[1.33333px] border-[#A8A29E]"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#E7E5E4] flex-none order-5 grow-0" />

        {/* Item 4 */}
        <div className="flex flex-row justify-center items-center p-0 gap-2 w-4 h-8 flex-none order-6 grow-0">
          <div className="relative w-4 h-4 flex-none order-0 grow-0">
            <div className="absolute left-[9.17%] right-[12.5%] top-[9.16%] bottom-[12.5%] border-[1.33333px] border-[#A8A29E]"></div>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex flex-col items-start p-0 gap-4 w-[232.8px] h-[240px] flex-none order-1 self-stretch grow-0">
        {/* Container B */}
        <div className="flex flex-col items-start p-2 flex-none self-stretch grow-0 order-0 rounded-[0px]">
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-medium text-[12px] leading-4 flex items-center text-[#1C1917] flex-none self-stretch grow-0">
              Stagehand Config
            </div>
          </div>
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-normal text-[12px] leading-4 flex items-center text-[#57534E] flex-none self-stretch grow-0">
              Configuration for Stagehand
            </div>
          </div>
        </div>

        {/* Container C */}
        <div className="flex flex-col items-start p-2 flex-none self-stretch grow-0 order-1 bg-[rgba(0,0,0,0.06)] rounded-[4px]">
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-medium text-[12px] leading-4 flex items-center text-[#1C1917] flex-none self-stretch grow-0">
              Navigate
            </div>
          </div>
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-normal text-[12px] leading-4 flex items-center text-[#57534E] flex-none self-stretch grow-0">
              Navigated to flights.google.com
            </div>
          </div>
        </div>

        {/* Container D */}
        <div className="flex flex-col items-start p-2 flex-none self-stretch grow-0 order-2 rounded-[0px]">
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-medium text-[12px] leading-4 flex items-center text-[#1C1917] flex-none self-stretch grow-0">
              Click
            </div>
          </div>
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-normal text-[12px] leading-4 flex items-center text-[#57534E] flex-none self-stretch grow-0">
              Clicked the round trip downdown
            </div>
          </div>
        </div>

        {/* Container E */}
        <div className="flex flex-col items-start p-2 flex-none self-stretch grow-0 order-3 rounded-[0px]">
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-medium text-[12px] leading-4 flex items-center text-[#1C1917] flex-none self-stretch grow-0">
              Click
            </div>
          </div>
          <div className="flex flex-col items-start p-0 flex-none self-stretch grow-0">
            <div className="font-normal text-[12px] leading-4 flex items-center text-[#57534E] flex-none self-stretch grow-0">
              Clicked the round trip downdown
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
