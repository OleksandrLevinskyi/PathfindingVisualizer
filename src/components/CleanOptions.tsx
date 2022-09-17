import type {Component} from 'solid-js';

const CleanOptions: Component = () => {
    return (
        <div class="btn-group w-100" role="group" aria-label="clean options">
            <button type="button" class="btn btn-outline-primary w-25" id="clean">Clean Path</button>
            <button type="button" class="btn btn-outline-primary w-25" id="reset">Reset Field</button>
            <button type="button" class="btn btn-outline-primary w-25" id="cancel" disabled>Cancel Animation</button>
        </div>
    );
};

export default CleanOptions;
