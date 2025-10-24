// *********************
// Role of the component: Custom button component
// Name of the component: CustomButton.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CustomButton paddingX={paddingX} paddingY={paddingY} text={text} buttonType={buttonType} customWidth={customWidth} textSize={textSize} />
// Input parameters: CustomButtonProps interface
// Output: custom button component
// *********************

import React from "react";

interface CustomButtonProps {
  paddingX: number;
  paddingY: number;
  text: string;
  buttonType: "submit" | "reset" | "button";
  customWidth: string;
  textSize: string;
}

const CustomButton = ({
  paddingX,
  paddingY,
  text,
  buttonType,
  customWidth,
  textSize
}: CustomButtonProps) => {


  return (
    <button
      type={`${buttonType}`}
      className={`${customWidth !== "no" && `w-${customWidth}`} uppercase px-${paddingX} py-${paddingY} text-${textSize} font-semibold rounded-md btn-primary focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-red,#e10600)]`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
