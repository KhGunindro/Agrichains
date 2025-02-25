import { useWeb3 } from "../contexts/Web3Context"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface StageProgressProps {
  productId: number
  currentStage: string
}

const STAGES = ["Registered", "Planted", "Harvested", "Processed", "Distributed", "In Retail", "Sold"] as const

export default function StageProgress({ currentStage }: StageProgressProps) {
  useWeb3()
  const currentStageIndex = STAGES.findIndex((stage) => stage.toLowerCase() === currentStage.toLowerCase())
  const isFinalStage = currentStageIndex === STAGES.length - 1

  const getStageColor = (index: number) => {
    if (isFinalStage) return "bg-emerald-500" // All stages completed when sold
    if (index < currentStageIndex) return "bg-emerald-500"
    if (index === currentStageIndex) return "bg-blue-500"
    return "bg-slate-200"
  }

  const getStatusText = (index: number) => {
    if (isFinalStage) return "Completed"
    if (index < currentStageIndex) return "Completed"
    if (index === currentStageIndex) return "Current"
    return "Pending"
  }

  return (
    <div className="w-full py-6 px-2">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-5 left-0 h-0.5 bg-slate-200 w-full -z-10"></div>
        
        {STAGES.map((stage, index) => (
          <div 
            key={stage} 
            className="flex-1 flex flex-col items-center relative group cursor-pointer"
            style={{ minWidth: `${100 / STAGES.length}%` }}
          >
            {index > 0 && (
              <div 
                className={`absolute h-0.5 w-full top-5 -z-10 transition-colors duration-300 ${
                  isFinalStage || index <= currentStageIndex ? "bg-emerald-500" : "bg-slate-200"
                }`}
                style={{ 
                  left: "-50%",
                  right: "50%",
                  width: "auto",
                }}
              />
            )}

            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-3 hidden group-hover:block"
              >
                <div className="bg-white shadow-lg rounded-lg p-3 text-sm min-w-[120px] text-center border border-slate-200">
                  <div className="font-medium text-slate-800">{stage}</div>
                  <div className={`text-xs mt-1 ${
                    isFinalStage || index < currentStageIndex ? "text-emerald-600" :
                    index === currentStageIndex ? "text-blue-600" : "text-slate-500"
                  }`}>
                    {getStatusText(index)}
                  </div>
                  <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2">
                    <div className="w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center 
                  ${getStageColor(index)} 
                  ${!isFinalStage && index === currentStageIndex ? "ring-4 ring-blue-100" : ""}
                  shadow-sm transition-all duration-300 group-hover:scale-110`}
              >
                {(isFinalStage || index < currentStageIndex) ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {index + 1}
                  </span>
                )}
              </motion.div>
            </div>

            <span className={`text-xs font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isFinalStage || index < currentStageIndex ? "text-emerald-600" :
              index === currentStageIndex ? "text-blue-600" : "text-slate-500"
            }`}>
              {stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}