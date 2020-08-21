import React, { useCallback } from 'react'
import PaletteNode from './PaletteNode'
import updateNodeCoordinates from '../NodesCanvas/updateNodeCoordinates';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import { types } from './PaletteTypes';

const PaletteCanvas = (props) => {
    const {flow, nodes, onChange} = props
    
    /*
    const [types, setTypes] = useState([])

    useEffect(() => {
        const nextTypes = Object.values(jsonTypes).map(type => {return type})
        setTypes(nextTypes)
    }, [])
    */

    // when a node item update its position updates it within the nodes array
    const onNodePositionChange = useCallback((type, nodeId, newCoordinates) => {
        if (onChange) {
            //deep clone
            let nextNodes = updateNodeCoordinates(nodeId, newCoordinates, nodes);
            //add new node
            if (findIndex(nodes, ['id', nodeId]) === -1){
                let newNode = cloneDeep(types.find(genericType => genericType.data.type === type))
                const ports = nodes.map(node => {
                    const outputs = node.outputs ? node.outputs.map(output => parseInt(output.id.substring(5))) : []
                    const inputs = node.inputs ? node.inputs.map(input => parseInt(input.id.substring(5))) : []
                    return [...outputs, ...inputs]
                })
                let currentPortId = ports.length > 0 ? Math.max(...ports)+1 : 0
                if(newNode.outputs){
                    for (const port in newNode.outputs){
                        newNode.outputs[port].id = 'port-'+currentPortId.toString()
                        currentPortId += 1
                    }
                }
                if(newNode.inputs){
                    for (const port in newNode.inputs){
                        newNode.inputs[port].id = 'port-'+currentPortId.toString()
                        currentPortId += 1
                    }
                }
                
                newNode.id = nodeId
                newNode.coordinates = newCoordinates
                nextNodes.push(newNode)
            }
            onChange(nextNodes);
        }
    }, [nodes, onChange]);

    const onNodeIncorrect = (nodeId) => {
        const nextNodes = nodes.filter(node => node.id !== nodeId)
        onChange(nextNodes)
    }

    const availableNodes = types.map((type) => (
        <PaletteNode
            {...type}
            onNodeIncorrect={onNodeIncorrect}
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
