import { cn } from "@/lib/utils";
import {
  IGRPCard,
  IGRPCardContent,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";

export const InfoCard = ({
  iconName = "SquareCheckBig",
  title,
  description,
}: {
  iconName: string;
  title: string;
  description: string;
}) => {
  return (
    <IGRPCard name={`card1`} className={cn("w-full")}>
      <IGRPCardContent>
        <div className={cn("text-center py-8")}>
          <IGRPIcon
            name={`icon1`}
            iconName={iconName}
            size={48}
            className={cn("text-gray-400 mx-auto mb-4")}
          ></IGRPIcon>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

          <p className="text-gray-500">{description}</p>
        </div>
      </IGRPCardContent>
    </IGRPCard>
  );
};
