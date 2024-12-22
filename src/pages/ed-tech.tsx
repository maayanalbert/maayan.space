import React, { useState } from "react"
import UnderConstructionModal from "@/components/UnderConstructionModal"

const EdTechPage: React.FC = () => {
  const [showConstruction, setShowConstruction] = useState(true)

  return <UnderConstructionModal />
}

export default EdTechPage
