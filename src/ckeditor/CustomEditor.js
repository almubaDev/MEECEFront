// src/ckeditor/CustomEditor.js
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import { Bold, Italic, Underline, Strikethrough } from '@ckeditor/ckeditor5-basic-styles';
import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, ImageResize } from '@ckeditor/ckeditor5-image';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import List from '@ckeditor/ckeditor5-list/src/list';
import Link from '@ckeditor/ckeditor5-link/src/link';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

export default class CustomEditor extends ClassicEditorBase {}

CustomEditor.builtinPlugins = [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResize,
    Heading,
    Alignment,
    List,
    Link,
    MediaEmbed,
    Table,
    TableToolbar,
    FileRepository
];

CustomEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'alignment',
            'bulletedList',
            'numberedList',
            '|',
            'imageUpload',
            'link',
            'insertTable',
            'mediaEmbed',
            '|',
            'undo',
            'redo'
        ],
        shouldNotGroupWhenFull: true
    },
    // image: {
    //     toolbar: [
    //         'imageStyle:inline',
    //         'imageStyle:wrapText',
    //         'imageStyle:breakText',
    //         '|',
    //         'toggleImageCaption',
    //         'imageTextAlternative',
    //         '|',
    //         'resizeImage'
    //     ],
    //     resizeUnit: '%',
    //     resizeOptions: [
    //         {
    //             name: 'resizeImage:25',
    //             value: '25',
    //             label: '25%'
    //         },
    //         {
    //             name: 'resizeImage:50',
    //             value: '50',
    //             label: '50%'
    //         },
    //         {
    //             name: 'resizeImage:75',
    //             value: '75',
    //             label: '75%'
    //         },
    //         {
    //             name: 'resizeImage:original',
    //             value: null,
    //             label: 'Original'
    //         }
    //     ]
    // },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    alignment: {
        options: ['left', 'center', 'right', 'justify'] // Opciones de alineación
    },
    language: 'es'
};
