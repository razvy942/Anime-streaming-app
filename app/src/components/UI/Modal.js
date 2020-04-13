import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = props => {
  const el = document.createElement('div');
  const modalRoot = document.getElementById('portal');

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return ReactDOM.createPortal(props.children, el);
};

export default Modal;
