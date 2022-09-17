import type {Component} from 'solid-js';
import {OBSTACLE} from "../ts/types";

type RadioButtonProps = {
    type: OBSTACLE,
    isChecked: boolean,
}

const RadioButton: Component<RadioButtonProps> = ({type, isChecked}) => {
    return (
        <>
            <input type="radio" class="btn-check w-50" name="obstacle"
                   id={`obstacle_${type}`} value={type} autocomplete="off" checked={isChecked}/>
            <label
                class="btn btn-outline-primary d-inline-flex align-items-center justify-content-start p-0 ps-1 pe-1"
                for={`obstacle_${type}`}>
                <img class="sized-icon me-1"
                     src={`/images/${type}.png`}
                     alt={type}/> wall
            </label>
        </>
    );
};

export default RadioButton;
