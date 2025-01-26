// // src/config/editor.config.js
// import { authHeader } from '../services/auth';

// export const createEditorConfig = (customConfig = {}) => ({
//   toolbar: {
//     items: [
//       'heading',
//       '|',
//       'fontSize',
//       'fontFamily',
//       {
//         label: 'Estilos',
//         icon: 'text',
//         items: ['fontColor', 'fontBackgroundColor']
//       },
//       '|',
//       'bold',
//       'italic',
//       'underline',
//       'strikethrough',
//       '|',
//       {
//         label: 'Alineación',
//         icon: 'alignLeft',
//         items: ['alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify']
//       },
//       'bulletedList',
//       'numberedList',
//       '|',
//       'indent',
//       'outdent',
//       '|',
//       {
//         label: 'Insertar',
//         icon: 'plus',
//         items: ['imageUpload', 'link', 'mediaEmbed', 'blockQuote', 'insertTable']
//       },
//       '|',
//       'undo',
//       'redo'
//     ],
//     shouldNotGroupWhenFull: true
//   },
  
//   image: {
//     toolbar: [
//       'imageStyle:inline',
//       'imageStyle:block',
//       'imageStyle:side',
//       '|',
//       'toggleImageCaption',
//       'imageTextAlternative',
//       '|',
//       'resizeImage:50',
//       'resizeImage:75',
//       'resizeImage:original'
//     ],
//     styles: {
//       options: [
//         { name: 'inline', title: 'En línea' },
//         { name: 'block', title: 'Ajustado' },
//         { name: 'side', title: 'Lateral' }
//       ]
//     },
//     resizeOptions: [
//       {
//         name: 'resizeImage:original',
//         value: null,
//         label: 'Original'
//       },
//       {
//         name: 'resizeImage:50',
//         value: '50',
//         label: '50%'
//       },
//       {
//         name: 'resizeImage:75',
//         value: '75',
//         label: '75%'
//       }
//     ],
//     upload: {
//       types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
//       url: 'http://localhost:8000/api/upload-image/',
//       headers: authHeader()
//     }
//   },

//   table: {
//     contentToolbar: [
//       'tableColumn',
//       'tableRow',
//       'mergeTableCells',
//       'tableProperties',
//       'tableCellProperties'
//     ],
//     defaultProperties: {
//       borderStyle: 'solid',
//       borderWidth: '1px',
//       borderColor: '#ccc',
//       alignment: 'left'
//     }
//   },

//   fontSize: {
//     options: [
//       'tiny',
//       'small',
//       'default',
//       'big',
//       'huge'
//     ],
//     supportAllValues: true
//   },

//   fontFamily: {
//     options: [
//       'default',
//       'Arial, Helvetica, sans-serif',
//       'Courier New, Courier, monospace',
//       'Georgia, serif',
//       'Lucida Sans Unicode, Lucida Grande, sans-serif',
//       'Tahoma, Geneva, sans-serif',
//       'Times New Roman, Times, serif',
//       'Trebuchet MS, Helvetica, sans-serif',
//       'Verdana, Geneva, sans-serif'
//     ],
//     supportAllValues: true
//   },

//   fontColor: {
//     columns: 6,
//     documentColors: 12,
//     colors: [
//       { color: '#000000', label: 'Negro' },
//       { color: '#4D4D4D', label: 'Gris Oscuro' },
//       { color: '#999999', label: 'Gris' },
//       { color: '#E6E6E6', label: 'Gris Claro' },
//       { color: '#FFFFFF', label: 'Blanco' },
//       { color: '#E74C3C', label: 'Rojo' },
//       { color: '#E67E22', label: 'Naranja' },
//       { color: '#F1C40F', label: 'Amarillo' },
//       { color: '#2ECC71', label: 'Verde' },
//       { color: '#3498DB', label: 'Azul' },
//       { color: '#9B59B6', label: 'Morado' }
//     ]
//   },

//   fontBackgroundColor: {
//     columns: 6,
//     documentColors: 12,
//     colors: [
//       { color: '#FFFFFF', label: 'Blanco' },
//       { color: '#F8F9FA', label: 'Gris Muy Claro' },
//       { color: '#E9ECEF', label: 'Gris Claro' },
//       { color: '#FFF3CD', label: 'Amarillo Claro' },
//       { color: '#D4EDDA', label: 'Verde Claro' },
//       { color: '#CCE5FF', label: 'Azul Claro' }
//     ]
//   },

//   mediaEmbed: {
//     previewsInData: true,
//     providers: [
//       {
//         name: 'youtube',
//         url: [
//           /^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)/,
//           /^(?:m\.)?youtube\.com\/v\/([\w-]+)/,
//           /^youtube\.com\/embed\/([\w-]+)/,
//           /^youtu\.be\/([\w-]+)/
//         ],
//         html: match => `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
//           <iframe 
//             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
//             src="https://www.youtube.com/embed/${match[1]}"
//             frameborder="0"
//             allow="autoplay; encrypted-media"
//             allowfullscreen>
//           </iframe>
//         </div>`
//       },
//       {
//         name: 'vimeo',
//         url: [
//           /^vimeo\.com\/([\d]+)/,
//           /^vimeo\.com\/video\/([\d]+)/,
//           /^vimeo\.com\/(\d+)$/,
//           /^vimeo\.com\/channels\/[\d\w]+\/([\d]+)/
//         ],
//         html: match => `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
//           <iframe 
//             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
//             src="https://player.vimeo.com/video/${match[1]}"
//             frameborder="0"
//             allowfullscreen>
//           </iframe>
//         </div>`
//       }
//     ]
//   },

//   language: 'es',
  
//   // Merge custom config
//   ...customConfig
// });