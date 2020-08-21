import React, { useCallback, useState, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import DiagramCanvas from './DiagramCanvas/DiagramCanvas';
import NodesCanvas from './NodesCanvas/NodesCanvas';
import LinksCanvas from './LinksCanvas/LinksCanvas';
import { LinkType, NodeType } from '../shared/types/Types';

import PaletteCanvas from './Palette/PaletteCanvas';

import './diagram.scss';

/**
 * The Diagram component is the root-node of any diagram.<br />
 * It accepts a `schema` prop defining the current state of the diagram and emits its possible changes through the
 * `onChange` prop, allowing the developer to have the best possible control over the diagram and its interactions
 * with the user.
 */
const Diagram = (props) => {
  const { id, key, schema, onChange, onDoubleClick, ...rest } = props;
  const [segment, setSegment] = useState();
  const { current: portRefs } = useRef({}); // keeps the port elements references
  const { current: nodeRefs } = useRef({}); // keeps the node elements references
  const [ selectedID, setSelectedID ] = useState('');

  // when nodes change, performs the onChange callback with the new incoming data
  const onNodesChange = useCallback((nextNodes) => {
    onChange({ ...schema, nodes: nextNodes });
  }, [schema, onChange]);

  // when a port is registered, save it to the local reference
  const onPortRegister = useCallback((portId, portEl) => {
    portRefs[portId] = portEl;
  }, [portRefs]);

  // when a node is registered, save it to the local reference
  const onNodeRegister = useCallback((nodeId, nodeEl) => {
    nodeRefs[nodeId] = nodeEl;
  }, [nodeRefs]);

  const onNodeRemove = (nodeId, portsToRemove) => {
    delete nodeRefs[nodeId]
    for (const portId of portsToRemove){
      delete portRefs[portId]
    }
  }

  // when a new segment is dragged, save it to the local state
  const onDragNewSegment = useCallback((portId, from, to, alignment) => {
    setSegment({ id: `segment-${portId}`, from, to, alignment });
  }, []);

  // when a segment fails to connect, reset the segment state
  const onSegmentFail = useCallback(() => {
    setSegment(undefined);
  }, []);

  // when a segment connects, update the links schema, perform the onChange callback
  // with the new data, then reset the segment state
  const onSegmentConnect = useCallback((input, output) => {
    const checkLink = schema.links.find(link => link.input == input && link.output == output)
    const checkInverseLink = schema.links.find(link => link.input == output && link.output == input)
    if(checkLink === undefined && checkInverseLink === undefined){
      const nextLinks = [...(schema.links || []), { input, output }];
      onChange({ ...schema, links: nextLinks });
    }
    setSegment(undefined);
  }, [schema, onChange]);

  // when links change, performs the onChange callback with the new incoming data
  const onLinkDelete = useCallback((nextLinks) => {
    onChange({ ...schema, links: nextLinks });
  }, [schema, onChange]);

  const onClickHandler = () => {
    //Click event in Diagram
    setSelectedID('')
  }

  const handleKeyUp = (ev) => {
    if (ev.key === "Delete" && selectedID !== ''){
      const index = schema.nodes.findIndex(node => node.id === selectedID)
      let portsToRemove = []
      
      //Checking if there is some link (if there is delete it)
      if (schema.nodes[index].inputs){
        for (const input of schema.nodes[index].inputs){
          portsToRemove.push(input.id)
          schema.links = schema.links.filter(link => input.id !== link.input && input.id !== link.output)
        }
      }
      if (schema.nodes[index].outputs){
        for (const output of schema.nodes[index].outputs){
          portsToRemove.push(output.id)
          schema.links = schema.links.filter(link => output.id !== link.input && output.id !== link.output)
        }
      }     
      onLinkDelete(schema.links) 
      schema.nodes.splice(index,1)
      onNodesChange(schema.nodes)
      onNodeRemove(selectedID, portsToRemove)

    }
  }

  return (
    <DiagramCanvas id={id} portRefs={portRefs} nodeRefs={nodeRefs} tabIndex={0} onKeyUp={handleKeyUp} onClick={onClickHandler} {...rest}>
      <PaletteCanvas
        nodes={schema.nodes}
        flow={id}
        onChange={onNodesChange}
      />
      <NodesCanvas
        nodes={schema.nodes}
        flow={id}
        onChange={onNodesChange}
        onNodeRegister={onNodeRegister}
        onPortRegister={onPortRegister}
        onDragNewSegment={onDragNewSegment}
        onSegmentFail={onSegmentFail}
        onSegmentConnect={onSegmentConnect}
        onDoubleClick={onDoubleClick}
        selectedID={selectedID}
        changeSelectedID={setSelectedID}
      />
      <LinksCanvas
        nodes={schema.nodes}
        links={schema.links}
        segment={segment}
        onChange={onLinkDelete}
      />
    </DiagramCanvas>
  );
};

Diagram.propTypes = {
  /**
   * The diagram current schema
   */
  schema: PropTypes.shape({
    nodes: PropTypes.arrayOf(NodeType).isRequired,
    links: PropTypes.arrayOf(LinkType),
  }),
  /**
   * The callback to be performed every time the model changes
   */
  onChange: PropTypes.func,
};

Diagram.defaultProps = {
  schema: { nodes: [], links: [] },
  onChange: undefined,
};

export default React.memo(Diagram, isEqual);
