"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Reply, Trash2, User, Clock } from "lucide-react";

export default function MessagesManagement() {
  const [messages] = useState([
    {
      id: 1,
      name: "Aziz Karimov",
      phone: "+998 90 123 45 67",
      email: "aziz@example.com",
      message:
        "Deluxe xona haqida ma'lumot kerak. Narxi qancha? Oilam bilan kelmoqchiman.",
      time: "2024-01-15 14:30",
      status: "new",
      priority: "high",
    },
    {
      id: 2,
      name: "Malika Tosheva",
      phone: "+998 91 234 56 78",
      email: "malika@example.com",
      message: "Suite xonani ko'rish mumkinmi? Oilam bilan kelmoqchiman.",
      time: "2024-01-15 10:15",
      status: "replied",
      priority: "medium",
    },
    {
      id: 3,
      name: "Bobur Aliyev",
      phone: "+998 93 345 67 89",
      email: "bobur@example.com",
      message: "Restoran haqida ma'lumot bering. Milliy taomlar bormi?",
      time: "2024-01-14 16:45",
      status: "new",
      priority: "low",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Xabarlarni qidirish..."
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {message.name}
                    </h3>
                    <p className="text-sm text-gray-600">{message.phone}</p>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant={message.status === "new" ? "default" : "secondary"}
                  >
                    {message.status === "new" ? "Yangi" : "Javob berilgan"}
                  </Badge>
                  <Badge
                    variant={
                      message.priority === "high"
                        ? "destructive"
                        : message.priority === "medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {message.priority === "high"
                      ? "Yuqori"
                      : message.priority === "medium"
                        ? "O'rta"
                        : "Past"}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {message.time}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{message.message}</p>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Reply className="w-3 h-3 mr-1" />
                  Javob berish
                </Button>
                <Button size="sm" variant="outline">
                  Belgilash
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  O&rsquo;chirish
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
