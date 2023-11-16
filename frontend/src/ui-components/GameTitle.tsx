import styled, { keyframes } from "styled-components";
import { colors } from "./colors";

const bounce = keyframes`
  80% { transform:translateY(0%); }
  85% { transform:translateY(-15%); }
  90% { transform:translateY(0%); }
  95% { transform:translateY(-7%); }
  97% { transform:translateY(0%); }
  99% { transform:translateY(-3%); }
  100% { transform:translateY(0); }
`;

const TextSvg = styled.svg`
  flex-grow: 1;
  width: 100%;
  height: 0px;
  font-size: x-large;
  text {
    animation: ${bounce} 8s linear infinite;
    stroke-width: 1;
    stroke: ${colors.green};
    fill: ${colors.darkGrey};
  }
`;

export function GameTitle({ text }: { text: string }) {
  return (
    <TextSvg viewBox="0 0 100 100">
      <text x="50%" y="50%" textAnchor="middle">
        {text}
      </text>
    </TextSvg>
  );
}
