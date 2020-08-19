import React, { useCallback, useState, useEffect } from 'react'
import PaletteNode from './PaletteNode'
import updateNodeCoordinates from '../NodesCanvas/updateNodeCoordinates';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

const types = [
    {
        data: {
            type: 'inject',
        },
        content: 'Inject node',
        coordinates: [0,0],
        id: Math.random().toString(36).substring(2)
    },
    {
        data: {
            type: 'debug',
        },
        content: 'Debug node',
        coordinates: [0,40],
        id: Math.random().toString(36).substring(2)
    }
]

const PaletteCanvas = (props) => {
    const {flow, nodes, onChange} = props
    
    /*const [types, setTypes] = useState([])

    useEffect(() => {
        setTypes(defaultTypes)
    }, [])
    */

    // when a node item update its position updates it within the nodes array
    const onNodePositionChange = useCallback((typeId, nodeId, newCoordinates) => {
        console.log("onNodePositionChange")
        if (onChange) {
            //deep clone
            let nextNodes = updateNodeCoordinates(nodeId, newCoordinates, nodes);
            //add new node
            if (findIndex(nodes, ['id', nodeId]) === -1){
                let newNode = cloneDeep(types.find(type => type.id === typeId))
                newNode.id = nodeId
                newNode.coordinates = newCoordinates
                nextNodes.push(newNode)
            }
            onChange(nextNodes);
        }
    }, [nodes, onChange]);

    const availableNodes = types.map((type) => (
        <PaletteNode
            {...type}
            onPositionChange={onNodePositionChange}
            flow={flow}
            type={type.data.type}
        />
    ));

    return (
        <div class="bi bi-diagram-palette">
            {availableNodes}
        </div>
    )
};

export default React.memo(PaletteCanvas, isEqual);
