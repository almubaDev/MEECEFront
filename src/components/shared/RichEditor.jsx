// src/components/shared/RichEditor.jsx
import React, { useEffect, useRef } from 'react';
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
                    console.log('Editor initialized');
                }}
                initialValue={value}
                init={{
                    height: 300,
                    menubar: true,
                    branding: false,
                    statusbar: false,
                    plugins: [
                        'lists link paste'
                    ],
                    toolbar: 'undo redo | formatselect | bold italic | ' +
                            'alignleft aligncenter alignright alignjustify | ' +
                            'bullist numlist',
                    content_style: `
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                            font-size: 14px;
                            padding: 10px;
                            margin: 0;
                            min-height: 100px;
                        }
                    `,
                    formats: {
                        alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-left' },
                        aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-center' },
                        alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-right' },
                    },
                    setup: function(editor) {
                        editor.on('init', function() {
                            editor.setContent(value);
                        });
                        editor.on('change', function() {
                            onChange(editor.getContent());
                        });
                    }
                }}
            />
        </div>
    );
};

export default RichEditor;
