import {
  IGRPEmptyDescriptionPrimitive,
  IGRPEmptyHeaderPrimitive,
  IGRPEmptyMediaPrimitive,
  IGRPEmptyPrimitive,
  IGRPEmptyTitlePrimitive,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";

function Empty({ title, description }: { title: string; description: string }) {
  return (
    <IGRPEmptyPrimitive>
      <IGRPEmptyHeaderPrimitive>
        <IGRPEmptyMediaPrimitive variant="icon">
          <IGRPIcon iconName="Settings" />
        </IGRPEmptyMediaPrimitive>
        <IGRPEmptyTitlePrimitive>{title}</IGRPEmptyTitlePrimitive>
        <IGRPEmptyDescriptionPrimitive>
          {description}
        </IGRPEmptyDescriptionPrimitive>
      </IGRPEmptyHeaderPrimitive>
    </IGRPEmptyPrimitive>
  );
}

export { Empty };
