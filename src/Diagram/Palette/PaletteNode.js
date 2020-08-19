import React, { useRef, useState } from 'react'
import getDiagramNodeStyle from '../DiagramNode/getDiagramNodeStyle';
import CustomRenderer from '../DiagramNode/CustomRender';
import { usePortRegistration, useNodeRegistration } from '../../shared/hooks/useContextRegistration';
import useDrag from '../../shared/hooks/useDrag';
import isEqual from 'lodash/isEqual';

const PaletteNode = (props) =>{
    const {id, type, content, flow, coordinates, onPositionChange, render} = props
    const { ref, onDragStart, onDrag, onDragEnd } = useDrag({ throttleBy: 14 }); // get the drag n drop methods
    const classList = "bi bi-diagram-node bi-diagram-node-default"
    const dragStartPoint = useRef(coordinates); // keeps the drag start point in a persistent reference
    const [newNodeId, setNewNodeId] = useState();

    onDragStart(() => {
        console.log("OnDragStart")
        dragStartPoint.current = coordinates;
        //Spawn a new node in the editor and start dragging it
        setNewNodeId(Math.random().toString(36).substring(2));
      });
    
      // whilst dragging calculates the next coordinates and perform the `onPositionChange` callback
      onDrag((event, info) => {
        console.log("onDrag")
        if (onPositionChange) {
          event.stopImmediatePropagation();
          event.stopPropagation();
          const maxWidth = document.getElementById(flow).offsetWidth;
          const maxHeight = document.getElementById(flow).offsetHeight
          let nextX = dragStartPoint.current[0] - info.offset[0]
          let nextY = dragStartPoint.current[1] - info.offset[1]
          
          //Check if outside boundaries
          if (nextX < 0){
            nextX = 0
          }
          else if (nextX > maxWidth){
            nextX = maxWidth
          }

          if (nextY < 0 ){
            nextY = 0
          }
          else if (nextY > maxHeight){
            nextY = maxHeight
          }

          const nextCoords = [nextX, nextY];
          onPositionChange(id, newNodeId, nextCoords);
        }
      });

      onDragEnd((event,info) => {
        console.log("onDragEnd")
        console.log(event)
        console.log(info)
      });

    return (
        <div className={classList} ref={ref} style={getDiagramNodeStyle(coordinates)}>
        {render && typeof render === 'function' && (<CustomRenderer {...customRenderProps} />)}
        {!render && (
          <>
            <div className="bi-port-wrapper">
              {content}
              <div className="bi-input-ports">
              </div>
              <div className="bi-output-ports">
              </div>
            </div>
          </>
        )}
      </div>
    )
}

export default React.memo(PaletteNode, isEqual);
