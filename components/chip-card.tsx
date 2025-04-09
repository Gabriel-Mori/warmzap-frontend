// frontend/components/chip-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChipCardProps {
  chip: {
    id: string;
    phoneNumber: string;
    status: "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "BLOCKED";
    daysLeft?: number;
    messagesExchanged?: number;
    lastActivity?: string;
  };
}

const ChipCard: React.FC<ChipCardProps> = ({ chip }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{chip.phoneNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {chip.status}</p>
        <p>Dias Restantes: {chip.daysLeft}</p>
        <p>Mensagens: {chip.messagesExchanged}</p>
        <p>Última Atividade: {chip.lastActivity}</p>
      </CardContent>
    </Card>
  );
};

export default ChipCard;
