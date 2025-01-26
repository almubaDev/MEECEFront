// src/components/shared/RichEditor.jsx
import React, { useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getCurrentUser } from '../../services/auth';

const API_BASE_URL = 'http://localhost:8000';

class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    async upload() {
        try {
            console.log('🚀 Iniciando upload de imagen');
            const file = await this.loader.file;
            console.log('📁 Archivo obtenido:', file.name);

            const formData = new FormData();
            formData.append('image', file);

            const token = getCurrentUser()?.access;
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_BASE_URL}/api/upload-image/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar la imagen');
            }

            const data = await response.json();
            console.log('✅ Upload exitoso, URL:', data.url);
            
            // Retornamos con atributos adicionales
            return {
                default: data.url,
                uploaded: 1,
                width: '50%'  // Forzamos el ancho al 50%
            };
        } catch (error) {
            console.error('❌ Error en upload:', error);
            throw error;
        }
    }

    abort() {
        console.log('🛑 Upload abortado');
    }
}

const RichEditor = ({
    value = '',
    onChange,
    placeholder = 'Comienza a escribir...',
    className = ''
}) => {
    const editorRef = useRef();

    const editorConfig = {
        language: 'es',
        placeholder,
        heading: {
            options: [
                { model: 'paragraph', title: 'Párrafo', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Encabezado 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Encabezado 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Encabezado 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Encabezado 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Encabezado 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Encabezado 6', class: 'ck-heading_heading6' }
            ]
        },
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                '|',
                'alignment', // Herramienta de alineación
                '|',
                'bulletedList',
                'numberedList',
                '|',
                //'imageUpload',
                'link',
                'insertTable',
                //'mediaEmbed',
                '|',
                'undo',
                'redo'
            ],
            shouldNotGroupWhenFull: true
        },
        // image: {
        //     toolbar: [
        //         'imageTextAlternative',
        //         '|',
        //         'imageStyle:alignLeft',
        //         'imageStyle:alignCenter',
        //         'imageStyle:alignRight'
        //     ],
        //     styles: {
        //         options: [
        //             'alignLeft',
        //             'alignCenter',
        //             'alignRight'
        //         ]
        //     },
        //     insert: {
        //         type: 'auto'  // Permitir inserción automática
        //     }
        // },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        alignment: {
            options: ['left', 'center', 'right', 'justify'] // Opciones de alineación
        }
    };

    return (
        <div className={`rich-editor-container relative ${className}`}>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                config={editorConfig}
                onReady={editor => {
                    try {
                        console.log('🎯 Editor inicializado');
                        editorRef.current = editor;

                        if (editor.plugins.has('FileRepository')) {
                            console.log('📁 FileRepository plugin encontrado');
                            editor.plugins.get('FileRepository').createUploadAdapter = loader => {
                                return new UploadAdapter(loader);
                            };
                        }

                        // Establecer altura mínima
                        const viewEditableRoot = editor.editing.view.document.getRoot();
                        if (viewEditableRoot) {
                            editor.editing.view.change(writer => {
                                writer.setAttribute(
                                    'style',
                                    'min-height: 500px',
                                    viewEditableRoot
                                );
                                console.log('📏 Altura mínima establecida');
                            });
                        }
                    } catch (error) {
                        console.error('❌ Error en la inicialización del editor:', error);
                    }
                }}
                onChange={(event, editor) => {
                    if (onChange && editor) {
                        const data = editor.getData();
                        onChange(data);
                    }
                }}
            />
        </div>
    );
};

export default RichEditor;