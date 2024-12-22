import React, { useState } from "react"
import UnderConstructionModal from "@/components/UnderConstructionModal"

const ConsumerSocialPage: React.FC = () => {
  const [showConstruction, setShowConstruction] = useState(true)

  return <UnderConstructionModal />
}

export default ConsumerSocialPage
