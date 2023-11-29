import styled from "styled-components";
import { colors } from "./colors";

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  outline: none;
  height: 2rem;
  width: 40ch;
  border-radius: 2rem;
  border-width: 5px;
  border-color: ${colors.green};
  text-align: center;

  &::placeholder,
  ::-webkit-input-placeholder {
    color: ${colors.lightGrey};
    text-align: center;
  }
  &::-ms-input-placeholder {
    color: ${colors.lightGrey};
    text-align: center;
  }
`;
