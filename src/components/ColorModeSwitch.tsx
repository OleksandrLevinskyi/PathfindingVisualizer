import type {Component} from 'solid-js';

const ColorModeSwitch: Component = () => {
    return (
        <button type="button" class="btn p-0" id="mode">
            <img id="color-mode-icon" class="sized-icon" src="/images/controls/moon.png"
                 alt="MOON"/>
        </button>
    );
};

export default ColorModeSwitch;
