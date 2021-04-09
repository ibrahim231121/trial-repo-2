import { Component } from 'react';
import ReactDOM from 'react-dom';

type domProps = {
    element : any,
    visible? : boolean,
    appendTo : any,
    props? : any
}

type domState = {
    mounted? : any,
}
export class Portal extends Component<domProps, domState> {

    hasDOM() {
        return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
    }

    componentDidMount() {
        if (this.hasDOM() && !this.state.mounted) {
            this.setState({ mounted: true });
        }
    }

    render() {
        return this.props.element && this.state.mounted ? ReactDOM.createPortal(this.props.element, this.props.appendTo || document.body) : null;
    }
}
