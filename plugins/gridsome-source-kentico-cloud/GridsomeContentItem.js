const { ContentItem } = require('kentico-cloud-delivery');
const changeCase = require('change-case');

class GridsomeContentItem extends ContentItem {
    constructor(codename) {
        super({
            propertyResolver: ((fieldName) => {
                return this.getPropertyFieldName(fieldName);
            })
        });

        this.codename = codename;
    }

    getTypeName() {
        const typeName = changeCase.pascalCase(this.codename);

        return typeName;
    }

    getRoute() {
        // TODO: This was `store.slugify` - need to implement something like that rather than a straight case conversion
        let route = `/${this.slugify(this.codename)}/:slug`;
        
        return route;
    }

    slugify(value) {
        return changeCase.kebabCase(value);
    }

    getPropertyFieldName(fieldName) {
        const propertyFieldName = changeCase.camelCase(fieldName);

        return propertyFieldName;
    }

    createNode() {
        const node = this.initNode();

        this.addElements(node);

        return node;
    }

    initNode() {
        // Get system data

        // TODO: Sitemap locations?
        
        const { id, name, codename, language, type, lastModified } = this.system;

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
            taxonomyFields: []
        };

        return node;
    }

    addElements(node) {
        // Add Content Elements as fields to the node

        for (const elementCodename in this.elements) {
            const contentElement = this.elements[elementCodename];
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

                node.item[fieldName] = contentElement.value;

                continue;
            }

            if (contentElement.type === 'taxonomy') {
                const taxonomyField = {
                    fieldName,
                    taxonomyGroup: contentElement.taxonomy_group
                };

                node.taxonomyFields.push(taxonomyField);

                node.item[fieldName] = contentElement.value.map(value => value.codename);

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

module.exports = GridsomeContentItem;