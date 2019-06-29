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

        this.addFields(node);

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

    addFields(node) {
        // Add Content Elements as fields to the node

        for (const codename in this.elements) {
            const element = this.elements[codename];
            const fieldName = this.getPropertyFieldName(codename);
            let field = this[fieldName];

            if (element.type === 'modular_content') {
                // "Linked items" fields are different to all others for some reason so we force it to be more uniform

                field = {
                    name: element.name,
                    type: element.type,
                    value: element.value,
                    linkedItems: field
                };
            }

            field.fieldName = fieldName;

            // TODO:
            // * Asset
            // * Rich text
            // * Custom element

            const fieldResolver = this.getFieldResolver(field);

            fieldResolver(node, field);
        }
    }

    getElementFieldName(contentElement) {
        if (contentElement.type === 'url_slug') {
            return 'slug';
        }

        const fieldName = changeCase.camelCase(contentElement.codename);

        return fieldName;
    }

    getFieldResolver(field) {
        let fieldResolver = this.getFieldNameFieldResolver(field);

        if (fieldResolver === null) {
            fieldResolver = this.getFieldTypeFieldResolver(field);
        }

        return fieldResolver;
    }

    getFieldNameFieldResolver(field) {
        const fieldName = field.fieldName;

        const fieldResolver = this[fieldName + 'FieldResolver'];

        if (typeof(fieldResolver) === 'undefined') {
            return null;
        }

        return fieldResolver;
    }

    getFieldTypeFieldResolver(field) {
        const typeName = changeCase.camelCase(field.type);

        const fieldResolver = this[typeName + 'TypeFieldResolver'];

        if (typeof(fieldResolver) === 'undefined') {
            return this.defaultFieldResolver;
        }

        return fieldResolver;
    }

    numberTypeFieldResolver(node, field) {
        const fieldName = field.fieldName;
        const value = Number(field.value);

        node.item[fieldName] = value;
    }

    dateTimeTypeFieldResolver(node, field) {
        const fieldName = field.fieldName;
        const value = new Date(field.value);

        node.item[fieldName] = value;
    }

    multipleChoiceTypeFieldResolver(node, field) {
        const fieldName = field.fieldName;
        const value = field.value.map(choice => choice.name);

        node.item[fieldName] = value;
    }

    modularContentTypeFieldResolver(node, field) {
        const fieldName = field.fieldName;
        const linkedItems = field.linkedItems;
        const value = field.value;

        const linkedItemField = {
            fieldName,
            linkedItems
        };
        
        node.linkedItemFields.push(linkedItemField);

        node.item[fieldName] = value;
    }

    taxonomyTypeFieldResolver(node, field) {
        const fieldName = field.fieldName;
        const value = field.taxonomyTerms.map(term => term.codename);
        const taxonomyGroup = field.taxonomyGroup;

        node.item[fieldName] = value;

        const taxonomyField = {
            fieldName,
            taxonomyGroup
        };

        node.taxonomyFields.push(taxonomyField);
    }

    urlSlugTypeFieldResolver(node, field) {
        const value = field.value;

        node.item.slug = value;
    }

    defaultFieldResolver(node, field) {
        const fieldName = field.fieldName;
        const value = field.value;

        node.item[fieldName] = value;
    }
}

module.exports = GridsomeContentItem;