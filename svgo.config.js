module.exports = {
    plugins: [
        {
            name: 'removeAttrs',
            params: {
                attrs: '(xmlns.*|xlink.*)' // Elimina atributos conflictivos
            }
        },
        {
            name: 'removeDimensions', // Elimina dimensiones explícitas de los SVGs
            active: true
        },
        {
            name: 'removeViewBox', // Conserva el atributo viewBox para escalabilidad
            active: false
        }
    ]
};
