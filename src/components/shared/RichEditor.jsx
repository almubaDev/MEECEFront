// src/components/shared/RichEditor.jsx
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichEditor = ({
    value = '',
    onChange,
    placeholder = 'Comienza a escribir...',
    className = ''
}) => {
    const editorRef = useRef(null);

    return (
        <div className={`rich-editor-container relative ${className}`}>
            <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                }}
                value={value}
                init={{
                    height: 400,
                    menubar: true,
                    plugins: 'lists advlist link image charmap preview anchor ' +
                            'searchreplace visualblocks code fullscreen ' +
                            'insertdatetime media table paste code help wordcount',
                    formats: {
                        ul: { selector: 'ul', classes: 'list-disc' },
                        ol: { selector: 'ol', classes: 'list-decimal' }
                    },
                    menu: {
                        format: { 
                            title: 'Format', 
                            items: 'bold italic underline strikethrough superscript subscript | formats blocks fontfamily fontsizes align lineheight | forecolor backcolor | removeformat' 
                        }
                    },
                    toolbar: 'undo redo | bold italic | ' +
                            'bullist numlist | alignleft aligncenter alignright | ' +
                            'formatselect | help',
                    toolbar_mode: 'wrap',
                    toolbar_sticky: true,
                    content_style: `
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                            font-size: 14px;
                            padding: 20px;
                        }
                        ul { 
                            list-style-type: disc !important;
                            margin-left: 20px !important;
                            padding-left: 20px !important;
                        }
                        ol { 
                            list-style-type: decimal !important;
                            margin-left: 20px !important;
                            padding-left: 20px !important;
                        }
                        ul li, ol li {
                            margin-bottom: 8px !important;
                            display: list-item !important;
                        }
                    `,
                    valid_elements: '*[*]',  // Permitir todos los elementos
                    extended_valid_elements: '*[*]',  // Permitir elementos extendidos
                    custom_elements: '~ul,~ol,~li',  // Permitir elementos personalizados
                    force_br_newlines: false,
                    force_p_newlines: false,
                    forced_root_block: 'p',
                    paste_data_images: true,
                    lists_indent_on_tab: true,
                    // Configuración específica para listas
                    advlist_bullet_styles: 'disc,circle,square',
                    advlist_number_styles: 'default,lower-alpha,lower-roman,upper-alpha,upper-roman'
                }}
                onEditorChange={(content) => {
                    onChange(content);
                }}
            />
        </div>
    );
};

export default RichEditor;