import React from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';

const ContentEditor = (props: ReactQuillProps) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <ReactQuill
            theme="snow"
            modules={modules}
            {...props}
        />
    );
};

export default ContentEditor;