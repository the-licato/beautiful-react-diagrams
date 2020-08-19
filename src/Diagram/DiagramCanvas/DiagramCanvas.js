import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowScroll } from 'beautiful-react-hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DiagramContext from '../../Context/DiagramContext';

/**
 * The DiagramCanvas component provides a context to the Diagram children.
 * The context contains the canvas bounding box (for future calculations) and the port references in order to
 * allow links to easily access to a the ports coordinates
 */

const DiagramCanvas = (props) => {
  const { id, children, portRefs, nodeRefs, className, ...rest } = props;
  const [bbox, setBoundingBox] = useState(null);
  const canvasRef = useRef();
  const classList = classNames('bi bi-diagram', className);

  // calculate the given element bounding box and save it into the bbox state
  const calculateBBox = useCallback((el) => {
    if (el) {
      const nextBBox = el.getBoundingClientRect();
      if (!isEqual(nextBBox, bbox)) {
        setBoundingBox(nextBBox);
      }
    }
  }, [bbox, setBoundingBox]);

  // when the canvas is ready and placed within the DOM, save its bounding box to be provided down
  // to children component as a context value for future calculations.
  useEffect(() => calculateBBox(canvasRef.current), [canvasRef.current]);
  // same on window scroll
  useWindowScroll(() => calculateBBox(canvasRef.current));

  const gridLines = (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={"smallGrid-"+id} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
        </pattern>
        <pattern id={"grid-"+id} width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill={"url(#smallGrid-"+id+")"}/>
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={"url(#grid-"+id+")"} />
    </svg>
  )

  return (
    <div className={classList} id={id} ref={canvasRef} {...rest}>
      <DiagramContext.Provider value={{ canvas: bbox, ports: portRefs, nodes: nodeRefs }}>
        {children}
      </DiagramContext.Provider>
      {gridLines}

    </div>
  );
};

DiagramCanvas.propTypes = {
  portRefs: PropTypes.shape({}),
  nodeRefs: PropTypes.shape({}),
  className: PropTypes.string,
};

DiagramCanvas.defaultProps = {
  portRefs: {},
  nodeRefs: {},
  className: '',
};


export default React.memo(DiagramCanvas, isEqual);
