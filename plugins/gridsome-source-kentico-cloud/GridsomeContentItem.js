const { ContentItem } = require('kentico-cloud-delivery');
const changeCase = require('change-case');
const url = require('url');

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
        // TODO: This used to use `store.slugify` - need to look into what that does and use that here
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
            assetFields: [],
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

            if (element.type === 'asset') {
                // The AssetModel doesn't have width and height, but the element value does so we will map those values across

                field.assets = field.assets.map(asset => {
                    const url = asset.url;

                    element.value
                        .filter(elementAsset => elementAsset.url === url)
                        .map(elementAsset => {
                            asset.width = elementAsset.width;
                            asset.height = elementAsset.height;
                        });

                    // We also need to extract the id from the url

                    asset.id = this.getAssetId(url);

                    return asset;
                });
            }

            field.fieldName = fieldName;

            // TODO:
            // * Rich text
            // * Custom element

            const fieldResolver = this.getFieldResolver(field);

            fieldResolver(node, field);
        }
    }

    getAssetId(assetUrl) {
        const url = new URL(assetUrl);
        const pathname = url.pathname;

        // The id is the second part of the path
        const pathParts = pathname.split('/', 3);

        return pathParts[2];
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

    assetTypeFieldResolver(node, field) {
        const fieldName = field.fieldName;
        const assets = field.assets;
        const value = assets.map(asset => asset.id);

        const assetField = {
            fieldName,
            assets
        };
        
        node.assetFields.push(assetField);

        node.item[fieldName] = value;
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