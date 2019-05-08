/**
 * This script loads CKEditor for textareas with editor attribute.
 * Attribute value means editor toolbar configuration (Minimal, Medium, Full, Default)
 */
var editor = {};

var CKEDITOR_BASEPATH = '/ck/';

editor.config = {
    entities: false,
    removePlugins: 'elementspath',
    customConfig: '',
    contentsCss: ['/css/main.css', '/css/editor.css'],
    fullPage: false,
    filebrowserUploadUrl: '/up',
    disableNativeSpellChecker: false,
    disableReadonlyStyling: true,
    extraAllowedContent: {
        '*': {
            classes: '*',
            attributes: 'id'
        }
    },

    toolbar: 'Medium',
    toolbar_Default: [
        ['Source'],
        ['Maximize', 'ShowBlocks'],
        ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
        ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
        ['Link', 'Unlink'],
        ['Image', 'Table', 'HorizontalRule', 'SpecialChar'],
        '/',
        ['Bold', 'Italic', 'Underline', 'Strike'],
        ['Format', 'Font', 'FontSize'],
        ['Subscript', 'Superscript'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['TextColor', 'BGColor']
    ],

    toolbar_Medium: [
        {name: 'styles', items: ['Styles', 'Format']},
        {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        },
        {name: 'clipboard', items: ['PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
        {name: 'paragraph', items: ['NumberedList', 'BulletedList']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']}
    ],

    toolbar_Full: [
        {name: 'styles', items: ['Styles', 'Format']},
        {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        },
        {name: 'clipboard', items: ['PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
        {name: 'paragraph', items: ['NumberedList', 'BulletedList']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']},
        {name: 'tools', items: ['Maximize', 'ShowBlocks', 'Source']}
    ],

    toolbar_Minimal: [
        {name: 'styles', items: ['Format']},
        {name: 'basicstyles', items: ['Bold', 'Strike', '-', 'RemoveFormat']},
        {name: 'clipboard', items: ['PasteText', '-', 'Undo', 'Redo']},
        {name: 'paragraph', items: ['NumberedList', 'BulletedList']},
        {name: 'links', items: ['Link', 'Unlink']},
        {name: 'tools', items: ['Maximize']}
    ]

    /*
     * Full toolbar
     { name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
     { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
     { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
     { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
     '/',
     { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
     { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
     { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
     { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
     '/',
     { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
     { name: 'colors', items : [ 'TextColor','BGColor' ] },
     { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
     */
};

editor.inited = false;
editor.init = function () {

    if (editor.inited) {
        return;
    }
    editor.inited = true;
    $('<script src="/ck/ckeditor.js"></script>').appendTo('head');
    CKEDITOR.basePath = '/ck/';
    CKEDITOR.plugins.basePath = '/ck/plugins/';

    CKEDITOR.on('dialogDefinition', function (ev) {
        //noinspection SwitchStatementWithNoDefaultBranchJS
        switch (ev.data.name) {
            case 'link':
                ev.data.definition.removeContents('advanced');
                ev.data.definition.removeContents('target');
                break;
            case 'image':
                ev.data.definition.removeContents('advanced');
                ev.data.definition.removeContents('Link');
                break;
            case 'flash':
                ev.data.definition.removeContents('advanced');
                ev.data.definition.removeContents('Upload');
        }
    });

};

editor.inject = function () {

    $('textarea').each(function () {
        if ($(this).attr('editor') || $(this).hasClass('editor')) {
            editor.init();
            // backwards compatibility
            if ($(this).attr('bodyClass')) {
                editor.config.bodyClass = $(this).attr('bodyClass');
            }
            if ($(this).attr('editor')) {
                editor.config.toolbar = $(this).attr('editor');
            }
            // /backwards compatibility

            if ($(this).attr('fileupload')) {
                editor.config['filebrowserUploadUrl'] = '/uploadimage/';
            }

            CKEDITOR.replace(this, editor.config);
        }
    });
};

editor.clean = function () {

    if (typeof CKEDITOR !== 'undefined' && typeof CKEDITOR.instances !== 'undefined') {
        for (var instance in CKEDITOR.instances) {
            try {
                //noinspection JSUnfilteredForInLoop
                CKEDITOR.instances[instance].destroy(true);
            } catch (err) {
                console.warn('Error: ', err.message);
            }
        }
    }
};

editor.flush = function () {

    if (typeof CKEDITOR !== 'undefined' && typeof CKEDITOR.instances !== 'undefined') {
        for (var instance in CKEDITOR.instances) {
            //noinspection JSUnfilteredForInLoop
            CKEDITOR.instances[instance].updateElement();
        }
    }

};

$(document).ready(editor.inject);

// поддержка switcher
$(document).on('construct', editor.inject);
$(document).on('destruct', editor.clean);

// поддержка ajaxer
$(document).on('form-submit', editor.flush);
