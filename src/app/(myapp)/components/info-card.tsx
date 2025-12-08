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
    <IGRPCard className="w-full">
      <IGRPCardContent>
        <div className="text-center py-8">
          <IGRPIcon
            iconName={iconName}
            size={48}
            className="text-gray-400 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500">{description}</p>
        </div>
      </IGRPCardContent>
    </IGRPCard>
  );
};
