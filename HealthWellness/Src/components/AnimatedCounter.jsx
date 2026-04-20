import React from "react";

const AnimatedCounter = React.memo(function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  textStyle,
  TextComponent,
}) {
  const safeValue = Number(value) || 0;
  const numberText = `${prefix}${safeValue.toFixed(decimals)}${suffix}`;

  return (
    <TextComponent style={textStyle}>
      {numberText}
    </TextComponent>
  );
});

export default AnimatedCounter;
