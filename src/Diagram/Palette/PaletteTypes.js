export const types = [
    {
        data: {
            type: 'inject',
        },
        content: 'Inject node',
        coordinates: [0,0],
        outputs: [
            {alignment: 'right' },
        ],
    },
    {
        data: {
            type: 'debug',
        },
        content: 'Debug node',
        coordinates: [0,40],
        inputs: [
            {alignment: 'left' },
        ],
    },
    {
        data: {
            type: 'function',
            subtype: 'and'
        },
        content: 'AND node',
        coordinates: [0, 80],
        inputs: [
            {alignment: 'left' },
        ],
        outputs: [
            {alignment: 'right' },
        ],
    },
    {
        data: {
            type: 'function',
            subtype: 'or'
        },
        content: 'OR node',
        coordinates: [0, 120],
        inputs: [
            {alignment: 'left' },
        ],
        outputs: [
            {alignment: 'right' },
        ],
    }
]