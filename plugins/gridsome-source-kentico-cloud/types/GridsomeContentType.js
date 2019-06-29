const changeCase = require('change-case');

class GridsomeContentType {
    constructor(contentType) {
        this.contentType = contentType;
    }

    getCodename() {
        return this.contentType.system.codename;
    }

    getTypeName() {
        const typeName = changeCase.pascalCase(this.getCodename());

        return typeName;
    }

    getRoute() {
        // TODO: This was `store.slugify` - need to implement something like that rather than a straight case conversion
        let route = `/${this.slugify(this.getCodename())}/:slug`;
        
        return route;
    }

    slugify(value) {
        return changeCase.kebabCase(value);
    }

    createContentNodes(content) {
        const { items: contentItems, linkedItems } = content;

        const contentNodes = contentItems.map(contentItem => this.createContentNode(contentItem, linkedItems));

        return contentNodes;
    }

    createContentNode(contentItem, linkedItems) {
        // Get system data

        // TODO: Sitemap locations?

        const { system: { id, name, codename, language, type, lastModified }, elements } = contentItem;

        // Initialise a content node with fields from system data, which should be consistent across all nodes

        const node = {
            item: {
                id,
                name,
                codename,
                language,
                type,
                lastModified: new Date(lastModified),
                slug: this.slugify(name)
            },
            linkedItemFields: [],
            linkedItems,
            taxonomyFields: []
        };
            
        // Add Content Elements as fields to the node

        for (const elementCodename in elements) {
            const contentElement = elements[elementCodename];
            contentElement.codename = elementCodename;

            // TODO:
            // * Asset
            // * Rich text
            // * Custom element

            const fieldName = this.getElementFieldName(contentElement);

            if (contentElement.type === 'modular_content') {
                const linkedItemField = {
                    fieldName,
                    value: contentElement.value
                };
                
                node.linkedItemFields.push(linkedItemField);

                continue;
            }

            if (contentElement.type === 'taxonomy') {
                const taxonomyField = {
                    fieldName,
                    taxonomyGroup: contentElement.taxonomy_group
                };

                node.taxonomyFields.push(taxonomyField);

                continue;
            }

            const elementResolver = this.getElementResolver(contentElement);

            if (typeof(elementResolver) === 'undefined') {
                continue;
            }

            // Get the element's value

            const fieldValue = elementResolver(contentElement);
            
            // Add the content element as a "custom" field on the node

            node.item[fieldName] = fieldValue;
        }

        return node;
    }

    getElementFieldName(contentElement) {
        if (contentElement.type === 'url_slug') {
            return 'slug';
        }

        const fieldName = changeCase.camelCase(contentElement.codename);

        return fieldName;
    }

    getElementResolver(contentElement) {
        let elementResolver = this.getFieldElementResolver(contentElement);

        if (elementResolver === null) {
            elementResolver = this.getTypeElementResolver(contentElement);
        }

        return elementResolver;
    }

    getFieldElementResolver(contentElement) {
        const fieldName = this.getElementFieldName(contentElement);

        const elementResolver = this[fieldName + 'ElementResolver'];

        if (typeof(elementResolver) === 'undefined') {
            return null;
        }

        return elementResolver;
    }

    getTypeElementResolver(contentElement) {
        const typeName = changeCase.camelCase(contentElement.type);

        const elementResolver = this[typeName + 'TypeElementResolver'];

        if (typeof(elementResolver) === 'undefined') {
            return this.defaultElementResolver;
        }

        return elementResolver;
    }

    numberTypeElementResolver(contentElement, contentItem) {
        return Number(contentElement.value);
    }

    dateTimeTypeElementResolver(contentElement, contentItem) {
        return new Date(contentElement.value);
    }

    multipleChoiceTypeElementResolver(contentElement, contentItem) {
        return contentElement.value.map(value => value.name);
    }

    taxonomyTypeElementResolver(contentElement, contentItem) {
        return contentElement.value.map(value => value.codename);
    }

    defaultElementResolver(contentElement, contentItem) {
        return contentElement.value;
    }
}

module.exports = GridsomeContentType;