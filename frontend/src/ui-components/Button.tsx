import styled from "styled-components";
import { colors } from "./colors";

export const Button = styled.button`
    outline: none;
    height: 2rem;
    border-radius: 2rem;
    border-width: 5px;
    border-color: ${colors.orange};
    background-color: ${colors.lightOrange};
    color: whitesmoke;
    &:hover {
        background-color: ${colors.orange};
    }
    &:disabled {
        background-color: ${colors.lightGrey};
        border-color: grey;
        color: ${colors.disabled};
    }
`