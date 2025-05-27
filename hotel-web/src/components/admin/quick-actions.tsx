import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Settings, BarChart3 } from "lucide-react"

export default function QuickActions() {
  const actions = [
    {
      title: "Yangi Xona Qo'shish",
      description: "Hotel ga yangi xona qo'shing",
      icon: Plus,
      action: "add-room",
    },
    {
      title: "Ma'lumotlarni Yangilash",
      description: "Hotel ma'lumotlarini tahrirlang",
      icon: Edit,
      action: "edit-info",
    },
    // {
    //   title: "Hisobot Yaratish",
    //   description: "Oylik hisobot yarating",
    //   icon: BarChart3,
    //   action: "generate-report",
    // },
    // {
    //   title: "Sozlamalar",
    //   description: "Tizim sozlamalarini o'zgartiring",
    //   icon: Settings,
    //   action: "settings",
    // },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tezkor Amallar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button key={index} variant="outline" className="w-full justify-start h-auto p-4">
            <action.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-xs text-gray-500">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
