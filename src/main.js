class PlaygroundManager {
    constructor() {
        this.elements = new Map();
        this.selectedElement = null;
        this.initDragAndDrop();
        this.initEventListeners();
    }

    initDragAndDrop() {
        // Initialize sidebar draggables
        $('.draggable-element').draggable({
            helper: 'clone',
            revert: 'invalid',
            appendTo: '#drop-zone',
            cursorAt: { top: 5, left: 5 }
        });

        // Initialize playground droppable
        $('#drop-zone').droppable({
            accept: '.draggable-element',
            drop: (event, ui) => this.handleDrop(event, ui)
        });
    }

    initEventListeners() {
        // Element selection
        $('#drop-zone').on('mousedown', '.element', (e) => {
            this.selectElement(e.target.closest('.element'));
        });

        // Property changes
        $('#properties-panel').on('input change', 'input, select, textarea', (e) => {
            this.handlePropertyChange(e.target);
        });
    }

    handleDrop(event, ui) {
        const type = ui.draggable.data('type');
        const offset = $('#drop-zone').offset();
        const x = event.pageX - offset.left - 20;
        const y = event.pageY - offset.top - 20;
        this.createElement(type, x, y);
    }

    createElement(type, x, y) {
        const element = $(`<div class="element absolute cursor-move" data-type="${type}"></div>`)
            .css({ left: x, top: y })
            .attr('data-id', Date.now());

        switch (type) {
            case 'text':
                element.html('<div class="p-2 resize" contenteditable>Sample Text</div>');
                break;
            case 'image':
                element.html(`
                    <div class="relative">
                        <img src="https://placehold.co/600x400" class="w-full h-full object-contain">
                        <div class="absolute inset-0 border-2 border-dashed border-transparent hover:border-blue-400"></div>
                    </div>
                `);
                break;
            case 'shape':
                element.html(`
                    <svg class="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="#ddd" />
                    </svg>
                `);
                break;
        }

        this.makeElementDraggable(element);
        $('#drop-zone').append(element);
        this.selectElement(element);
    }

    makeElementDraggable(element) {
        element.draggable({
            containment: '#drop-zone',
            cursor: 'move',
            drag: (event, ui) => this.updateElementPosition(element, ui.position)
        });
    }

    selectElement(element) {
        this.selectedElement = $(element);
        this.showPropertiesPanel();
        $('.element').removeClass('border-blue-400');
        this.selectedElement.addClass('border-blue-400');
    }

    showPropertiesPanel() {
        const type = this.selectedElement.data('type');
        const panelContent = this.generatePropertiesForm(type);
        $('#properties-panel').html(panelContent);
    }

    generatePropertiesForm(type) {
        let form = `
            <div class="space-y-4">
                ${this.commonProperties()}
                ${type === 'text' ? this.textProperties() : ''}
                ${type === 'image' ? this.imageProperties() : ''}
                ${type === 'shape' ? this.shapeProperties() : ''}
            </div>
        `;
        return form;
    }

    commonProperties() {
        return `
            <div>
                <label class="block text-sm font-medium mb-1">Width</label>
                <input type="number" class="w-full p-2 border rounded"
                        data-prop="width" value="${this.selectedElement.width() || 100}">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Height</label>
                <input type="number" class="w-full p-2 border rounded"
                        data-prop="height" value="${this.selectedElement.height() || 100}">
            </div>
        `;
    }

    textProperties() {
        const textDiv = this.selectedElement.find('div');
        const currentFont = textDiv.css('font-family') || 'Arial';
        const isBold = textDiv.css('font-weight') === '700';
        const isItalic = textDiv.css('font-style') === 'italic';
        const isUnderline = textDiv.css('text-decoration').includes('underline');

        return `
            <div>
                <label class="block text-sm font-medium mb-1">Font Family</label>
                <select class="w-full p-2 border rounded" data-prop="fontFamily">
                    <option ${currentFont.includes('Arial') ? 'selected' : ''}>Arial</option>
                    <option ${currentFont.includes('Times') ? 'selected' : ''}>Times New Roman</option>
                    <option ${currentFont.includes('Verdana') ? 'selected' : ''}>Verdana</option>
                    <option ${currentFont.includes('Courier') ? 'selected' : ''}>Courier New</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Font Size</label>
                <input type="range" min="8" max="72" 
                        class="w-full" data-prop="fontSize"
                        value="${parseInt(textDiv.css('fontSize')) || 16}">
            </div>
            <div class="flex gap-4">
                <label class="flex items-center gap-1">
                    <input type="checkbox" data-prop="bold" ${isBold ? 'checked' : ''}>
                    Bold
                </label>
                <label class="flex items-center gap-1">
                    <input type="checkbox" data-prop="italic" ${isItalic ? 'checked' : ''}>
                    Italic
                </label>
                <label class="flex items-center gap-1">
                    <input type="checkbox" data-prop="underline" ${isUnderline ? 'checked' : ''}>
                    Underline
                </label>
            </div>
        `;
    }

    imageProperties() {
        return `
            <div>
                <label class="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" class="w-full p-2 border rounded"
                        data-prop="src" value="${this.selectedElement.find('img').attr('src')}">
            </div>
        `;
    }

    shapeProperties() {
        const path = this.selectedElement.find('path');
        return `
            <div>
                <label class="block text-sm font-medium mb-1">SVG Path Data</label>
                <input type="text" class="w-full p-2 border rounded" 
                        data-prop="pathData" value="${path.attr('d') || 'M50 0 L100 50 L50 100 L0 50 Z'}">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Fill Color</label>
                <input type="color" class="w-full p-1 border rounded"
                        data-prop="fill" value="${path.attr('fill') || '#dddddd'}">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Stroke Color</label>
                <input type="color" class="w-full p-1 border rounded"
                        data-prop="stroke" value="${path.attr('stroke') || '#000000'}">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Stroke Width</label>
                <input type="number" class="w-full p-2 border rounded"
                        data-prop="strokeWidth" value="${path.attr('stroke-width') || 1}">
            </div>
        `;
    }

    handlePropertyChange(input) {
        const prop = $(input).data('prop');
        const value = $(input).is(':checkbox') ? $(input).is(':checked') : $(input).val();

        if (!this.selectedElement) return;

        switch (prop) {
            case 'width':
                this.selectedElement.width(value);
                break;
            case 'height':
                this.selectedElement.height(value);
                break;
            case 'fontSize':
                this.selectedElement.find('div').css('fontSize', `${value}px`);
                break;
            case 'src':
                this.selectedElement.find('img').attr('src', value);
                break;
            case 'fill':
                this.selectedElement.find('circle').attr('fill', value);
                break;
            case 'fontFamily':
                this.selectedElement.find('div').css('font-family', value);
                break;
            case 'bold':
                this.selectedElement.find('div').css('font-weight', value ? 'bold' : 'normal');
                break;
            case 'italic':
                this.selectedElement.find('div').css('font-style', value ? 'italic' : 'normal');
                break;
            case 'underline':
                this.selectedElement.find('div').css('text-decoration', value ? 'underline' : 'none');
                break;
            case 'pathData':
                this.selectedElement.find('path').attr('d', value);
                break;
            case 'stroke':
                this.selectedElement.find('path').attr('stroke', value);
                break;
            case 'strokeWidth':
                this.selectedElement.find('path').attr('stroke-width', value);
                break;
        }
    }

    updateElementPosition(element, position) {
        element.css({
            left: position.left,
            top: position.top
        });
    }
}

// Initialize application
$(document).ready(() => {
    new PlaygroundManager();
});