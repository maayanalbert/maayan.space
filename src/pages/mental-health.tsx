import React, { useState } from "react"
import UnderConstructionModal from "@/components/UnderConstructionModal"

const MentalHealthPage: React.FC = () => {
  const [showConstruction, setShowConstruction] = useState(true)

  return <UnderConstructionModal />
}

export default MentalHealthPage
