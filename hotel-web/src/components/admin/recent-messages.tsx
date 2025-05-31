import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, User } from "lucide-react";

export default function RecentMessages() {
  const messages = [
    {
      id: 1,
      name: "Aziz Karimov",
      phone: "+998 90 123 45 67",
      message: "Deluxe xona haqida ma'lumot kerak. Narxi qancha?",
      time: "2 soat oldin",
      status: "new",
    },
    {
      id: 2,
      name: "Malika Tosheva",
      phone: "+998 91 234 56 78",
      message: "Suite xonani ko'rish mumkinmi? Oilam bilan kelmoqchiman.",
      time: "4 soat oldin",
      status: "replied",
    },
    {
      id: 3,
      name: "Bobur Aliyev",
      phone: "+998 93 345 67 89",
      message: "Restoran haqida ma'lumot bering. Milliy taomlar bormi?",
      time: "1 kun oldin",
      status: "new",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>So&lsquo;nggi Xabarlar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{message.name}</h4>
                  <p className="text-sm text-gray-500">{message.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={message.status === "new" ? "default" : "secondary"}
                >
                  {message.status === "new" ? "Yangi" : "Javob berilgan"}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {message.time}
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{message.message}</p>
            <div className="flex space-x-2">
              {/* <Button size="sm" variant="outline">
                Javob berish
              </Button> */}
              {/* <Button size="sm" variant="ghost">
                Batafsil
              </Button> */}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
